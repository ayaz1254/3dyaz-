"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("0");
  const [maxUses, setMaxUses] = useState("0");
  const [expiresAt, setExpiresAt] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then((r) => r.json())
      .then(setCoupons);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountType,
        discountValue: parseFloat(discountValue),
        minPurchase: parseFloat(minPurchase),
        maxUses: parseInt(maxUses),
        expiresAt: expiresAt || null,
      }),
    });

    if (res.ok) {
      const newCoupon = await res.json();
      setCoupons((prev) => [newCoupon, ...prev]);
      setCode("");
      setDiscountValue("");
      setExpiresAt("");
      setShowForm(false);
    } else {
      const data = await res.json();
      setError(data.error || "Oluşturulamadı");
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  }

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kuponlar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          {showForm ? "İptal" : "+ Yeni Kupon"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-4 rounded-lg border bg-white p-6 dark:bg-gray-950">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Kod</label>
              <input
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="INDIRIM10"
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tür</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")}
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
              >
                <option value="PERCENTAGE">Yüzde (%)</option>
                <option value="FIXED">Sabit (₺)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Değer {discountType === "PERCENTAGE" ? "(%)" : "(₺)"}
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder="10"
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Min. Sepet (₺)</label>
              <input
                type="number"
                min="0"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Max Kullanım (0=sınırsız)</label>
              <input
                type="number"
                min="0"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Son Geçerlilik</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Oluşturuluyor..." : "Oluştur"}
          </button>
        </form>
      )}

      {coupons.length === 0 ? (
        <div className="py-12 text-center text-gray-500">Henüz kupon yok.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-950">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 font-medium">Kod</th>
                <th className="px-4 py-3 font-medium">İndirim</th>
                <th className="px-4 py-3 font-medium">Kullanım</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Bitiş</th>
                <th className="px-4 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coupons.map((coupon) => {
                const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
                const isActive = coupon.isActive && !isExpired;
                return (
                  <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-4 py-3 font-mono font-bold">{coupon.code}</td>
                    <td className="px-4 py-3">
                      {coupon.discountType === "PERCENTAGE"
                        ? `%${coupon.discountValue}`
                        : `${coupon.discountValue.toFixed(2)} ₺`}
                      {coupon.minPurchase > 0 && (
                        <span className="ml-1 text-xs text-gray-400">
                          (min {coupon.minPurchase.toFixed(0)} ₺)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {coupon.usedCount}
                      {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      {isActive ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                          Aktif
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900 dark:text-red-300">
                          {isExpired ? "Süresi Doldu" : "Pasif"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString("tr-TR")
                        : "Sınırsız"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
