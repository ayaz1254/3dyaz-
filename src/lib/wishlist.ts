export type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
};

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    return [];
  }
}

export function addToWishlist(item: WishlistItem) {
  const list = getWishlist();
  if (!list.find((i) => i.productId === item.productId)) {
    list.push(item);
    localStorage.setItem("wishlist", JSON.stringify(list));
    window.dispatchEvent(new Event("wishlist-update"));
  }
}

export function removeFromWishlist(productId: string) {
  const list = getWishlist().filter((i) => i.productId !== productId);
  localStorage.setItem("wishlist", JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-update"));
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some((i) => i.productId === productId);
}

export function getWishlistCount(): number {
  return getWishlist().length;
}
