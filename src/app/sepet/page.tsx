"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Sepetim</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-lg text-gray-500">Sepetiniz boş.</p>
          <Link
            href="/urunler"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-lg border bg-white p-4 dark:bg-gray-950"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                  -
                </div>
              )}
              <div className="flex-1">
                <Link
                  href={`/urunler/${item.slug}`}
                  className="font-medium hover:text-blue-600"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {item.price.toFixed(2)} ₺
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateQuantity(item.productId, item.quantity - 1);
                    refresh();
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded border text-sm hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => {
                    updateQuantity(item.productId, item.quantity + 1);
                    refresh();
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded border text-sm hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-medium">
                {(item.price * item.quantity).toFixed(2)} ₺
              </p>
              <button
                onClick={() => {
                  removeFromCart(item.productId);
                  refresh();
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Kaldır
              </button>
            </div>
          ))}

          {/* Summary */}
          <div className="rounded-lg border bg-white p-6 dark:bg-gray-950">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ürün Toplamı ({count} adet)</span>
                <span>{total.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo</span>
                <span>{total >= 500 ? "Ücretsiz" : "49.90 ₺"}</span>
              </div>
              <div className="border-t pt-2 text-lg font-bold">
                <div className="flex justify-between">
                  <span>Toplam</span>
                  <span>{(total + (total >= 500 ? 0 : 49.9)).toFixed(2)} ₺</span>
                </div>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-4 block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              Siparişi Tamamla
            </Link>
            <Link
              href="/urunler"
              className="mt-2 block text-center text-sm text-blue-600 hover:underline"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
