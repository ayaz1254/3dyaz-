import { PrismaClient } from "../src/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@3dmagza.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@3dmagza.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`  ✓ Admin user: ${admin.email}`);

  // Create demo customer
  const customerPassword = await hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@demo.com" },
    update: {},
    create: {
      name: "Demo Müşteri",
      email: "customer@demo.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });
  console.log(`  ✓ Customer: ${customer.email}`);

  // Create categories
  const categories = [
    { name: "Aksiyon Figürleri", slug: "aksiyon-figurleri", description: "3D baskı aksiyon figürleri ve heykelcikler" },
    { name: "Ev Dekorasyonu", slug: "ev-dekorasyonu", description: "3D baskı ev dekorasyon ürünleri" },
    { name: "Kostüm & Aksesuar", slug: "kostum-aksesuar", description: "Kostüm parçaları ve aksesuarlar" },
    { name: "Masaüstü Oyun", slug: "masaustu-oyun", description: "Masaüstü oyun parçaları ve mini figürler" },
    { name: "Yedek Parça", slug: "yedek-parca", description: "3D baskı yedek parçalar ve tamir parçaları" },
    { name: "Eğitim & Hobi", slug: "egitim-hobi", description: "Eğitim amaçlı 3D baskı modelleri" },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (existing) {
      createdCategories[cat.slug] = existing.id;
    } else {
      const created = await prisma.category.create({ data: cat });
      createdCategories[cat.slug] = created.id;
    }
  }
  console.log(`  ✓ ${categories.length} categories created`);

  // Create sample products
  const products = [
    {
      name: "Ejderha Heykeli",
      slug: "ejderha-heykeli",
      description: "Detaylı 3D baskı ejderha heykeli. Yüksek çözünürlüklü model, gerçekçi doku detayları.",
      shortDesc: "Detaylı ejderha heykeli",
      price: 249.99,
      comparePrice: 299.99,
      stock: 15,
      isPublished: true,
      images: JSON.stringify(["/placeholder.svg"]),
      material: "PLA+",
      dimensions: "15x10x20 cm",
      weight: 0.25,
      colors: JSON.stringify(["Kırmızı", "Mavi", "Yeşil", "Siyah"]),
      categorySlug: "aksiyon-figurleri",
    },
    {
      name: "Vazo Modern Tasarım",
      slug: "vazo-modern-tasarim",
      description: "Modern çizgilere sahip 3D baskı vazo. Minimalist dekorasyon için ideal.",
      shortDesc: "Modern tasarım vazo",
      price: 89.99,
      comparePrice: null,
      stock: 30,
      isPublished: true,
      images: JSON.stringify(["/placeholder.svg"]),
      material: "PETG",
      dimensions: "10x10x25 cm",
      weight: 0.18,
      colors: JSON.stringify(["Beyaz", "Siyah", "Gri", "Mat Altın"]),
      categorySlug: "ev-dekorasyonu",
    },
    {
      name: "Satranç Takımı - Ortaçağ Temalı",
      slug: "satranc-takimi-ortacag",
      description: "Ortaçağ temalı tam 3D baskı satranç takımı. 32 parça, özel tasarım şövalye ve kale figürleri.",
      shortDesc: "Ortaçağ temalı satranç takımı",
      price: 459.99,
      comparePrice: 549.99,
      stock: 5,
      isPublished: true,
      images: JSON.stringify(["/placeholder.svg"]),
      material: "PLA",
      dimensions: "Kutu: 30x30x8 cm",
      weight: 1.2,
      colors: JSON.stringify(["Siyah/Beyaz", "Doğal/Mat Siyah"]),
      categorySlug: "masaustu-oyun",
    },
    {
      name: "Telefon Tutucu - Ayarlanabilir",
      slug: "telefon-tutucu-ayarlanabilir",
      description: "Masaüstü için ayarlanabilir 3D baskı telefon tutucu. Tüm telefon modelleriyle uyumlu.",
      shortDesc: "Ayarlanabilir masaüstü telefon tutucu",
      price: 49.99,
      comparePrice: null,
      stock: 50,
      isPublished: true,
      images: JSON.stringify(["/placeholder.svg"]),
      material: "PLA+",
      dimensions: "12x8x10 cm",
      weight: 0.08,
      colors: JSON.stringify(["Siyah", "Beyaz", "Mavi", "Kırmızı"]),
      categorySlug: "egitim-hobi",
    },
  ];

  for (const product of products) {
    const { categorySlug, ...productData } = product;
    const categoryId = createdCategories[categorySlug];
    if (!categoryId) {
      console.warn(`  ⚠ Skipping ${product.name}: category ${categorySlug} not found`);
      continue;
    }

    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (!existing) {
      await prisma.product.create({
        data: { ...productData, categoryId },
      });
    }
  }
  console.log(`  ✓ ${products.length} products created`);

  console.log("\n✅ Seed complete!");
  console.log("   Admin:    admin@3dmagza.com / admin123");
  console.log("   Customer: customer@demo.com / customer123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
