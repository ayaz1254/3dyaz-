"use client";

import { useState } from "react";

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  slug,
  disabled,
}: {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  disabled: boolean;
}) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: { productId: string }) => i.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId, name, price, image, slug, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-update"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (disabled) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-semibold text-gray-500 backdrop-blur-sm sm:w-auto"
      >
        Tükendi
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="group relative w-full overflow-hidden rounded-xl bg-[#05cc47] px-8 py-3.5 font-semibold text-black shadow-lg shadow-[#05cc47]/20 transition-all hover:bg-[#05cc47]/90 hover:shadow-[#05cc47]/40 sm:w-auto"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {added ? (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Sepete Eklendi
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Sepete Ekle
          </>
        )}
      </span>
      <div className="absolute inset-0 -translate-x-full bg-[#05cc47] transition group-hover:translate-x-0" />
    </button>
  );
}
