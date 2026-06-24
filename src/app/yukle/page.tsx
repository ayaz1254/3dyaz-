"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [desiredColor, setDesiredColor] = useState("");
  const [desiredSize, setDesiredSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploads, setUploads] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user) fetchUploads();
  }, [session, status]);

  async function fetchUploads() {
    const res = await fetch("/api/uploads");
    if (res.ok) setUploads(await res.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    if (notes) formData.append("notes", notes);
    if (desiredColor) formData.append("desiredColor", desiredColor);
    if (desiredSize) formData.append("desiredSize", desiredSize);

    const res = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setFile(null);
      setNotes("");
      setDesiredColor("");
      setDesiredSize("");
      fetchUploads();
    } else {
      const data = await res.json();
      setError(data.error || "Yükleme başarısız");
    }
    setLoading(false);
  }

  if (status === "loading") return <div className="p-8 text-center">Yükleniyor...</div>;

  const statusLabels: Record<string, string> = {
    PENDING: "Bekliyor",
    REVIEWING: "İnceleniyor",
    PRICED: "Fiyatlandırıldı",
    APPROVED: "Onaylandı",
    REJECTED: "Reddedildi",
    CANCELLED: "İptal Edildi",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    REVIEWING: "bg-blue-100 text-blue-700",
    PRICED: "bg-purple-100 text-purple-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">3D Model Yükle</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-10 space-y-4 rounded-lg border bg-white p-6 dark:bg-gray-950">
        <div>
          <label className="mb-1 block text-sm font-medium">Dosya (STL, OBJ, 3MF, STEP)</label>
          <input
            type="file"
            accept=".stl,.obj,.3mf,.step"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300"
          />
          <p className="mt-1 text-xs text-gray-500">Maksimum 50MB</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Notlar</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Baskı ile ilgili özel istekleriniz..."
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">İstenen Renk</label>
            <input
              value={desiredColor}
              onChange={(e) => setDesiredColor(e.target.value)}
              placeholder="Mavi, Kırmızı..."
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">İstenen Boyut</label>
            <input
              value={desiredSize}
              onChange={(e) => setDesiredSize(e.target.value)}
              placeholder="10x10x15 cm"
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Yükleniyor..." : "Yükle"}
        </button>
      </form>

      {/* Upload history */}
      {uploads.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Geçmiş Yüklemeleriniz</h2>
          <div className="space-y-3">
            {uploads.map((u: any) => (
              <div key={u.id} className="rounded-lg border bg-white p-4 dark:bg-gray-950">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{u.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {(u.fileSize / 1024 / 1024).toFixed(2)} MB -{" "}
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[u.status] || ""
                    }`}
                  >
                    {statusLabels[u.status] || u.status}
                  </span>
                </div>

                {u.estimatedPrice && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Tahmini Fiyat:</span>{" "}
                    <span className="font-medium">{u.estimatedPrice.toFixed(2)} ₺</span>
                    {u.estimatedDays && (
                      <>
                        <span className="text-gray-500"> • Teslimat:</span>{" "}
                        <span className="font-medium">{u.estimatedDays} iş günü</span>
                      </>
                    )}
                  </div>
                )}

                {u.adminNote && (
                  <p className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Admin Notu:</span> {u.adminNote}
                  </p>
                )}

                {u.status === "PRICED" && !u.customerApproved && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={async () => {
                        await fetch(`/api/uploads/${u.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ customerApproved: true }),
                        });
                        fetchUploads();
                      }}
                      className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white hover:bg-green-700"
                    >
                      Onayla
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
