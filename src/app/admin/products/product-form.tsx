"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  shortDesc: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  images: string;
  isPublished: boolean;
  material: string | null;
  dimensions: string | null;
  weight: number | null;
  colors: string;
  isDigital: boolean;
  fileUrl: string | null;
  categoryId: string;
};

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    shortDesc: product?.shortDesc || "",
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    stock: product?.stock ?? 0,
    images: product?.images ? JSON.parse(product.images).join(", ") : "",
    material: product?.material || "",
    dimensions: product?.dimensions || "",
    weight: product?.weight || 0,
    colors: product?.colors ? JSON.parse(product.colors).join(", ") : "",
    isPublished: product?.isPublished ?? false,
    isDigital: product?.isDigital ?? false,
    fileUrl: product?.fileUrl || "",
    categoryId: product?.categoryId || (categories[0]?.id ?? ""),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      ...form,
      images: form.images
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      colors: form.colors
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean),
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      weight: form.weight ? Number(form.weight) : null,
      stock: Number(form.stock),
      isPublished: form.isPublished,
      isDigital: form.isDigital,
    };

    const url = isEdit
      ? `/api/products/${product.id}`
      : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Bir hata oluştu");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Ürün Adı *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Kısa Açıklama</label>
            <input
              value={form.shortDesc}
              onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Açıklama *</label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Kategori *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Fiyat (₺) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">İndirimli Fiyat</label>
              <input
                type="number"
                step="0.01"
                value={form.comparePrice}
                onChange={(e) =>
                  setForm({ ...form, comparePrice: parseFloat(e.target.value) })
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Stok</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Ağırlık (gr)</label>
              <input
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Malzeme</label>
            <input
              value={form.material}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              placeholder="PLA, PETG, Reçine..."
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Boyutlar</label>
            <input
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="10x10x15 cm"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Görseller (URL, virgülle ayırın)
            </label>
            <input
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Renkler (virgülle ayırın)
            </label>
            <input
              value={form.colors}
              onChange={(e) => setForm({ ...form, colors: e.target.value })}
              placeholder="Siyah, Beyaz, Mavi"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="rounded border-gray-300"
              />
              Yayında
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isDigital}
                onChange={(e) => setForm({ ...form, isDigital: e.target.checked })}
                className="rounded border-gray-300"
              />
              Dijital Ürün (STL)
            </label>
          </div>

          {form.isDigital && (
            <div>
              <label className="mb-1 block text-sm font-medium">Dosya URL</label>
              <input
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : isEdit ? "Güncelle" : "Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-6 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
