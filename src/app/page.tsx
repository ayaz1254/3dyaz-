import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      include: { category: { select: { name: true, slug: true } } },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <HomeClient
      featuredProducts={featuredProducts.map((p) => ({
        ...p,
        comparePrice: p.comparePrice ?? null,
        images: JSON.parse(p.images || "[]") as string[],
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))}
      categories={categories}
    />
  );
}
