import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const validateSchema = z.object({
  code: z.string().min(1).transform((s) => s.toUpperCase()),
  totalAmount: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = validateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ valid: false, error: "Geçersiz istek" }, { status: 400 });
    }

    const { code, totalAmount } = parsed.data;

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, error: "Geçersiz kupon kodu" });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ valid: false, error: "Kupon süresi dolmuş" });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: "Kupon kullanım limiti dolmuş" });
    }

    if (totalAmount < coupon.minPurchase) {
      return NextResponse.json({
        valid: false,
        error: `Minimum ${coupon.minPurchase.toFixed(2)} ₺ alışveriş gerekiyor`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Math.round((totalAmount * coupon.discountValue) / 100 * 100) / 100;
      if (discountAmount > totalAmount) discountAmount = totalAmount;
    } else {
      discountAmount = Math.min(coupon.discountValue, totalAmount);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount: Math.round((totalAmount - discountAmount) * 100) / 100,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Doğrulama başarısız" }, { status: 500 });
  }
}
