"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/glass-card";
import { getCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, type CartItem } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  function refresh() {
    setItems(getCart());
    setCount(getCartCount());
    setTotal(getCartTotal());
  }

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("cart-update", handler);
    return () => window.removeEventListener("cart-update", handler);
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <h1 className="text-4xl font-bold text-white">Sepetim</h1>
        <p className="mt-2 text-gray-400">
          Sepetinizdeki ürünleri gözden geçirin ve siparişinizi tamamlayın.
        </p>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] px-8 py-24 text-center backdrop-blur-sm"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10">
            <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-300">Sepetiniz boş</h3>
          <p className="mb-6 text-sm text-gray-500">Alışverişe başlamak için ürünleri keşfedin.</p>
          <Link
            href="/magaza"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
          >
            <span className="relative z-10">Alışverişe Başla</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition group-hover:translate-x-0" />
          </Link>
        </motion.div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard glowColor="rgba(255,255,255,0.03)">
                <div className="flex items-center gap-4 p-4 sm:gap-6">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/magaza/${item.slug}`}
                      className="font-medium text-white transition hover:text-cyan-300"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-gray-400">
                      {Number(item.price).toFixed(2)} ₺
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        updateQuantity(item.productId, item.quantity - 1);
                        refresh();
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 transition hover:border-cyan-500/50 hover:text-white"
                    >
                      -
                    </button>
                    <span className="flex h-9 w-9 items-center justify-center text-sm font-medium text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        updateQuantity(item.productId, item.quantity + 1);
                        refresh();
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 transition hover:border-cyan-500/50 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-24 text-right font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                    {(Number(item.price) * item.quantity).toFixed(2)} ₺
                  </p>

                  <button
                    onClick={() => {
                      removeFromCart(item.productId);
                      refresh();
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                    title="Kaldır"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {/* Summary */}
          <GlassCard glowColor="rgba(56, 189, 248, 0.08)">
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Ürün Toplamı ({count} adet)</span>
                  <span className="text-white">{total.toFixed(2)} ₺</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Kargo</span>
                  <span className={total >= 500 ? "text-emerald-400" : "text-gray-300"}>
                    {total >= 500 ? "Ücretsiz" : "49.90 ₺"}
                  </span>
                </div>
                {total < 500 && (
                  <p className="text-xs text-gray-500">
                    500 ₺ ve üzeri alışverişlerde kargo ücretsiz
                  </p>
                )}
              </div>

              <div className="my-4 border-t border-white/5" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-white">Toplam</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                  {(total + (total >= 500 ? 0 : 49.9)).toFixed(2)} ₺
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/checkout"
                  className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-center font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40"
                >
                  <span className="relative z-10">Siparişi Tamamla</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition group-hover:translate-x-0" />
                </Link>
                <Link
                  href="/magaza"
                  className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition hover:border-white/20 hover:text-white"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
