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

  let title = "Tüm Ürünler - 3D Magza";
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
  const search = sp?.q;
  const minPrice = sp?.minPrice;
  const maxPrice = sp?.maxPrice;
  const sort = sp?.sort || "newest";
  const material = sp?.material;
  const page = Math.max(1, parseInt(sp?.page || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };

  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) where.categoryId = cat.id;
  }

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter.gte = parseFloat(minPrice);
    if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
    where.price = priceFilter;
  }

  if (material) {
    where.material = material;
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };

  const [products, total, categories, materials] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      include: { category: { select: { name: true, slug: true } } },
      skip,
      take: limit,
      orderBy: orderBy as any,
    }),
    prisma.product.count({ where: where as any }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { isPublished: true, material: { not: null } },
      select: { material: true },
      distinct: ["material"],
      orderBy: { material: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const uniqueMaterials = materials.map((m) => m.material).filter(Boolean) as string[];

  const serializedProducts = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || "[]") as string[],
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const serializedCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
  }));

  return (
    <ProductsPageClient
      products={serializedProducts}
      categories={serializedCategories}
      materials={uniqueMaterials}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      currentSort={sort}
      currentCategory={categorySlug}
      currentSearch={search}
      currentMinPrice={minPrice}
      currentMaxPrice={maxPrice}
      currentMaterial={material}
    />
  );
}
