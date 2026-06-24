import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const createReviewSchema = z.object({
  productId: z.string().min(1, "Ürün ID gerekli"),
  rating: z.number().int().min(1, "Puan 1-5 arası olmalı").max(5, "Puan 1-5 arası olmalı"),
  comment: z.string().max(1000).optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const pending = searchParams.get("pending") === "true";

  const where: Record<string, unknown> = {};

  if (productId) where.productId = productId;

  if (pending) {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
    where.isApproved = false;
  } else {
    where.isApproved = true;
  }

  const reviews = await prisma.review.findMany({
    where: where as any,
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veri" },
        { status: 400 }
      );
    }

    const { productId, rating, comment } = parsed.data;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isPublished) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId, userId: session.user.id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Bu ürüne zaten yorum yaptınız" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        comment: comment || null,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Yorum eklenemedi" }, { status: 500 });
  }
}
