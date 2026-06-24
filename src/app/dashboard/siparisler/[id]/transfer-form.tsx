"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TransferForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [transferName, setTransferName] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!transferName.trim() || !transferDate) {
      setError("Lütfen gerekli alanları doldurun");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("transferName", transferName);
    formData.append("transferDate", transferDate);
    if (receiptFile) formData.append("receiptImage", receiptFile);

    const res = await fetch("/api/payments/transfer", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setSent(true);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Gönderilemedi");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
        <p className="font-medium">✅ Havale bildiriminiz alındı!</p>
        <p className="mt-1">
          Ödemeniz admin tarafından onaylandıktan sonra siparişiniz işleme alınacaktır.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase">
        Havale / EFT Bildirimi
      </h3>

      <p className="text-xs text-gray-500">
        Hesabınızdan havale/EFT yaptıktan sonra aşağıdaki formu doldurun.
        Dekont eklemeniz işlemleri hızlandıracaktır.
      </p>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <div>
        <label className="mb-1 block text-xs text-gray-500">Gönderen Adı Soyadı *</label>
        <input
          required
          value={transferName}
          onChange={(e) => setTransferName(e.target.value)}
          placeholder="Hesap sahibinin adı"
          className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">Havale/EFT Tarihi *</label>
        <input
          required
          type="date"
          value={transferDate}
          onChange={(e) => setTransferDate(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">Dekont (opsiyonel)</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.webp"
          onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-600 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Gönderiliyor..." : "Havale Bildirimi Yap"}
      </button>
    </form>
  );
}
