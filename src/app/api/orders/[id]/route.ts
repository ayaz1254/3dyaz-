import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { sendOrderStatusNotification } from "@/lib/email";

const orderStatusEnum = z.enum(
  ["PENDING", "APPROVED", "PRINTING", "SHIPPED", "DELIVERED", "CANCELLED"],
  { message: "Geçersiz sipariş durumu" }
);

const updateOrderSchema = z.object({
  status: orderStatusEnum,
  cargoCompany: z.string().optional().default(""),
  cargoTrackingNo: z.string().optional().default(""),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { name: true, images: true } } } },
      payment: true,
      address: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }

  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  return NextResponse.json(order);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
  }

  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "Sadece bekleyen siparişler iptal edilebilir" },
      { status: 400 }
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Restore stock
      const items = await tx.orderItem.findMany({
        where: { orderId: id },
      });
      for (const item of items) {
        if (!item.productId) continue;
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      await tx.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
    });

    return NextResponse.json({ message: "Sipariş iptal edildi" });
  } catch {
    return NextResponse.json({ error: "İptal başarısız" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", fields: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
        { status: 400 }
      );
    }

    const { status, cargoCompany, cargoTrackingNo } = parsed.data;

    const oldOrder = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!oldOrder) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        cargoCompany: cargoCompany || null,
        cargoTrackingNo: cargoTrackingNo || null,
      },
    });

    if (oldOrder.status !== status) {
      sendOrderStatusNotification({
        to: oldOrder.user.email,
        customerName: oldOrder.user.name || "Değerli Müşterimiz",
        orderNumber: order.orderNumber,
        oldStatus: oldOrder.status,
        newStatus: status,
        cargoCompany,
        cargoTrackingNo,
        totalAmount: order.totalAmount,
      });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Sipariş güncellenemedi" },
      { status: 500 }
    );
  }
}
