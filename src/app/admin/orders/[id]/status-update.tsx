"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statusOptions = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "APPROVED", label: "Onaylandı" },
  { value: "PRINTING", label: "Basılıyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
];

export function OrderStatusUpdate({
  orderId,
  currentStatus,
  currentPaymentStatus,
  cargoCompany,
  cargoTrackingNo,
}: {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  cargoCompany: string | null;
  cargoTrackingNo: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [cargo, setCargo] = useState(cargoCompany || "");
  const [tracking, setTracking] = useState(cargoTrackingNo || "");
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body: Record<string, unknown> = {};
    if (status !== currentStatus) body.status = status;
    if (paymentStatus !== currentPaymentStatus) body.paymentStatus = paymentStatus;
    body.cargoCompany = cargo || null;
    body.cargoTrackingNo = tracking || null;

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Güncelleme başarısız");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-gray-500">Sipariş Durumu</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">Ödeme Durumu</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
        >
          <option value="PENDING">Bekliyor</option>
          <option value="PAID">Ödendi</option>
          <option value="REFUNDED">İade Edildi</option>
        </select>
        {currentPaymentStatus === "PENDING" && paymentStatus === "PAID" && (
          <p className="mt-1 text-xs text-green-600">Ödeme onaylanacak</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">Kargo Firması</label>
        <input
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          placeholder="MNG, Yurtiçi, Aras..."
          className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">Takip No</label>
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Takip numarası"
          className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Güncelleniyor..." : "Güncelle"}
      </button>
    </form>
  );
}
