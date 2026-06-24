"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
};

export function CategoryList({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
    });

    if (res.ok) {
      setName("");
      setDescription("");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Oluşturulamadı");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="rounded-lg border bg-white p-4 dark:bg-gray-950">
        <h2 className="mb-3 text-sm font-semibold">Yeni Kategori</h2>
        {error && (
          <p className="mb-2 text-sm text-red-600">{error}</p>
        )}
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kategori adı"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>
          <div className="flex-1">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Açıklama (opsiyonel)"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : "Ekle"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-950">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 font-medium">Kategori Adı</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Açıklama</th>
              <th className="px-4 py-3 font-medium">Ürün Sayısı</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-500">{cat.description || "-"}</td>
                <td className="px-4 py-3">{cat._count.products}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
