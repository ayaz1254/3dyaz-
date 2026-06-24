import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderStatusUpdate } from "./status-update";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      address: true,
      items: {
        include: { product: { select: { name: true, images: true } } },
      },
      payment: true,
    },
  });

  if (!order) notFound();

  const images: string[] = order.items[0]?.product?.images
    ? JSON.parse(order.items[0].product.images)
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sipariş #{order.orderNumber}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Müşteri</h2>
          <p className="font-medium">{order.user.name || "İsimsiz"}</p>
          <p className="text-sm text-gray-500">{order.user.email}</p>
          {order.user.phone && (
            <p className="text-sm text-gray-500">{order.user.phone}</p>
          )}
        </div>

        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Teslimat</h2>
          <p className="text-sm">{order.address.fullName}</p>
          <p className="text-sm text-gray-500">{order.address.fullAddress}</p>
          <p className="text-sm text-gray-500">
            {order.address.district}, {order.address.city}
          </p>
          <p className="text-sm text-gray-500">{order.address.phone}</p>
        </div>

        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Ödeme</h2>
          <p className="text-sm">
            Yöntem:{" "}
            {order.paymentMethod === "TRANSFER"
              ? "Havale/EFT"
              : order.paymentMethod === "CREDIT_CARD"
                ? "Kredi Kartı"
                : "Kapıda Ödeme"}
          </p>
          <p className="text-sm">
            Durum:{" "}
            {order.paymentStatus === "PAID"
              ? "Ödendi"
              : order.paymentStatus === "PENDING"
                ? "Bekliyor"
                : "İade Edildi"}
          </p>
          {order.payment?.iyzicoPaymentId && (
            <p className="text-sm">
              Iyzico ID: <span className="font-mono text-xs">{order.payment.iyzicoPaymentId}</span>
            </p>
          )}
          {order.payment?.transferName && (
            <p className="text-sm">Gönderen: {order.payment.transferName}</p>
          )}
          {order.payment?.receiptImage && (
            <p className="text-sm">
              Dekont:{" "}
              <a
                href={order.payment.receiptImage}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Görüntüle
              </a>
            </p>
          )}
          <p className="mt-2 text-lg font-bold">
            Toplam: {order.totalAmount.toFixed(2)} ₺
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Durum</h2>
          <OrderStatusUpdate
            orderId={order.id}
            currentStatus={order.status}
            currentPaymentStatus={order.paymentStatus}
            cargoCompany={order.cargoCompany}
            cargoTrackingNo={order.cargoTrackingNo}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-950">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Ürünler</h2>
        </div>
        <div className="divide-y">
          {order.items.map((item) => {
            const itemImages: string[] = item.product?.images
              ? JSON.parse(item.product.images)
              : [];
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 px-4 py-3"
              >
                {itemImages[0] && (
                  <img
                    src={itemImages[0]}
                    alt={item.product?.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product?.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} adet x {item.unitPrice.toFixed(2)} ₺
                  </p>
                </div>
                <p className="font-medium">{item.totalPrice.toFixed(2)} ₺</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
