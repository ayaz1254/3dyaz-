import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

function buildUrl(base: string, params: Record<string, string | undefined>, extra: Record<string, string>): string {
  const merged = { ...params, ...extra };
  const qs = Object.entries(merged)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
    .join("&");
  return qs ? `${base}?${qs}` : base;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const categorySlug = sp.category;
  const search = sp.q;
  const minPrice = sp.minPrice;
  const maxPrice = sp.maxPrice;
  const sort = sp.sort || "newest";
  const material = sp.material;
  const page = Math.max(1, parseInt(sp.page || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };

  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) where.categoryId = cat.id;
  }

  if (search) {
    where.name = { contains: search };
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

  const allParams: Record<string, string | undefined> = {
    q: search,
    category: categorySlug,
    minPrice,
    maxPrice,
    sort: sort !== "newest" ? sort : undefined,
    material,
    page: undefined,
  };

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

  function linkUrl(extra: Record<string, string>): string {
    return buildUrl("/urunler", allParams, extra);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Ürünler</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
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
                    href={linkUrl({ category: cat.slug, page: "1" })}
                    className={`block text-sm ${categorySlug === cat.slug ? "font-medium text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {uniqueMaterials.length > 0 && (
              <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
                <h3 className="mb-3 text-sm font-semibold">Malzeme</h3>
                <div className="space-y-2">
                  <Link
                    href={linkUrl({ material: "", page: "1" })}
                    className={`block text-sm ${!material ? "font-medium text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                  >
                    Tümü
                  </Link>
                  {uniqueMaterials.map((m) => (
                    <Link
                      key={m}
                      href={linkUrl({ material: m, page: "1" })}
                      className={`block text-sm ${material === m ? "font-medium text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                    >
                      {m}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
              <h3 className="mb-3 text-sm font-semibold">Fiyat Aralığı</h3>
              <form method="GET" action="/urunler">
                {Object.entries(allParams).map(([k, v]) =>
                  v && k !== "minPrice" && k !== "maxPrice" ? (
                    <input key={k} type="hidden" name={k} value={v} />
                  ) : null
                )}
                <div className="flex items-center gap-2">
                  <input
                    name="minPrice"
                    type="number"
                    min="0"
                    defaultValue={minPrice}
                    placeholder="Min"
                    className="w-full rounded-lg border px-2 py-1.5 text-sm dark:bg-gray-900"
                  />
                  <span className="text-xs text-gray-400">-</span>
                  <input
                    name="maxPrice"
                    type="number"
                    min="0"
                    defaultValue={maxPrice}
                    placeholder="Maks"
                    className="w-full rounded-lg border px-2 py-1.5 text-sm dark:bg-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-gray-100 px-3 py-1.5 text-xs hover:bg-gray-200 dark:bg-gray-800"
                >
                  Filtrele
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Search + Sort */}
          <div className="mb-6 flex items-center gap-3">
            <form className="flex flex-1 gap-2" method="GET" action="/urunler">
              {Object.entries(allParams).map(([k, v]) =>
                v && k !== "q" ? <input key={k} type="hidden" name={k} value={v} /> : null
              )}
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
            </form>

            <div className="shrink-0">
              <select
                value={sort}
                onChange={(e) => {
                  window.location.href = linkUrl({ sort: e.target.value, page: "1" });
                }}
                className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
              >
                <option value="newest">En Yeni</option>
                <option value="price-asc">Artan Fiyat</option>
                <option value="price-desc">Azalan Fiyat</option>
              </select>
            </div>
          </div>

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
                      href={linkUrl({ page: String(page - 1) })}
                      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                      ← Önceki
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={linkUrl({ page: String(p) })}
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
                      href={linkUrl({ page: String(page + 1) })}
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
