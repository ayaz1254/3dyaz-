"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

/* ─── Types ─── */
interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  material: string | null;
  colors: string | null;
  stock: number;
}

type FilterKey = "all" | "stock" | "preorder";

/* ─── Product Card ─── */
function ProductCard({ product }: { product: ProductData }) {
  const displayImages = product.images.slice(0, 2);
  const hasDiscount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : 0;

  return (
    <div className="group relative bg-[#181a1b] border border-white/5 rounded-2xl overflow-hidden hover:border-[#05cc47]/50 hover:shadow-[0_0_25px_rgba(5,204,71,0.12)] transition-all duration-300">
      <Link
        href={`/magaza/${product.slug}`}
        className="absolute inset-0 z-30"
        aria-label={`${product.name} detaylarını gör`}
      />
      <div className="aspect-[3/4] bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-10 bg-transparent" />
        {displayImages.length > 0 ? (
          <>
            <img
              alt={`${product.name} 3D Figür - Ön Görünüm`}
              loading="lazy"
              width={300}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              draggable={false}
              src={displayImages[0]}
            />
            {displayImages[1] && (
              <img
                alt={`${product.name} 3D Figür - Detay Görünüm`}
                loading="lazy"
                width={300}
                height={400}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                draggable={false}
                src={displayImages[1]}
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <div className="px-2 py-1 bg-[#05cc47] text-black text-[7px] md:text-[8px] font-black uppercase tracking-wider rounded-md shadow-lg flex items-center gap-1">
            🚚 Ücretsiz Kargo
          </div>
          {hasDiscount && (
            <div className="px-2 py-1 bg-orange-500 text-white text-[7px] md:text-[8px] font-black uppercase tracking-wider rounded-md shadow-lg flex items-center gap-1 animate-pulse">
              🔥 %{discountPercent} İndirim
            </div>
          )}
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* "İncele" button on hover (desktop only) */}
        <div className="hidden md:block absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
          <button className="w-full py-2.5 bg-[#05cc47] text-black font-black uppercase tracking-widest text-[9px] rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-1.5">
            İncele
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-bold font-heading text-white mb-1.5 leading-tight group-hover:text-[#05cc47] transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-wider font-bold">
                  <span className="line-through opacity-50 mr-1">{Number(product.comparePrice).toLocaleString("tr")} TL</span>
                </span>
                <span className="text-[#05cc47] font-mono font-bold text-sm md:text-base">
                  {Number(product.price).toLocaleString("tr")} TL
                </span>
              </>
            ) : (
              <>
                <span className="text-[8px] md:text-[9px] text-white/40 uppercase tracking-wider font-bold">
                  BAŞLANGIÇ
                </span>
                <span className="text-[#05cc47] font-mono font-bold text-sm md:text-base">
                  {Number(product.price).toLocaleString("tr")} TL
                </span>
              </>
            )}
          </div>
          {product.colors || product.material ? (
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/5 text-[7px] md:text-[8px] text-white/50 font-bold uppercase tracking-wider">
              +SEÇENEKLİ
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ─── Marquee Ticker ─── */
const tickerItems = [
  { text: "Keyifle sizler için üretiyoruz!", dot: "#ff4d00" },
  { text: "Listelenen figürler haricinde özel istekleriniz için iletişime geçebilirsiniz.", dot: "#05cc47" },
  { text: "Ürünlerimiz sipariş üzerine ve el yapımı olarak üretildiği için bazı farklılıklar oluşabilir.", dot: "#ef4444" },
];

/* ─── Page ─── */
const filters: { key: FilterKey; label: string; icon?: string }[] = [
  { key: "all", label: "Tüm Figürler" },
  { key: "stock", label: "Stoktakiler", icon: "📦" },
  { key: "preorder", label: "Ön Siparişler", icon: "🔥" },
];

export function ProductsPageClient({ products }: { products: ProductData[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case "stock":
        return products.filter((p) => p.stock > 0);
      case "preorder":
        return products.filter((p) => p.stock <= 0);
      default:
        return products;
    }
  }, [products, activeFilter]);

  return (
    <div className="min-h-screen bg-[#0d0e10] text-white font-inter selection:bg-[#05cc47] selection:text-black overflow-x-hidden pt-16 md:pt-20">
      {/* ─── Hero ─── */}
      <div className="relative min-h-[45vh] md:min-h-[50vh] flex items-center justify-center pt-24 md:pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05cc47]/10 to-[#0d0e10]" />
        <div className="relative z-10 text-center space-y-3 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#05cc47]/10 text-[#05cc47] border border-[#05cc47]/20 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 10a4 4 0 0 1-8 0" />
              <path d="M3.103 6.034h17.794" />
              <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest">ONLINE MAĞAZA (BETA)</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tighter">
            ÖZEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#05cc47] to-[#028a2f]">KOLEKSİYON</span>
          </h1>
          <p className="text-white/50 max-w-md mx-auto text-xs leading-relaxed hidden md:block">
            Stoktan hemen teslim veya kişiye özel üretim figürler.
          </p>

          {/* ─── Marquee Ticker ─── */}
          <div className="relative mt-12 max-w-[1200px] mx-auto overflow-hidden pointer-events-none">
            <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#0d0e10] via-[#0d0e10]/80 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#0d0e10] via-[#0d0e10]/80 to-transparent z-10" />
            <div className="w-full py-6 px-0 md:px-10 flex items-center bg-white/[0.01] border-y border-white/5 backdrop-blur-md overflow-hidden">
              <div className="flex items-center py-2 marquee-track">
                {[...Array(4)].flatMap((_, loop) =>
                  tickerItems.map((item, i) => (
                    <div
                      key={`${loop}-${i}`}
                      className="flex items-center gap-4 md:gap-8 pr-16 md:pr-40 justify-center min-w-[300px] md:min-w-0 shrink-0"
                    >
                      <div className="shrink-0 w-2.5 h-2.5 rounded-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: item.dot, color: item.dot }} />
                      <p className="text-[12px] font-bold tracking-[0.2em] text-white/70 uppercase leading-relaxed text-center w-full whitespace-nowrap">
                        {item.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Product Grid ─── */}
      <div className="mx-auto max-w-[1200px] px-4 pb-16 md:pb-20">
        {/* ─── Filter Pills ─── */}
        <div className="flex items-center justify-center gap-2 md:gap-3 pb-8 md:pb-10">
          {filters.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#05cc47] text-black border-[#05cc47]"
                    : "bg-transparent border-white/20 text-white/70 hover:border-white/50"
                }`}
              >
                {f.icon && <span className="text-[10px]">{f.icon}</span>}
                {f.label}
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#181a1b] px-8 py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#05cc47]/10">
              <svg className="h-7 w-7 text-[#05cc47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-medium text-gray-300">Ürün bulunamadı</h3>
            <p className="mb-4 text-sm text-gray-500">Henüz bu kategoride ürün bulunmamaktadır.</p>
            <Link
              href="/magaza"
              className="inline-flex items-center gap-1 rounded-full bg-[#05cc47] px-5 py-2 text-sm font-medium text-black"
            >
              Tüm Ürünler
            </Link>
          </div>
        ) : (
          <>
            {/* ─── Product Grid ─── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ─── Marquee Animation ─── */}
      <style jsx>{`
        .marquee-track {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
