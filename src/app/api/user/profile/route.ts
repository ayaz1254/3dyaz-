import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Ad gerekli").optional(),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz").optional(),
});

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
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, phone } = parsed.data;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name ?? null, phone: phone ?? null },
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
