import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      name: { contains: q },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    products: products.map((p) => ({
      ...p,
      price: Number(p.price),
      image: JSON.parse(p.images || "[]")[0] || "",
    })),
  });
}
