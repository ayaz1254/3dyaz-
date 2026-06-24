import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const SETTING_KEYS = ["iban_bank_name", "iban_number", "iban_holder"];

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: SETTING_KEYS } },
  });

  const result: Record<string, string> = {};
  for (const key of SETTING_KEYS) {
    result[key] = settings.find((s) => s.key === key)?.value || "";
  }

  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { iban_bank_name, iban_number, iban_holder } = body;

    const upserts = [
      { key: "iban_bank_name", value: iban_bank_name || "" },
      { key: "iban_number", value: iban_number || "" },
      { key: "iban_holder", value: iban_holder || "" },
    ];

    for (const { key, value } of upserts) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ayarlar kaydedilemedi" }, { status: 500 });
  }
}

// Public endpoint to get IBAN info (no auth required)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { public: isPublic } = body;

  if (!isPublic) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: SETTING_KEYS } },
  });

  const result: Record<string, string> = {};
  for (const key of SETTING_KEYS) {
    result[key] = settings.find((s) => s.key === key)?.value || "";
  }

  return NextResponse.json(result);
}
