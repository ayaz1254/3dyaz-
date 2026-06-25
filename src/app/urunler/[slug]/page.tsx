import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "./add-to-cart";
import { DynamicModelViewer } from "@/components/dynamic-model-viewer";
import { ReviewSection } from "./review-section";
import { GlassCard } from "@/components/glass-card";
import { ScrollReveal } from "@/components/scroll-reveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      shortDesc: true,
      price: true,
      images: true,
      category: { select: { name: true } },
    },
  });

  if (!product) return { title: "Ürün Bulunamadı - 3D Magza" };

  const images: string[] = JSON.parse(product.images || "[]");
  const description = product.shortDesc || product.description.slice(0, 160);

  return {
    title: `${product.name} - 3D Magza`,
    description,
    openGraph: {
      title: `${product.name} - 3D Magza`,
      description,
      type: "website",
      locale: "tr_TR",
      siteName: "3D Magza",
      images: images.length > 0
        ? [{ url: images[0], width: 1200, height: 1200, alt: product.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - 3D Magza`,
      description,
      images: images.length > 0 ? [images[0]] : [],
    },
    alternates: {
      canonical: `/urunler/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: { select: { name: true, slug: true } } },
  });

  if (!product) notFound();

  const images: string[] = JSON.parse(product.images || "[]");
  const colors: string[] = JSON.parse(product.colors || "[]");

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isPublished: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.description.slice(0, 200),
    image: images.length > 0 ? images : undefined,
    offers: {
      "@type": "Offer",
      price: Number(product.price),
      priceCurrency: "TRY",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/urunler/${product.slug}`,
    },
    ...(product.category?.name ? { category: product.category.name } : {}),
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="transition hover:text-white">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/urunler" className="transition hover:text-white">Ürünler</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/urunler?category=${product.category.slug}`}
              className="transition hover:text-white"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-300">{product.name}</span>
      </nav>

      {/* Product */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Images */}
        <div>
          {images[0] ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-800/30">
              <img
                src={images[0]}
                alt={product.name}
                className="w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-gray-800/30">
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Görsel Yok</span>
              </div>
            </div>
          )}
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-gray-800/30 transition hover:border-cyan-500/50"
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* 3D Model Preview */}
          {product.fileUrl && /\.(stl|obj|3mf)$/i.test(product.fileUrl) && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400">
                3D Model Önizleme
              </h3>
              <DynamicModelViewer url={product.fileUrl} />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <Link
              href={`/urunler?category=${product.category.slug}`}
              className="mb-3 inline-block rounded-full bg-cyan-500/10 px-4 py-1 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            {product.name}
          </h1>

          <div className="mb-6 flex items-baseline gap-4">
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              {Number(product.price).toFixed(2)} ₺
            </span>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <span className="text-xl text-gray-500 line-through">
                {Number(product.comparePrice).toFixed(2)} ₺
              </span>
            )}
          </div>

          {product.shortDesc && (
            <p className="mb-8 text-lg leading-relaxed text-gray-400">{product.shortDesc}</p>
          )}

          {/* Specs */}
          <GlassCard glowColor="rgba(56, 189, 248, 0.06)">
            <div className="space-y-4 p-5">
              {product.material && (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">Malzeme</span>
                  <span className="text-sm font-medium text-white">{product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">Boyutlar</span>
                  <span className="text-sm font-medium text-white">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">Ağırlık</span>
                  <span className="text-sm font-medium text-white">{product.weight}g</span>
                </div>
              )}
              {colors.length > 0 && (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">Renkler</span>
                  <span className="text-sm font-medium text-white">{colors.join(", ")}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Stok Durumu</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {product.stock > 0 ? `${product.stock} adet` : "Tükendi"}
                </span>
              </div>
            </div>
          </GlassCard>

          <div className="mt-6">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={Number(product.price)}
              image={images[0] || ""}
              slug={product.slug}
              disabled={product.stock <= 0}
            />
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-white">Ürün Açıklaması</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-400">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <ReviewSection productId={product.id} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-2xl font-bold text-white">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {relatedProducts.map((rp, i) => {
              const rpImages: string[] = JSON.parse(rp.images || "[]");
              return (
                <ScrollReveal key={rp.id} delay={i * 0.08} direction="up">
                  <Link href={`/urunler/${rp.slug}`} className="group block">
                    <GlassCard glowColor="rgba(56, 189, 248, 0.06)" hover3d>
                      <div className="aspect-square overflow-hidden rounded-xl bg-gray-800/50">
                        {rpImages[0] ? (
                          <img
                            src={rpImages[0]}
                            alt={rp.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-600">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 space-y-1">
                        <h3 className="text-sm font-medium text-white transition-colors group-hover:text-cyan-300">
                          {rp.name}
                        </h3>
                        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                          {Number(rp.price).toFixed(2)} ₺
                        </p>
                      </div>
                    </GlassCard>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
