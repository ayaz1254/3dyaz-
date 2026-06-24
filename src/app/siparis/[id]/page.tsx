import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrderConfirmationPage({
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
      items: { include: { product: { select: { name: true, slug: true } } } },
      payment: true,
      address: true,
    },
  });

  if (!order || order.userId !== session.user.id) {
    redirect("/dashboard/siparisler");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="rounded-lg border bg-white p-8 text-center dark:bg-gray-950">
        <div className="mb-4 text-5xl">✅</div>
        <h1 className="mb-2 text-2xl font-bold">Siparişiniz Alındı!</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Sipariş numaranız: <span className="font-bold text-blue-600">{order.orderNumber}</span>
        </p>

        <div className="mb-6 text-left text-sm">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <h3 className="mb-2 font-semibold">Sipariş Özeti</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.product?.name} x{item.quantity}
                  </span>
                  <span>{item.totalPrice.toFixed(2)} ₺</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold">
                <div className="flex justify-between">
                  <span>Toplam</span>
                  <span>{order.totalAmount.toFixed(2)} ₺</span>
                </div>
              </div>
            </div>
          </div>

          {order.paymentMethod === "TRANSFER" && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-xs text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
              <p className="mb-1 font-medium">📋 Havale/EFT Bilgileri</p>
              <p>Banka: XYZ Bankası</p>
              <p>IBAN: TR12 3456 7890 1234 5678 9012 34</p>
              <p>Alıcı Adı: 3D Magza Tic. Ltd. Şti.</p>
              <p className="mt-2">
                Açıklama kısmına sipariş numaranızı ({order.orderNumber}) yazmayı unutmayın.
              </p>
            </div>
          )}

          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-900">
            <h3 className="mb-1 font-semibold">Teslimat Adresi</h3>
            <p>{order.address.fullName}</p>
            <p>{order.address.fullAddress}</p>
            <p>
              {order.address.district}, {order.address.city}
            </p>
            <p>{order.address.phone}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard/siparisler"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700"
          >
            Siparişlerim
          </Link>
          <Link
            href="/"
            className="rounded-lg border px-6 py-2 text-sm hover:bg-gray-50"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
