import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { ProductsPageClient } from "./page-client";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const categorySlug = sp?.category;

  let title = "Mağaza - 3D Magza";
  let description =
    "3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. En kaliteli 3D baskı ürünlerini keşfedin.";

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { name: true },
    });
    if (category) {
      title = `${category.name} - 3D Magza`;
      description = `${category.name} kategorisindeki 3D baskı ürünleri. En kaliteli ${category.name.toLowerCase()} modellerini keşfedin.`;
    }
  }

  return {
    title,
    description,
    openGraph: { title, description, locale: "tr_TR" },
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const categorySlug = sp?.category;

  const where: Record<string, unknown> = { isPublished: true };

  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) where.categoryId = cat.id;
  }

  const products = await prisma.product.findMany({
    where: where as any,
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    comparePrice: p.comparePrice,
    images: JSON.parse(p.images || "[]") as string[],
    material: p.material,
    colors: p.colors,
    stock: p.stock,
  }));

  return <ProductsPageClient products={serializedProducts} />;
}
