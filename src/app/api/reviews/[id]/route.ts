import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { isApproved } = body;

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: !!isApproved },
    });

    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Yorum güncellenemedi" }, { status: 500 });
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

  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ message: "Yorum silindi" });
  } catch {
    return NextResponse.json({ error: "Yorum silinemedi" }, { status: 500 });
  }
}
