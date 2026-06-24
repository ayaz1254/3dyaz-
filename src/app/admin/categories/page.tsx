import { prisma } from "@/lib/prisma";
import { CategoryList } from "./category-list";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kategoriler</h1>
      <CategoryList categories={categories} />
    </div>
  );
}
