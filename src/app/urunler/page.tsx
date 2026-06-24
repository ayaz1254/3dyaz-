import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const categorySlug = sp.category;
  const search = sp.q;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };

  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) where.categoryId = cat.id;
  }

  if (search) {
    where.name = { contains: search } as Record<string, unknown>;
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Ürünler</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="sticky top-24 rounded-lg border bg-white p-4 dark:bg-gray-950">
            <h3 className="mb-3 text-sm font-semibold">Kategoriler</h3>
            <div className="space-y-2">
              <Link
                href="/urunler"
                className={`block text-sm ${!categorySlug ? "font-medium text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
              >
                Tümü
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/urunler?category=${cat.slug}`}
                  className={`block text-sm ${categorySlug === cat.slug ? "font-medium text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Search */}
          <form className="mb-6" method="GET" action="/urunler">
            <div className="flex gap-2">
              <input
                name="q"
                defaultValue={search}
                placeholder="Ürün ara..."
                className="flex-1 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Ara
              </button>
            </div>
          </form>

          {products.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="text-lg">Ürün bulunamadı.</p>
              <Link href="/urunler" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                Filtreleri Temizle
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">{total} ürün bulundu</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
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
                        <p className="text-xs text-gray-500">{product.category?.name}</p>
                        <h3 className="mt-1 font-semibold">{product.name}</h3>
                        <p className="mt-1 text-lg font-bold text-blue-600">
                          {product.price.toFixed(2)} ₺
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/urunler?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&q=${search}` : ""}`}
                      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      ← Önceki
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/urunler?page=${p}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&q=${search}` : ""}`}
                      className={`rounded-lg px-3 py-1.5 text-sm ${
                        p === page
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/urunler?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&q=${search}` : ""}`}
                      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      Sonraki →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
