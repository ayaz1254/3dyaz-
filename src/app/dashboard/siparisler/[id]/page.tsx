import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CancelOrderButton } from "./cancel-button";
import { TransferForm } from "./transfer-form";

const statusLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  APPROVED: "Onaylandı",
  PRINTING: "Basılıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

const orderSteps = ["PENDING", "APPROVED", "PRINTING", "SHIPPED", "DELIVERED"];

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: { select: { name: true, slug: true, images: true } } },
      },
      payment: true,
      address: true,
    },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const currentStepIndex = orderSteps.indexOf(order.status);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/siparisler"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Siparişlerime Dön
      </Link>

      <h1 className="text-2xl font-bold">Sipariş #{order.orderNumber}</h1>

      {/* Progress */}
      <div className="rounded-lg border bg-white p-6 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          {orderSteps.map((step, i) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  i <= currentStepIndex
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400 dark:bg-gray-700"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`mt-1 text-xs ${
                  i <= currentStepIndex
                    ? "font-medium text-blue-600"
                    : "text-gray-400"
                }`}
              >
                {statusLabels[step]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Ürünler</h2>
          <div className="divide-y">
            {order.items.map((item) => {
              const images: string[] = item.product?.images
                ? JSON.parse(item.product.images)
                : [];
              return (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  {images[0] && (
                    <img
                      src={images[0]}
                      alt={item.product?.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 text-sm">
                    <Link
                      href={`/urunler/${item.product?.slug}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {item.quantity} adet x {item.unitPrice.toFixed(2)} ₺
                    </p>
                  </div>
                  <p className="text-sm font-medium">{item.totalPrice.toFixed(2)} ₺</p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 border-t pt-3 text-sm">
            <div className="flex justify-between">
              <span>Kargo</span>
              <span>{order.shippingAmount === 0 ? "Ücretsiz" : `${order.shippingAmount.toFixed(2)} ₺`}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Toplam</span>
              <span>{order.totalAmount.toFixed(2)} ₺</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
            <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Adres</h2>
            <p className="text-sm">{order.address.fullName}</p>
            <p className="text-sm text-gray-500">{order.address.fullAddress}</p>
            <p className="text-sm text-gray-500">
              {order.address.district}, {order.address.city}
            </p>
            <p className="text-sm text-gray-500">{order.address.phone}</p>
          </div>

            <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
              <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
                Ödeme
              </h2>
              <p className="text-sm">
                {order.paymentMethod === "TRANSFER" ? "Havale/EFT" : order.paymentMethod === "CREDIT_CARD" ? "Kredi Kartı" : "Kapıda Ödeme"}
              </p>
              <p className="text-sm">
                Durum:{" "}
                {order.paymentStatus === "PAID"
                  ? "Ödendi"
                  : order.paymentStatus === "PENDING"
                    ? "Bekliyor"
                    : "İade"}
              </p>
            </div>

            {order.paymentMethod === "TRANSFER" &&
              order.paymentStatus === "PENDING" &&
              order.status !== "CANCELLED" && (
                <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
                  <TransferForm orderId={order.id} />
                </div>
              )}

          {order.cargoCompany && (
            <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
              <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Kargo</h2>
              <p className="text-sm">{order.cargoCompany}</p>
              {order.cargoTrackingNo && (
                <p className="text-sm text-gray-500">Takip: {order.cargoTrackingNo}</p>
              )}
            </div>
          )}

          {order.status === "PENDING" && (
            <CancelOrderButton orderId={order.id} />
          )}
        </div>
      </div>
    </div>
  );
}
