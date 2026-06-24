import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UploadReviewForm } from "./review-form";

export default async function AdminUploadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const upload = await prisma.customUpload.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      order: { select: { id: true, orderNumber: true, status: true, totalAmount: true } },
    },
  });

  if (!upload) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Talep Detayı</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Müşteri</h2>
          <p className="font-medium">{upload.user.name || "İsimsiz"}</p>
          <p className="text-sm text-gray-500">{upload.user.email}</p>
          {upload.user.phone && (
            <p className="text-sm text-gray-500">{upload.user.phone}</p>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Dosya</h2>
          <p className="font-medium">{upload.fileName}</p>
          <p className="text-sm text-gray-500">
            {(upload.fileSize / 1024 / 1024).toFixed(2)} MB - {upload.fileType}
          </p>
          <a
            href={upload.fileUrl}
            target="_blank"
            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
          >
            Dosyayı İndir
          </a>
        </div>

        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">
            Müşteri Notları
          </h2>
          {upload.notes && <p className="text-sm">{upload.notes}</p>}
          {upload.desiredColor && (
            <p className="mt-1 text-sm">
              <span className="font-medium">Renk:</span> {upload.desiredColor}
            </p>
          )}
          {upload.desiredSize && (
            <p className="mt-1 text-sm">
              <span className="font-medium">Boyut:</span> {upload.desiredSize}
            </p>
          )}
          {!upload.notes && !upload.desiredColor && !upload.desiredSize && (
            <p className="text-sm text-gray-400">Belirtilmemiş</p>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">
            Değerlendirme
          </h2>
          <UploadReviewForm
            uploadId={upload.id}
            currentStatus={upload.status}
            currentPrice={upload.estimatedPrice}
            currentDays={upload.estimatedDays}
            currentNote={upload.adminNote}
            currentPrintable={upload.isPrintable}
            currentRejection={upload.rejectionReason}
          />
        </div>

        {upload.order && (
          <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
            <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Sipariş</h2>
            <p className="text-sm">
              Sipariş No:{" "}
              <a
                href={`/admin/orders/${upload.order.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {upload.order.orderNumber}
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Tutar: {upload.order.totalAmount.toFixed(2)} ₺
            </p>
            <p className="text-sm text-gray-500">
              Durum:{" "}
              {upload.order.status === "PENDING"
                ? "Bekliyor"
                : upload.order.status === "APPROVED"
                  ? "Onaylandı"
                  : upload.order.status === "PRINTING"
                    ? "Basılıyor"
                    : upload.order.status === "SHIPPED"
                      ? "Kargoda"
                      : upload.order.status === "DELIVERED"
                        ? "Teslim Edildi"
                        : "İptal Edildi"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
