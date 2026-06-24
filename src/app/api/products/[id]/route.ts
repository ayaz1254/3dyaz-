import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  comparePrice: z.coerce.number().optional(),
  images: z.array(z.string()).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.coerce.number().optional(),
  colors: z.array(z.string()).optional(),
  isDigital: z.boolean().optional(),
  fileUrl: z.string().optional(),
  categoryId: z.string().min(1).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", fields: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
        { status: 400 }
      );
    }

    const data: Record<string, unknown> = {};
    const fields = parsed.data;
    if (fields.name !== undefined) data.name = fields.name;
    if (fields.description !== undefined) data.description = fields.description;
    if (fields.shortDesc !== undefined) data.shortDesc = fields.shortDesc || null;
    if (fields.price !== undefined) data.price = fields.price;
    if (fields.comparePrice !== undefined) data.comparePrice = fields.comparePrice || null;
    if (fields.images !== undefined) data.images = JSON.stringify(fields.images);
    if (fields.stock !== undefined) data.stock = fields.stock;
    if (fields.isPublished !== undefined) data.isPublished = fields.isPublished;
    if (fields.material !== undefined) data.material = fields.material || null;
    if (fields.dimensions !== undefined) data.dimensions = fields.dimensions || null;
    if (fields.weight !== undefined) data.weight = fields.weight || null;
    if (fields.colors !== undefined) data.colors = JSON.stringify(fields.colors);
    if (fields.isDigital !== undefined) data.isDigital = fields.isDigital;
    if (fields.fileUrl !== undefined) data.fileUrl = fields.fileUrl || null;
    if (fields.categoryId !== undefined) data.categoryId = fields.categoryId;

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Ürün güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Ürün silindi" });
  } catch {
    return NextResponse.json(
      { error: "Ürün silinemedi" },
      { status: 500 }
    );
  }
}
