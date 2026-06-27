import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { DeleteProductButton } from "./delete-button";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mağaza</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-950">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 font-medium">Foto</th>
              <th className="px-4 py-3 font-medium">Ürün Adı</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Fiyat</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  Henüz ürün eklenmemiş.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const images: string[] = JSON.parse(product.images || "[]");
                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-4 py-3">
                      {images[0] ? (
                        <img
                          src={images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                          -
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {product.category?.name || "-"}
                    </td>
                    <td className="px-4 py-3">{product.price.toFixed(2)} ₺</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      {product.isPublished ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                          Yayında
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                          Taslak
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                        >
                          Düzenle
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
