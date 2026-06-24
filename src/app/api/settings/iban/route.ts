import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SETTING_KEYS = ["iban_bank_name", "iban_number", "iban_holder"];

export async function GET() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: SETTING_KEYS } },
  });

  const result: Record<string, string> = {};
  for (const key of SETTING_KEYS) {
    result[key] = settings.find((s) => s.key === key)?.value || "";
  }

  return NextResponse.json(result);
}
