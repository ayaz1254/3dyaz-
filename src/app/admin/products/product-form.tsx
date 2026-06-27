"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";

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

function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = !!product;

  const initialImages = product?.images ? parseImages(product.images) : [];
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    shortDesc: product?.shortDesc || "",
    price: product?.price || 0,
    comparePrice: product?.comparePrice || 0,
    stock: product?.stock ?? 0,
    material: product?.material || "",
    dimensions: product?.dimensions || "",
    weight: product?.weight || 0,
    colors: product?.colors ? JSON.parse(product.colors).join(", ") : "",
    isPublished: product?.isPublished ?? false,
    isDigital: product?.isDigital ?? false,
    fileUrl: product?.fileUrl || "",
    categoryId: product?.categoryId || (categories[0]?.id ?? ""),
  });
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modelUploading, setModelUploading] = useState(false);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const modelDragRef = useRef<HTMLDivElement>(null);
  const [isModelDragging, setIsModelDragging] = useState(false);

  const handleImageUpload = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError("Sadece görsel dosyaları yükleyebilirsiniz.");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Her dosya maksimum 5MB olabilir.");
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          uploaded.push(data.url);
        } else {
          const err = await res.json();
          setError(err.error || "Yükleme başarısız");
        }
      } catch {
        setError("Dosya yüklenemedi");
      }
    }

    if (uploaded.length > 0) {
      setImageUrls((prev) => [...prev, ...uploaded]);
    }
    setUploading(false);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleImageUpload(e.dataTransfer.files);
      }
    },
    [handleImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleModelUpload = useCallback(async (files: FileList | File[]) => {
    const file = Array.from(files)[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!["stl", "obj", "3mf"].includes(ext)) {
      setError("Sadece STL, OBJ veya 3MF dosyası yükleyebilirsiniz.");
      return;
    }

    setModelUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, fileUrl: data.url }));
      } else {
        const err = await res.json();
        setError(err.error || "Yükleme başarısız");
      }
    } catch {
      setError("Dosya yüklenemedi");
    }

    setModelUploading(false);
  }, []);

  const removeModelFile = useCallback(() => {
    setForm((prev) => ({ ...prev, fileUrl: "" }));
  }, []);

  const handleModelDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsModelDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleModelUpload(e.dataTransfer.files);
      }
    },
    [handleModelUpload]
  );

  const handleModelDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsModelDragging(true);
  }, []);

  const handleModelDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsModelDragging(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      ...form,
      images: imageUrls,
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

    const url = isEdit ? `/api/products/${product.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((r) => {
        if (r.ok) {
          router.push("/admin/products");
          router.refresh();
        } else {
          return r.json().then((d) => {
            setError(d.error || "Bir hata oluştu");
            setLoading(false);
          });
        }
      })
      .catch(() => {
        setError("Bir hata oluştu");
        setLoading(false);
      });
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
              <label className="mb-1 block text-sm font-medium">3D Model Dosyası (STL/OBJ/3MF)</label>
              {form.fileUrl ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <svg className="h-8 w-8 flex-shrink-0 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="min-w-0 flex-1 truncate text-sm">{form.fileUrl}</span>
                  <button
                    type="button"
                    onClick={removeModelFile}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[10px] text-white hover:bg-red-700"
                  >
                    ×
                  </button>
                </div>
              ) : null}
              <div
                ref={modelDragRef}
                onDrop={handleModelDrop}
                onDragOver={handleModelDragOver}
                onDragLeave={handleModelDragLeave}
                onClick={() => modelInputRef.current?.click()}
                className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition ${
                  isModelDragging
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                }`}
              >
                {modelUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-8 w-8 animate-spin text-cyan-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-sm text-gray-500">Yükleniyor...</span>
                  </div>
                ) : (
                  <>
                    <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span className="text-sm text-gray-500">
                      {isModelDragging ? "Bırakın..." : "3D model yüklemek için tıklayın veya sürükleyin"}
                    </span>
                    <span className="mt-1 text-xs text-gray-400">STL, OBJ, 3MF - max 50MB</span>
                  </>
                )}
              </div>
              <input
                ref={modelInputRef}
                type="file"
                accept=".stl,.obj,.3mf,model/stl,model/obj,application/vnd.ms-pki.stl"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleModelUpload(e.target.files);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Görsel Yükleme */}
      <div>
        <label className="mb-2 block text-sm font-medium">Görseller</label>

        {/* Mevcut görsel önizlemeleri */}
        {imageUrls.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-lg border">
                <img
                  src={url}
                  alt={`Görsel ${i + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'><rect width='24' height='24' rx='4'/><text x='12' y='16' text-anchor='middle' font-size='10'>?</text></svg>";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white opacity-0 transition group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          ref={dragRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-gray-500">Yükleniyor...</span>
            </div>
          ) : (
            <>
              <svg className="mb-2 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500">
                {isDragging ? "Bırakın..." : "Görsel eklemek için tıklayın veya sürükleyin"}
              </span>
              <span className="mt-1 text-xs text-gray-400">JPG, PNG, WebP, SVG - max 5MB</span>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleImageUpload(e.target.files);
              e.target.value = "";
            }
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
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
