import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const { id } = await params;

  const upload = await prisma.customUpload.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!upload) {
    return NextResponse.json({ error: "Talep bulunamadı" }, { status: 404 });
  }

  if (upload.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  return NextResponse.json(upload);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    if (session.user.role === "ADMIN") {
      // Fetch current upload to detect status change
      const current = await prisma.customUpload.findUnique({ where: { id } });
      if (!current) {
        return NextResponse.json({ error: "Talep bulunamadı" }, { status: 404 });
      }

      const upload = await prisma.customUpload.update({
        where: { id },
        data: {
          status: body.status,
          adminNote: body.adminNote || null,
          estimatedPrice: body.estimatedPrice ? parseFloat(body.estimatedPrice) : null,
          estimatedDays: body.estimatedDays ? parseInt(body.estimatedDays) : null,
          isPrintable: body.isPrintable ?? null,
          rejectionReason: body.rejectionReason || null,
        },
      });

      // Auto-create order when status changes to APPROVED
      if (body.status === "APPROVED" && current.status !== "APPROVED" && !current.orderId) {
        const price = body.estimatedPrice
          ? parseFloat(body.estimatedPrice)
          : current.estimatedPrice;
        if (!price) {
          return NextResponse.json(
            { error: "Sipariş oluşturmak için fiyat belirleyin" },
            { status: 400 }
          );
        }

        const address = await prisma.address.findFirst({
          where: { userId: current.userId },
          orderBy: { isDefault: "desc" },
        });
        if (!address) {
          return NextResponse.json(
            { error: "Müşterinin kayıtlı adresi yok" },
            { status: 400 }
          );
        }

        const orderNumber = "UPL-" + crypto.randomUUID().split("-")[0].toUpperCase();

        const shippingAmount = price >= 500 ? 0 : 49.9;
        const totalAmount = price + shippingAmount;

        await prisma.order.create({
          data: {
            orderNumber,
            userId: current.userId,
            totalAmount,
            shippingAmount,
            paymentMethod: "TRANSFER",
            paymentStatus: "PENDING",
            addressId: address.id,
            customUpload: { connect: { id } },
            payment: {
              create: {
                method: "TRANSFER",
                amount: totalAmount,
                status: "PENDING",
              },
            },
            items: {
              create: {
                quantity: 1,
                unitPrice: price,
                totalPrice: price,
              },
            },
          },
        });
      }

      return NextResponse.json(upload);
    }

    const upload = await prisma.customUpload.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!upload) {
      return NextResponse.json({ error: "Talep bulunamadı" }, { status: 404 });
    }

    const updated = await prisma.customUpload.update({
      where: { id },
      data: { customerApproved: body.customerApproved ?? undefined },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}
