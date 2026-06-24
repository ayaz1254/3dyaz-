import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import Link from "next/link";

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

export default async function CustomerUploadsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const uploads = await prisma.customUpload.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yüklemelerim</h1>
        <Link
          href="/yukle"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + Yeni Yükle
        </Link>
      </div>

      {uploads.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>Henüz dosya yüklememişsiniz.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {uploads.map((u) => (
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
                  Fiyat: {u.estimatedPrice.toFixed(2)} ₺
                  {u.estimatedDays && ` • ${u.estimatedDays} iş günü`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
