import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(1, "Ürün adı gerekli"),
  description: z.string().min(1, "Açıklama gerekli"),
  shortDesc: z.string().optional().default(""),
  price: z.coerce.number().positive("Fiyat pozitif olmalı"),
  comparePrice: z.coerce.number().optional().default(0),
  images: z.array(z.string()).optional().default([]),
  stock: z.coerce.number().int().min(0).optional().default(0),
  isPublished: z.boolean().optional().default(false),
  material: z.string().optional().default(""),
  dimensions: z.string().optional().default(""),
  weight: z.coerce.number().optional().default(0),
  colors: z.array(z.string()).optional().default([]),
  isDigital: z.boolean().optional().default(false),
  fileUrl: z.string().optional().default(""),
  categoryId: z.string().min(1, "Kategori gerekli"),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (category) where.categoryId = category;
  if (search) where.name = { contains: search };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", fields: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
        { status: 400 }
      );
    }

    const {
      name, description, shortDesc, price, comparePrice,
      images, stock, isPublished, material, dimensions,
      weight, colors, isDigital, fileUrl, categoryId,
    } = parsed.data;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc: shortDesc || null,
        price,
        comparePrice: comparePrice || null,
        images: JSON.stringify(images),
        stock,
        isPublished,
        material: material || null,
        dimensions: dimensions || null,
        weight: weight || null,
        colors: JSON.stringify(colors),
        isDigital,
        fileUrl: fileUrl || null,
        categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ürün oluşturulamadı" },
      { status: 500 }
    );
  }
}
