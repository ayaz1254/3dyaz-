export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
};

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

export function addToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-update"));
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((i) => i.productId !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-update"));
}

export function updateQuantity(productId: string, qty: number) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    item.quantity = qty;
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-update"));
  }
}

export function clearCart() {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("cart-update"));
}

export function getCartTotal(): number {
  return getCart().reduce((t, i) => t + i.price * i.quantity, 0);
}

export function getCartCount(): number {
  return getCart().reduce((t, i) => t + i.quantity, 0);
}
