"use client";

import { useState } from "react";

interface StockNotifyProps {
  productId: string;
  productName: string;
}

export function StockNotify({ productId, productName }: StockNotifyProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, POST to an API
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-amber-400">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="text-sm font-medium">Stokta Yok</span>
      </div>
      <p className="mb-3 text-sm text-gray-400">
        Bu ürün şu anda stokta bulunmuyor. Stok geldiğinde haber vermemizi ister misiniz?
      </p>
      {sent ? (
        <p className="text-sm text-green-400">✓ Bildiriminiz alındı. Stok geldiğinde size haber vereceğiz.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-amber-500/50"
          />
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-amber-500/20 transition hover:shadow-amber-500/40"
          >
            Haber Ver
          </button>
        </form>
      )}
    </div>
  );
}
