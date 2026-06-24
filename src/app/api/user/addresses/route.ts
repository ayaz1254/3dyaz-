import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const addressIdSchema = z.object({
  id: z.string().min(1, "Adres ID gerekli"),
});

const addressSchema = z.object({
  title: z.string().min(1, "Adres başlığı gerekli"),
  fullName: z.string().min(1, "Ad soyad gerekli"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  city: z.string().min(1, "İl gerekli"),
  district: z.string().min(1, "İlçe gerekli"),
  fullAddress: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
});

const addressUpdateSchema = addressSchema.extend({
  id: z.string().min(1, "Adres ID gerekli"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { title, fullName, phone, city, district, fullAddress } = parsed.data;

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        title,
        fullName,
        phone,
        city,
        district,
        fullAddress,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Adres eklenemedi" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = addressUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { id, title, fullName, phone, city, district, fullAddress } = parsed.data;

    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
    }

    const address = await prisma.address.update({
      where: { id },
      data: { title, fullName, phone, city, district, fullAddress },
    });

    return NextResponse.json(address);
  } catch {
    return NextResponse.json(
      { error: "Adres güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = addressIdSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Adres ID gerekli" }, { status: 400 });
    }

    const { id } = parsed.data;

    const existing = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Adres bulunamadı" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ message: "Adres silindi" });
  } catch {
    return NextResponse.json(
      { error: "Adres silinemedi" },
      { status: 500 }
    );
  }
}
