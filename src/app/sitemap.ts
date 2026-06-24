import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://3dmagza.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/urunler`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/yukle`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const { prisma } = await import("@/lib/prisma");

    const products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    productPages = products.map((product) => ({
      url: `${baseUrl}/urunler/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const categories = await prisma.category.findMany({
      select: { slug: true },
    });

    categoryPages = categories.map((category) => ({
      url: `${baseUrl}/urunler?category=${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.warn("[sitemap] DB not available during build, using static-only sitemap");
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
