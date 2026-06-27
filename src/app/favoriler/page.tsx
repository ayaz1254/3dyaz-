"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/glass-card";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";
import type { WishlistItem } from "@/lib/wishlist";

export default function FavorilerPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(getWishlist());
    const handler = () => setItems(getWishlist());
    window.addEventListener("wishlist-update", handler);
    return () => window.removeEventListener("wishlist-update", handler);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-[25vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-72 w-72 animate-float rounded-full bg-pink-500/10 blur-[100px]" />
        </div>
        <div className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-medium text-pink-300 backdrop-blur-sm">
              Favoriler
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Favorilerim</h1>
            <p className="mx-auto max-w-xl text-gray-400">Beğendiğiniz ürünler</p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      <section className="relative px-4 pb-24">
        <div className="mx-auto max-w-7xl">
          {items.length === 0 ? (
            <div className="mt-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10">
                <svg className="h-8 w-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">Henüz favoriniz yok</h2>
              <p className="mb-6 text-gray-400">Beğendiğiniz ürünleri favorilere ekleyin.</p>
              <Link
                href="/magaza"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
              >
                Ürünleri Keşfet →
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {items.map((item, i) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group relative"
                >
                  <Link href={`/magaza/${item.slug}`} className="block">
                    <GlassCard glowColor="rgba(236, 72, 153, 0.06)" hover3d>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-800/50">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-600">
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="mt-2.5 space-y-1">
                        <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-pink-300">{item.name}</h3>
                        <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">{item.price.toFixed(2)} ₺</p>
                      </div>
                    </GlassCard>
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute right-2 top-2 z-10 rounded-lg bg-black/50 p-1.5 text-pink-400 backdrop-blur-sm transition hover:bg-black/70"
                    aria-label="Favorilerden çıkar"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
