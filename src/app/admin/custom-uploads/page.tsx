import { prisma } from "@/lib/prisma";
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

export default async function AdminCustomUploadsPage() {
  const uploads = await prisma.customUpload.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Özel Baskı Talepleri</h1>

      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-950">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 font-medium">Dosya</th>
              <th className="px-4 py-3 font-medium">Müşteri</th>
              <th className="px-4 py-3 font-medium">Boyut</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Fiyat</th>
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {uploads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  Henüz talep yok.
                </td>
              </tr>
            ) : (
              uploads.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-3 font-medium">{u.fileName}</td>
                  <td className="px-4 py-3">{u.user.name || u.user.email}</td>
                  <td className="px-4 py-3">
                    {(u.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColors[u.status] || ""
                      }`}
                    >
                      {statusLabels[u.status] || u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.estimatedPrice ? `${u.estimatedPrice.toFixed(2)} ₺` : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/custom-uploads/${u.id}`}
                      className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
                    >
                      İncele
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
