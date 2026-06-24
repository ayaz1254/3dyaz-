import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const orderSchema = z.object({
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
  paymentMethod: z.enum(["TRANSFER", "COD"], "Geçersiz ödeme yöntemi"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { items, addressId, paymentMethod, notes } = parsed.data;

    // Validate address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: session.user.id },
    });
    if (!address) {
      return NextResponse.json({ error: "Geçersiz adres" }, { status: 400 });
    }

    // Generate order number (cryptographically random)
    const orderNumber = "3DM-" + crypto.randomUUID().split("-")[0].toUpperCase();

    // Calculate totals
    let totalAmount = 0;
    const orderItems: { productId: string; quantity: number; unitPrice: number; totalPrice: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
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
    }

    const shippingAmount = totalAmount >= 500 ? 0 : 49.9;
    totalAmount += shippingAmount;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          totalAmount,
          shippingAmount,
          paymentMethod: paymentMethod as "TRANSFER" | "COD",
          notes: notes || null,
          addressId,
          payment: {
            create: {
              method: paymentMethod as "TRANSFER" | "COD",
              amount: totalAmount,
              status: "PENDING",
            },
          },
          items: {
            create: orderItems,
          },
        },
        include: { items: true, payment: true },
      });

      // Update stock
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ orderId: order.id, orderNumber }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Sipariş oluşturulamadı" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(orders);
}
