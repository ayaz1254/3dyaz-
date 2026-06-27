"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import type { RecentlyViewedItem } from "@/lib/recently-viewed";

export function RecentlyViewedSection() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
    const handler = () => setItems(getRecentlyViewed());
    window.addEventListener("recently-viewed-update", handler);
    return () => window.removeEventListener("recently-viewed-update", handler);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative border-t border-white/5 px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white">Son Baktıklarınız</h2>
          <p className="mt-2 text-gray-400">İlgilenebileceğiniz diğer ürünler</p>
        </div>
        {/* Mobile: horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory sm:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <div key={item.productId} className="w-[calc(50vw-1rem)] shrink-0 snap-start">
              <Link href={`/magaza/${item.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-lg group-hover:shadow-cyan-500/5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
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
                <p className="mt-1 truncate text-sm text-gray-400 transition-colors group-hover:text-cyan-300">
                  {item.name}
                </p>
                <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                  {item.price.toFixed(2)} ₺
                </p>
              </Link>
            </div>
          ))}
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 sm:gap-3">
          {items.map((item) => (
            <Link
              key={item.productId}
              href={`/magaza/${item.slug}`}
              className="group block"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-lg group-hover:shadow-cyan-500/5">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
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
              <p className="mt-1 truncate text-sm text-gray-400 transition-colors group-hover:text-cyan-300">
                {item.name}
              </p>
              <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                {item.price.toFixed(2)} ₺
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
