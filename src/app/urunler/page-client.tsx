"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/glass-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { motion } from "motion/react";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  material: string | null;
  colors: string | null;
  isPublished: boolean;
  categoryId: string | null;
  category: { name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

function ProductBadges({ product }: { product: ProductData }) {
  const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : 0;

  const isNew = Date.now() - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-2">
      {isNew && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/20">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Yeni
        </span>
      )}
      {hasDiscount && (
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-red-500/20">
          %{discountPercent} İndirim
        </span>
      )}
    </div>
  );
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Props {
  products: ProductData[];
  categories: CategoryData[];
  materials: string[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentSort: string;
  currentCategory: string | undefined;
  currentSearch: string | undefined;
  currentMinPrice: string | undefined;
  currentMaxPrice: string | undefined;
  currentMaterial: string | undefined;
}

function buildUrl(params: Record<string, string>): string {
  const qs = new URLSearchParams(params).toString();
  return qs ? `/urunler?${qs}` : "/urunler";
}

export function ProductsPageClient({
  products,
  categories,
  materials,
  total,
  totalPages,
  currentPage,
  currentSort,
  currentCategory,
  currentSearch,
  currentMinPrice,
  currentMaxPrice,
  currentMaterial,
}: Props) {
  const router = useRouter();

  const currentParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    if (currentSearch) params.q = currentSearch;
    if (currentCategory) params.category = currentCategory;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;
    if (currentSort !== "newest") params.sort = currentSort;
    if (currentMaterial) params.material = currentMaterial;
    if (currentPage > 1) params.page = String(currentPage);
    return params;
  };

  const linkUrl = useCallback(
    (extra: Record<string, string>): string => {
      return buildUrl({ ...currentParams(), ...extra });
    },
    [currentSearch, currentCategory, currentMinPrice, currentMaxPrice, currentSort, currentMaterial, currentPage]
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold text-white">Ürünler</h1>
        <p className="mt-2 text-gray-400">
          3D baskı teknolojisiyle üretilmiş özel tasarım ürünleri keşfedin
        </p>
      </motion.div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Filters Sidebar ── */}
        <aside className="w-full shrink-0 lg:w-60">
          <div className="sticky top-24 space-y-4">
            {/* Categories */}
            <GlassCard glowColor="rgba(56, 189, 248, 0.06)">
              <div className="p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Kategoriler
                </h3>
                <div className="space-y-1.5">
                  <Link
                    href="/urunler"
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      !currentCategory
                        ? "bg-cyan-500/10 font-medium text-cyan-400"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Tümü
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={linkUrl({ category: cat.slug, page: "1" })}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        currentCategory === cat.slug
                          ? "bg-cyan-500/10 font-medium text-cyan-400"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Materials */}
            {materials.length > 0 && (
              <GlassCard glowColor="rgba(45, 212, 191, 0.06)">
                <div className="p-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Malzeme
                  </h3>
                  <div className="space-y-1.5">
                    <Link
                      href={linkUrl({ material: "", page: "1" })}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        !currentMaterial
                          ? "bg-teal-500/10 font-medium text-teal-400"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      Tümü
                    </Link>
                    {materials.map((m) => (
                      <Link
                        key={m}
                        href={linkUrl({ material: m, page: "1" })}
                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                          currentMaterial === m
                            ? "bg-teal-500/10 font-medium text-teal-400"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {m}
                      </Link>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Price Range */}
            <GlassCard glowColor="rgba(56, 189, 248, 0.06)">
              <div className="p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Fiyat Aralığı
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const min = ((form.elements.namedItem("minPrice") as HTMLInputElement | null)?.value) ?? "";
                    const max = ((form.elements.namedItem("maxPrice") as HTMLInputElement | null)?.value) ?? "";
                    const params: Record<string, string> = { ...currentParams(), page: "1" };
                    if (min) params.minPrice = min;
                    else delete params.minPrice;
                    if (max) params.maxPrice = max;
                    else delete params.maxPrice;
                    router.push(buildUrl(params));
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      name="minPrice"
                      type="number"
                      min="0"
                      defaultValue={currentMinPrice || ""}
                      placeholder="Min"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/50"
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <input
                      name="maxPrice"
                      type="number"
                      min="0"
                      defaultValue={currentMaxPrice || ""}
                      placeholder="Maks"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-3 w-full rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:from-cyan-500/30 hover:to-blue-600/30"
                  >
                    Filtrele
                  </button>
                </form>
              </div>
            </GlassCard>
          </div>
        </aside>

        {/* ── Products ── */}
        <div className="flex-1">
          {/* Search + Sort */}
          <div className="mb-8 flex items-center gap-3">
            <form
              className="flex flex-1 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const q = ((form.elements.namedItem("q") as HTMLInputElement | null)?.value) ?? "";
                const params: Record<string, string> = { ...currentParams(), page: "1" };
                if (q) params.q = q;
                else delete params.q;
                router.push(buildUrl(params));
              }}
            >
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  name="q"
                  defaultValue={currentSearch || ""}
                  placeholder="Ürün ara..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/50"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
              >
                Ara
              </button>
            </form>

            <select
              value={currentSort}
              onChange={(e) => {
                router.push(linkUrl({ sort: e.target.value, page: "1" }));
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-cyan-500/50"
            >
              <option value="newest" className="bg-gray-900">En Yeni</option>
              <option value="price-asc" className="bg-gray-900">Artan Fiyat</option>
              <option value="price-desc" className="bg-gray-900">Azalan Fiyat</option>
            </select>
          </div>

          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] px-8 py-24 text-center backdrop-blur-sm"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
                <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-300">Ürün bulunamadı</h3>
              <p className="mb-4 text-sm text-gray-500">Filtreleri değiştirerek tekrar deneyin.</p>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20"
              >
                Filtreleri Temizle
              </Link>
            </motion.div>
          ) : (
            <>
              <p className="mb-6 text-sm text-gray-500">{total} ürün bulundu</p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, i) => (
                  <ScrollReveal key={product.id} delay={i * 0.05} direction="up">
                    <Link href={`/urunler/${product.slug}`} className="group block">
                      <GlassCard glowColor="rgba(56, 189, 248, 0.08)" hover3d>
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-800/50">
                          <ProductBadges product={product} />
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <div className="flex flex-col items-center gap-2 text-gray-600">
                                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs">Görsel Yok</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 space-y-1">
                          {product.category && (
                            <p className="text-xs font-medium text-cyan-400">{product.category.name}</p>
                          )}
                          <h3 className="font-semibold text-white transition-colors group-hover:text-cyan-300">
                            {product.name}
                          </h3>
                          <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                            {Number(product.price).toFixed(2)} ₺
                          </p>
                        </div>
                      </GlassCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-12 flex items-center justify-center gap-2"
                >
                  {currentPage > 1 && (
                    <Link
                      href={linkUrl({ page: String(currentPage - 1) })}
                      className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:border-white/20 hover:text-white"
                    >
                      ← Önceki
                    </Link>
                  )}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={linkUrl({ page: String(p) })}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm transition ${
                          p === currentPage
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 font-medium text-white shadow-lg shadow-cyan-500/20"
                            : "border border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                  {currentPage < totalPages && (
                    <Link
                      href={linkUrl({ page: String(currentPage + 1) })}
                      className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:border-white/20 hover:text-white"
                    >
                      Sonraki →
                    </Link>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
