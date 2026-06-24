import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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
    const { title, fullName, phone, city, district, fullAddress } =
      await req.json();

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
    const { id, title, fullName, phone, city, district, fullAddress } =
      await req.json();

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
    const { id } = await req.json();

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
