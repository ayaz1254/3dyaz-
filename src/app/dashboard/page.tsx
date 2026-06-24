import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function CustomerDashboard() {
  const session = await auth();
  if (!session?.user) return null;

  const [totalOrders, pendingOrders, totalUploads] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.order.count({
      where: { userId: session.user.id, status: "PENDING" },
    }),
    prisma.customUpload.count({ where: { userId: session.user.id } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const statusLabels: Record<string, string> = {
    PENDING: "Bekliyor",
    APPROVED: "Onaylandı",
    PRINTING: "Basılıyor",
    SHIPPED: "Kargoda",
    DELIVERED: "Teslim Edildi",
    CANCELLED: "İptal",
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-blue-100 text-blue-700",
    PRINTING: "bg-purple-100 text-purple-700",
    SHIPPED: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hesabım</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <p className="text-sm text-gray-500">Toplam Sipariş</p>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <p className="text-sm text-gray-500">Bekleyen Sipariş</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <p className="text-sm text-gray-500">Yüklemeler</p>
          <p className="text-3xl font-bold">{totalUploads}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-950">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-semibold">Son Siparişler</h2>
          <Link href="/dashboard/siparisler" className="text-sm text-blue-600 hover:underline">
            Tümü
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">Henüz siparişiniz yok.</p>
        ) : (
          <div className="divide-y">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/siparisler/${order.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">
                    {order.items.reduce((t, i) => t + i.quantity, 0)} ürün -{" "}
                    {order.totalAmount.toFixed(2)} ₺
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    statusColors[order.status] || ""
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
