import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const createCouponSchema = z.object({
  code: z.string().min(1, "Kupon kodu gerekli").max(50).transform((s) => s.toUpperCase()),
  discountType: z.enum(["PERCENTAGE", "FIXED"], { message: "Geçersiz indirim türü" }),
  discountValue: z.number().positive("İndirim değeri pozitif olmalı"),
  minPurchase: z.number().min(0).optional().default(0),
  maxUses: z.number().int().min(0).optional().default(0),
  expiresAt: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createCouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    const { code, discountType, discountValue, minPurchase, maxUses, expiresAt } = parsed.data;

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Bu kod zaten mevcut" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        discountType,
        discountValue,
        minPurchase,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Kupon oluşturulamadı" }, { status: 500 });
  }
}
