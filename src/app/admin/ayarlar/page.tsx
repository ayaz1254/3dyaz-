"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [holder, setHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setBankName(data.iban_bank_name || "");
        setIban(data.iban_number || "");
        setHolder(data.iban_holder || "");
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        iban_bank_name: bankName,
        iban_number: iban,
        iban_holder: holder,
      }),
    });

    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      alert("Kaydedilemedi");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Site Ayarları</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6 dark:bg-gray-950">
        <div>
          <label className="mb-1 block text-sm font-medium">Banka Adı</label>
          <input
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="XYZ Bankası"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">IBAN</label>
          <input
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            placeholder="TR12 3456 7890 1234 5678 9012 34"
            className="w-full rounded-lg border px-3 py-2 text-sm font-mono dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Alıcı Adı</label>
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            placeholder="3D Magza Tic. Ltd. Şti."
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />
        </div>

        {saved && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            Ayarlar kaydedildi!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
