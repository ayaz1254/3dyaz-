import { prisma } from "@/lib/prisma";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  material: string | null;
  colors: string | null;
  category: { name: string; slug: string } | null;
  createdAt: string;
}

export default async function HomePage() {
  const rawProducts = await prisma.product.findMany({
    where: { isPublished: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const products: ProductData[] = rawProducts.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]"),
    colors: p.colors || "[]",
    createdAt: p.createdAt.toISOString(),
  }));

  const featuredProducts = products.slice(0, 4);

  return <HomeClient products={products} featuredProducts={featuredProducts} />;
}
