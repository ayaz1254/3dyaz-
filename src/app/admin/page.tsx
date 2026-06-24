import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [productCount, orderCount, customerCount, pendingUploads] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.customUpload.count({ where: { status: "PENDING" } }),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const stats = [
    { label: "Toplam Ürün", value: productCount, color: "bg-blue-500" },
    { label: "Toplam Sipariş", value: orderCount, color: "bg-green-500" },
    { label: "Müşteri", value: customerCount, color: "bg-purple-500" },
    { label: "Bekleyen Talepler", value: pendingUploads, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Paneli</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-white p-4 dark:bg-gray-950">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white dark:bg-gray-950">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Son Siparişler</h2>
        </div>
        <div className="divide-y">
          {recentOrders.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Henüz sipariş yok</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.user.name || order.user.email}
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
