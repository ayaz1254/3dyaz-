/**
 * POST /api/payment/iyzico-init
 *
 * Creates an order with CREDIT_CARD payment method and initializes
 * iyzico 3D Secure payment. Returns threeDSHtmlContent to render
 * the bank's OTP page in the user's browser.
 *
 * Flow:
 *   1. Validate input (items, address, card details, coupon)
 *   2. Calculate totals (including shipping, coupon discount)
 *   3. Create Order + Payment record
 *   4. Call iyzico Init 3DS with callbackUrl containing orderId
 *   5. Return threeDSHtmlContent (base64) + orderId
 *
 * Card details go to iyzico API, NOT stored in our database.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { init3DS, isIyzicoConfigured, IyzicoError } from "@/lib/iyzico";
import { sendNewOrderAdminNotification } from "@/lib/email";

const cardSchema = z.object({
  cardHolderName: z.string().min(1, "Kart üzerindeki isim gerekli"),
  cardNumber: z.string().min(16, "Geçerli kart numarası girin").max(19),
  expireMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Geçersiz ay"),
  expireYear: z.string().regex(/^\d{2}$/, "Geçersiz yıl"),
  cvc: z.string().regex(/^\d{3,4}$/, "Geçersiz CVC"),
});

const initSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Ürün ID gerekli"),
        quantity: z.number().int().positive("Adet pozitif olmalıdır"),
        name: z.string().optional(),
      })
    )
    .min(1, "En az bir ürün gerekli"),
  addressId: z.string().min(1, "Adres gerekli"),
  card: cardSchema,
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  if (!isIyzicoConfigured()) {
    return NextResponse.json(
      { error: "Ödeme sistemi yapılandırılmamış. Lütfen daha sonra tekrar deneyin." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parsed = initSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { items, addressId, card, couponCode, notes } = parsed.data;

    // Validate address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id },
    });
    if (!address) {
      return NextResponse.json({ error: "Geçersiz adres" }, { status: 400 });
    }

    // Generate order number
    const orderNumber = "3DM-" + crypto.randomUUID().split("-")[0].toUpperCase();

    // Calculate totals
    let totalAmount = 0;
    const orderItems: { productId: string; quantity: number; unitPrice: number; totalPrice: number }[] = [];
    const basketItems: { id: string; name: string; category1: string; itemType: string; price: string }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { category: { select: { name: true } } },
      });

      if (!product || !product.isPublished) {
        return NextResponse.json(
          { error: `${item.name} bulunamadı` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} için yeterli stok yok` },
          { status: 400 }
        );
      }

      const unitPrice = product.price;
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });

      basketItems.push({
        id: product.id,
        name: product.name,
        category1: product.category?.name || "Genel",
        itemType: product.isDigital ? "VIRTUAL" : "PHYSICAL",
        price: unitPrice.toFixed(2),
      });
    }

    const itemsTotal = totalAmount; // save before shipping/discount
    const shippingAmount = totalAmount >= 500 ? 0 : 49.9;
    totalAmount += shippingAmount;

    let discountAmount = 0;
    let appliedCouponCode: string | undefined;
    let couponDescription = "";
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        if (!coupon.expiresAt || new Date() <= coupon.expiresAt) {
          if (coupon.maxUses === 0 || coupon.usedCount < coupon.maxUses) {
            const productTotal = totalAmount - shippingAmount;
            if (productTotal >= coupon.minPurchase) {
              if (coupon.discountType === "PERCENTAGE") {
                discountAmount = Math.round((productTotal * coupon.discountValue) / 100 * 100) / 100;
              } else {
                discountAmount = Math.min(coupon.discountValue, productTotal);
              }
              discountAmount = Math.min(discountAmount, productTotal);
              appliedCouponCode = couponCode.toUpperCase();
              couponDescription = `Kupon: ${couponCode} (${discountAmount.toFixed(2)} ₺ indirim)`;
            }
          }
        }
      }
    }
    totalAmount = Math.round((totalAmount - discountAmount) * 100) / 100;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          totalAmount,
          shippingAmount,
          paymentMethod: "CREDIT_CARD",
          notes: [notes, couponDescription].filter(Boolean).join(" | ") || null,
          addressId,
          payment: {
            create: {
              method: "CREDIT_CARD",
              amount: totalAmount,
              status: "PENDING",
            },
          },
          items: {
            create: orderItems,
          },
        },
        include: { items: true, payment: true, user: { select: { name: true, email: true } }, address: true },
      });

      // Update stock
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (discountAmount > 0 && appliedCouponCode) {
        await tx.coupon.update({
          where: { code: appliedCouponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    // Notify admin of new order
    sendNewOrderAdminNotification({
      orderNumber,
      customerName: session.user.name || "Müşteri",
      customerEmail: session.user.email || "",
      totalAmount,
      paymentMethod: "CREDIT_CARD",
      items: orderItems.map((oi) => ({
        name: items.find((ri: { productId: string; name?: string }) => ri.productId === oi.productId)?.name || "Ürün",
        quantity: oi.quantity,
        price: oi.unitPrice,
      })),
    });

    // Build callback URL with orderId
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${req.headers.get("origin") || "http://localhost:3000"}`;
    const callbackUrl = `${baseUrl}/api/payment/iyzico-callback?orderId=${order.id}`;

    // Split user name for iyzico format
    const userName = order.user?.name || "Değerli Müşteri";
    const nameParts = userName.split(" ");
    const firstName = nameParts[0] || "Değerli";
    const lastName = nameParts.slice(1).join(" ") || "Müşteri";

    // Call iyzico Init 3DS
    const iyzicoResult = await init3DS({
      locale: "tr",
      conversationId: order.id,
      price: itemsTotal.toFixed(2), // basket items total (before shipping/discount)
      paidPrice: totalAmount.toFixed(2),
      currency: "TRY",
      installment: "1",
      basketId: order.id,
      paymentChannel: "WEB",
      paymentGroup: "PRODUCT",
      callbackUrl,
      paymentCard: {
        cardHolderName: card.cardHolderName,
        cardNumber: card.cardNumber.replace(/\s/g, ""),
        expireMonth: card.expireMonth,
        expireYear: card.expireYear,
        cvc: card.cvc,
        registerCard: "0",
      },
      buyer: {
        id: session.user.id,
        name: firstName,
        surname: lastName,
        email: order.user?.email || "",
        identityNumber: "11111111111", // Sandbox TCKN; production'da kullanıcıdan alınmalı
        registrationAddress: `${order.address.fullAddress}, ${order.address.district}, ${order.address.city}`,
        city: order.address.city,
        country: "Turkey",
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "127.0.0.1",
      },
      shippingAddress: {
        contactName: order.address.fullName,
        city: order.address.city,
        country: "Turkey",
        address: order.address.fullAddress,
      },
      billingAddress: {
        contactName: order.address.fullName,
        city: order.address.city,
        country: "Turkey",
        address: order.address.fullAddress,
      },
      basketItems: basketItems.map((bi, i) => ({
        ...bi,
        id: bi.id || `item-${i}`,
        price: bi.price,
      })),
    });

    // Store iyzico paymentId if returned in init response
    if (iyzicoResult.paymentId) {
      await prisma.payment.update({
        where: { orderId: order.id },
        data: {
          iyzicoPaymentId: iyzicoResult.paymentId,
          iyzicoConversationId: order.id,
        },
      });
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      threeDSHtmlContent: iyzicoResult.threeDSHtmlContent,
    });
  } catch (error) {
    if (error instanceof IyzicoError) {
      return NextResponse.json(
        { error: `Ödeme hatası: ${error.message}`, code: error.code },
        { status: 400 }
      );
    }

    console.error("[iyzico-init] Unexpected error:", error);
    return NextResponse.json(
      { error: "Sipariş oluşturulamadı" },
      { status: 500 }
    );
  }
}
