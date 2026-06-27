import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

const IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
const MODEL_TYPES = [".stl", ".obj", ".3mf"];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...MODEL_TYPES];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function isModelFile(ext: string) {
  return MODEL_TYPES.includes(ext);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      return NextResponse.json(
        { error: "Geçersiz dosya türü. JPG, PNG, WebP, SVG, STL, OBJ veya 3MF yükleyin." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya 50MB'dan küçük olmalıdır" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const subDir = isModelFile(ext) ? "models" : "images";
    const uploadDir = path.join(process.cwd(), `public/uploads/${subDir}`);
    await mkdir(uploadDir, { recursive: true });
    const uniqueName = `${Date.now()}-${crypto.randomUUID().split("-")[0]}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${subDir}/${uniqueName}`, isModel: isModelFile(ext) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Dosya yüklenemedi" }, { status: 500 });
  }
}
