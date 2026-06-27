"use client";

import { useEffect, useState } from "react";
import { isInWishlist, addToWishlist, removeFromWishlist } from "@/lib/wishlist";

interface Props {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  className?: string;
}

export function WishlistButton({ productId, name, price, image, slug, className = "" }: Props) {
  const [favori, setFavori] = useState(false);

  useEffect(() => {
    setFavori(isInWishlist(productId));
    const handler = () => setFavori(isInWishlist(productId));
    window.addEventListener("wishlist-update", handler);
    return () => window.removeEventListener("wishlist-update", handler);
  }, [productId]);

  function toggle() {
    if (favori) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({ productId, name, price, image, slug });
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
        favori
          ? "border-pink-500/40 bg-pink-500/10 text-pink-400 shadow-sm shadow-pink-500/10"
          : "border-white/10 bg-white/5 text-gray-400 hover:border-pink-500/30 hover:bg-pink-500/5 hover:text-pink-300"
      } ${className}`}
      aria-label={favori ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <svg
        className="h-5 w-5"
        fill={favori ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {favori ? "Favorilerde" : "Favorilere Ekle"}
    </button>
  );
}
