const MAX = 8;
const STORAGE_KEY = "recentlyViewed";

export type RecentlyViewedItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
};

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToRecentlyViewed(item: RecentlyViewedItem) {
  if (typeof window === "undefined") return;
  const list = getRecentlyViewed().filter((i) => i.productId !== item.productId);
  list.unshift(item);
  if (list.length > MAX) list.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("recently-viewed-update"));
}
