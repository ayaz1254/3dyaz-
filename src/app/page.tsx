import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 px-4 py-24 text-white">
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl">
            3D Magza
          </h1>
          <p className="mb-8 text-lg text-blue-100 md:text-xl">
            3D baskı teknolojisiyle üretilmiş özel tasarım ürünler.
            Kendi modelini yükle, sana özel basalım.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/urunler"
              className="rounded-full bg-white px-8 py-3 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
            >
              Ürünleri İncele
            </Link>
            <Link
              href="/yukle"
              className="rounded-full border-2 border-white/50 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Kendi Tasarımını Yükle
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Öne Çıkan Ürünler</h2>
          <Link
            href="/urunler"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Tümünü Gör →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            Henüz ürün bulunmuyor.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const images: string[] = JSON.parse(product.images || "[]");
              return (
                <Link
                  key={product.id}
                  href={`/urunler/${product.slug}`}
                  className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md dark:bg-gray-950"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        Görsel Yok
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500">
                      {product.category?.name}
                    </p>
                    <h3 className="mt-1 font-semibold">{product.name}</h3>
                    <p className="mt-1 text-lg font-bold text-blue-600">
                      {product.price.toFixed(2)} ₺
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-2xl font-bold">Kategoriler</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/urunler?category=${cat.slug}`}
                  className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:shadow-md dark:bg-gray-950"
                >
                  <h3 className="font-semibold">{cat.name}</h3>
                  {cat.description && (
                    <p className="mt-1 text-xs text-gray-500">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upload CTA */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold">Kendi Tasarımını Bas</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            STL, OBJ veya 3MF dosyanı yükle, sana özel fiyat teklifi verelim.
            Profesyonel 3D baskı kalitesiyle tasarımını gerçeğe dönüştürelim.
          </p>
          <Link
            href="/yukle"
            className="inline-block rounded-full bg-blue-600 px-10 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            Hemen Yükle
          </Link>
        </div>
      </section>
    </div>
  );
}
