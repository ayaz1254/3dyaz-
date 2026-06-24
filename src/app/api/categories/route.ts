import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Kategori adı gerekli"),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  parentId: z.string().optional().default(""),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", fields: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })) },
        { status: 400 }
      );
    }

    const { name, description, imageUrl, parentId } = parsed.data;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9çşğüöı]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        imageUrl: imageUrl || null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Kategori oluşturulamadı" },
      { status: 500 }
    );
  }
}
