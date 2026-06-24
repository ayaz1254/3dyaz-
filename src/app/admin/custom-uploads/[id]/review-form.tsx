"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statusOptions = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "REVIEWING", label: "İnceleniyor" },
  { value: "PRICED", label: "Fiyatlandırıldı" },
  { value: "APPROVED", label: "Onaylandı" },
  { value: "REJECTED", label: "Reddedildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
];

export function UploadReviewForm({
  uploadId,
  currentStatus,
  currentPrice,
  currentDays,
  currentNote,
  currentPrintable,
  currentRejection,
}: {
  uploadId: string;
  currentStatus: string;
  currentPrice: number | null;
  currentDays: number | null;
  currentNote: string | null;
  currentPrintable: boolean | null;
  currentRejection: string | null;
}) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [price, setPrice] = useState(currentPrice?.toString() || "");
  const [days, setDays] = useState(currentDays?.toString() || "");
  const [note, setNote] = useState(currentNote || "");
  const [isPrintable, setIsPrintable] = useState(currentPrintable ?? true);
  const [rejection, setRejection] = useState(currentRejection || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/uploads/${uploadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        estimatedPrice: price ? parseFloat(price) : null,
        estimatedDays: days ? parseInt(days) : null,
        adminNote: note || null,
        isPrintable,
        rejectionReason: rejection || null,
      }),
    });

    if (res.ok) router.refresh();
    else alert("Güncelleme başarısız");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs text-gray-500">Durum</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Tahmini Fiyat (₺)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Tahmini Gün</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">Admin Notu</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPrintable}
          onChange={(e) => setIsPrintable(e.target.checked)}
        />
        Baskıya uygun
      </label>

      {status === "REJECTED" && (
        <div>
          <label className="mb-1 block text-xs text-gray-500">Ret Sebebi</label>
          <textarea
            value={rejection}
            onChange={(e) => setRejection(e.target.value)}
            rows={2}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Kaydediliyor..." : "Güncelle"}
      </button>
    </form>
  );
}
