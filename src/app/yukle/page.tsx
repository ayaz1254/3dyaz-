"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DynamicModelViewer } from "@/components/dynamic-model-viewer";
import { GlassCard } from "@/components/glass-card";
import { motion } from "motion/react";

const statusLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  REVIEWING: "İnceleniyor",
  PRICED: "Fiyatlandırıldı",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  REVIEWING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PRICED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

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

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <h1 className="text-4xl font-bold text-white">3D Model Yükle</h1>
        <p className="mt-2 text-gray-400">
          STL, OBJ veya 3MF dosyanızı yükleyin, size özel fiyat teklifi verelim.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Upload form */}
      <GlassCard glowColor="rgba(56, 189, 248, 0.08)">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* File input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Dosya (STL, OBJ, 3MF, STEP)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".stl,.obj,.3mf,.step"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-8 text-sm text-gray-400 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:border-cyan-500/50"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-white/5">
                {!file && (
                  <span className="text-sm text-gray-600">
                    Dosyayı sürükleyin veya seçin
                  </span>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">Maksimum 50MB</p>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">Notlar</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Baskı ile ilgili özel istekleriniz..."
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/50"
            />
          </div>

          {/* Color + Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">İstenen Renk</label>
              <input
                value={desiredColor}
                onChange={(e) => setDesiredColor(e.target.value)}
                placeholder="Mavi, Kırmızı..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">İstenen Boyut</label>
              <input
                value={desiredSize}
                onChange={(e) => setDesiredSize(e.target.value)}
                placeholder="10x10x15 cm"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Yükle
                </>
              )}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400 to-blue-500 transition group-hover:translate-x-0" />
          </button>
        </form>
      </GlassCard>

      {/* 3D Preview before upload */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 mt-6"
        >
          <h2 className="mb-3 text-lg font-semibold text-white">Önizleme</h2>
          <FilePreview file={file} />
        </motion.div>
      )}

      {/* Upload history */}
      {uploads.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12"
        >
          <h2 className="mb-6 text-xl font-bold text-white">Geçmiş Yüklemeleriniz</h2>
          <div className="space-y-4">
            {uploads.map((u: any) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard glowColor="rgba(255,255,255,0.03)">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{u.fileName}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {(u.fileSize / 1024 / 1024).toFixed(2)} MB &middot;{" "}
                          {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                          statusStyles[u.status] || "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {statusLabels[u.status] || u.status}
                      </span>
                    </div>

                    {/\.(stl|obj|3mf)$/i.test(u.fileName) && (
                      <details className="group mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-cyan-400 transition hover:text-cyan-300">
                          3D Modeli Görüntüle
                        </summary>
                        <div className="mt-3">
                          <DynamicModelViewer url={u.fileUrl} />
                        </div>
                      </details>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      {u.estimatedPrice && (
                        <>
                          <span className="text-gray-500">Tahmini Fiyat:</span>
                          <span className="font-medium text-cyan-300">
                            {Number(u.estimatedPrice).toFixed(2)} ₺
                          </span>
                        </>
                      )}
                      {u.estimatedDays && (
                        <>
                          <span className="text-gray-500">Teslimat:</span>
                          <span className="font-medium text-gray-200">
                            {u.estimatedDays} iş günü
                          </span>
                        </>
                      )}
                    </div>

                    {u.adminNote && (
                      <p className="mt-2 text-sm text-gray-400">
                        <span className="font-medium text-gray-300">Admin Notu:</span> {u.adminNote}
                      </p>
                    )}

                    {u.status === "PRICED" && !u.customerApproved && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={async () => {
                            await fetch(`/api/uploads/${u.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ customerApproved: true }),
                            });
                            fetchUploads();
                          }}
                          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/40"
                        >
                          Onayla
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function FilePreview({ file }: { file: File }) {
  const objectUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const is3dModel = /\.(stl|obj|3mf)$/i.test(file.name);

  if (!is3dModel) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] px-8 py-10 text-center text-sm text-gray-500">
        {file.name} — Bu dosya türü için önizleme desteklenmiyor
      </div>
    );
  }

  return <DynamicModelViewer url={objectUrl} />;
}
