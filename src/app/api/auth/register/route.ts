import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Ad gerekli").optional(),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, remaining } = await rateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Çok fazla istek, lütfen bekleyin" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı" },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 12);

    await prisma.user.create({
      data: {
        name: name || null,
        email,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json(
      { message: "Kayıt başarılı" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
