import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  const uploads = await prisma.customUpload.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(uploads);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const notes = formData.get("notes") as string | null;
    const desiredColor = formData.get("desiredColor") as string | null;
    const desiredSize = formData.get("desiredSize") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    const validTypes = [".stl", ".obj", ".3mf", ".step"];
    const ext = path.extname(file.name).toLowerCase();
    if (!validTypes.includes(ext)) {
      return NextResponse.json(
        { error: "Geçersiz dosya türü. STL, OBJ, 3MF veya STEP yükleyin." },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dosya 50MB'dan küçük olmalıdır" },
        { status: 400 }
      );
    }

    // Save file
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueName}`;

    const upload = await prisma.customUpload.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        fileType: ext.replace(".", ""),
        notes: notes || null,
        desiredColor: desiredColor || null,
        desiredSize: desiredSize || null,
      },
    });

    return NextResponse.json(upload, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Dosya yüklenemedi" },
      { status: 500 }
    );
  }
}
