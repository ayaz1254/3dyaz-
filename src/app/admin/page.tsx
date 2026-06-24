import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "Bekliyor",
  APPROVED: "Onaylandı",
  PRINTING: "Basılıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-blue-500",
  PRINTING: "bg-purple-500",
  SHIPPED: "bg-orange-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

export default async function AdminDashboard() {
  const [
    productCount,
    orderCount,
    customerCount,
    pendingUploads,
    orderStatusGroups,
    revenueResult,
    paidCount,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.customUpload.count({ where: { status: "PENDING" } }),
    // Status distribution
    Promise.all(
      (["PENDING", "APPROVED", "PRINTING", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map(
        (status) =>
          prisma.order.count({ where: { status } }).then((c) => ({ status, count: c }))
      )
    ),
    // Revenue
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    // Low stock (less than 5)
    prisma.product.findMany({
      where: { stock: { lt: 5 }, isPublished: true },
      select: { name: true, stock: true, slug: true },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    // Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const totalRevenue = revenueResult._sum.totalAmount || 0;
  const maxStatusCount = Math.max(...orderStatusGroups.map((g) => g.count), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Paneli</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Toplam Ürün" value={productCount} color="bg-blue-500" />
        <StatCard label="Toplam Sipariş" value={orderCount} color="bg-green-500" />
        <StatCard label="Ödenen Sipariş" value={paidCount} color="bg-emerald-500" />
        <StatCard label="Müşteri" value={customerCount} color="bg-purple-500" />
        <StatCard label="Bekleyen Talep" value={pendingUploads} color="bg-orange-500" />
      </div>

      {/* Revenue + Order Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Card */}
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Gelir</h2>
          <p className="text-3xl font-bold text-green-600">{totalRevenue.toFixed(2)} ₺</p>
          <p className="mt-1 text-xs text-gray-400">Ödenen siparişlerden toplam gelir</p>
        </div>

        {/* Order Status Distribution */}
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Sipariş Durum Dağılımı</h2>
          <div className="space-y-2">
            {orderStatusGroups.map(({ status, count }) => (
              <div key={status}>
                <div className="mb-0.5 flex items-center justify-between text-sm">
                  <span>{statusLabels[status] || status}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all ${statusColors[status] || "bg-gray-400"}`}
                    style={{ width: `${(count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <h2 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-300">
            Azalan Stoklar ({lowStockProducts.length})
          </h2>
          <div className="space-y-1">
            {lowStockProducts.map((p) => (
              <p key={p.slug} className="text-sm text-red-600 dark:text-red-400">
                {p.name} — <strong>{p.stock} adet</strong> kaldı
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="rounded-lg border bg-white dark:bg-gray-950">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Son Siparişler</h2>
        </div>
        <div className="divide-y">
          {recentOrders.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Henüz sipariş yok</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">
                    {order.user.name || order.user.email} — {order.totalAmount.toFixed(2)} ₺
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "APPROVED"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "PRINTING"
                          ? "bg-purple-100 text-purple-700"
                          : order.status === "SHIPPED"
                            ? "bg-orange-100 text-orange-700"
                            : order.status === "DELIVERED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                  }`}
                >
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
