"use client";

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
    alert("Sepete eklendi!");
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className={`w-full rounded-lg py-3 font-semibold text-white transition sm:w-auto sm:px-12 ${
        disabled
          ? "cursor-not-allowed bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {disabled ? "Tükendi" : "Sepete Ekle"}
    </button>
  );
}
