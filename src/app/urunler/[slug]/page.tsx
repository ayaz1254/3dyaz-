import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "./add-to-cart";
import { DynamicModelViewer } from "@/components/dynamic-model-viewer";
import { ReviewSection } from "./review-section";

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
      price: product.price,
      priceCurrency: "TRY",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/urunler/${product.slug}`,
    },
    ...(product.category?.name ? { category: product.category.name } : {}),
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <Link href="/urunler" className="hover:text-blue-600">Ürünler</Link>
        <span className="mx-2">/</span>
        {product.category && (
          <>
            <Link
              href={`/urunler?category=${product.category.slug}`}
              className="hover:text-blue-600"
            >
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-900 dark:text-gray-100">{product.name}</span>
      </nav>

      {/* Product */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          {images[0] ? (
            <div className="overflow-hidden rounded-xl bg-gray-100">
              <img
                src={images[0]}
                alt={product.name}
                className="w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              Görsel Yok
            </div>
          )}
          {images.length > 1 && (
            <div className="mt-4 flex gap-2">
              {images.map((img, i) => (
                <div key={i} className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* 3D Model Preview */}
          {product.fileUrl && /\.(stl|obj|3mf)$/i.test(product.fileUrl) && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-500">3D Model</h3>
              <DynamicModelViewer url={product.fileUrl} />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <p className="mb-2 text-sm text-gray-500">{product.category.name}</p>
          )}
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-blue-600">
              {product.price.toFixed(2)} ₺
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {product.comparePrice.toFixed(2)} ₺
              </span>
            )}
          </div>

          {product.shortDesc && (
            <p className="mb-6 text-gray-600 dark:text-gray-400">{product.shortDesc}</p>
          )}

          {/* Specs */}
          <div className="mb-6 space-y-2 text-sm">
            {product.material && (
              <p><span className="font-medium">Malzeme:</span> {product.material}</p>
            )}
            {product.dimensions && (
              <p><span className="font-medium">Boyutlar:</span> {product.dimensions}</p>
            )}
            {product.weight && (
              <p><span className="font-medium">Ağırlık:</span> {product.weight}g</p>
            )}
            {colors.length > 0 && (
              <p>
                <span className="font-medium">Renkler:</span>{" "}
                {colors.join(", ")}
              </p>
            )}
            <p>
              <span className="font-medium">Stok:</span>{" "}
              {product.stock > 0 ? (
                <span className="text-green-600">{product.stock} adet</span>
              ) : (
                <span className="text-red-600">Tükendi</span>
              )}
            </p>
          </div>

          <AddToCartButton
            productId={product.id}
            name={product.name}
            price={product.price}
            image={images[0] || ""}
            slug={product.slug}
            disabled={product.stock <= 0}
          />

          {/* Description */}
          {product.description && (
            <div className="mt-8 border-t pt-6">
              <h2 className="mb-3 text-lg font-semibold">Ürün Açıklaması</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="col-span-full">
        <ReviewSection productId={product.id} />
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((rp) => {
              const rpImages: string[] = JSON.parse(rp.images || "[]");
              return (
                <Link
                  key={rp.id}
                  href={`/urunler/${rp.slug}`}
                  className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md dark:bg-gray-950"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {rpImages[0] ? (
                      <img src={rpImages[0]} alt={rp.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">-</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium">{rp.name}</h3>
                    <p className="mt-1 text-sm font-bold text-blue-600">{rp.price.toFixed(2)} ₺</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
