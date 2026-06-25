import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(post);
  }

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, image, category, author } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Başlık, slug ve içerik gerekli" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Bu slug ile bir yazı zaten var" }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        image: image || null,
        category: category || null,
        author: author || "Admin",
        published: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Blog yazısı oluşturulamadı" }, { status: 500 });
  }
}
