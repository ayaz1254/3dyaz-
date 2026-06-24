import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const { name, phone } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name || null, phone: phone || null },
      select: { id: true, name: true, email: true, phone: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Güncellenemedi" },
      { status: 500 }
    );
  }
}
