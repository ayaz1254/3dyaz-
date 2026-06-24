import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import path from "path";
import { uploadBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";

const MAGIC_BYTES: Record<string, (buf: Buffer) => boolean> = {
  ".stl": (buf) => buf.length > 80 && buf.toString("ascii", 0, 6) === "solid ",
  ".obj": (buf) => buf.toString("utf8", 0, 1) === "#",
  ".3mf": (buf) => buf[0] === 0x50 && buf[1] === 0x4b,
  ".step": (buf) => buf.toString("ascii", 0, 13) === "ISO-10303-21;",
};

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

    if (file.size === 0) {
      return NextResponse.json({ error: "Boş dosya yüklenemez" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const validateContent = MAGIC_BYTES[ext];
    if (validateContent && !validateContent(buffer)) {
      return NextResponse.json(
        { error: "Dosya içeriği geçersiz veya bozuk" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary (fallback to local storage)
    let fileUrl: string;
    if (isCloudinaryConfigured()) {
      const result = await uploadBuffer(buffer, "models", file.name);
      fileUrl = result.secure_url;
    } else {
      // Fallback: local storage (development)
      const { writeFile, mkdir } = await import("fs/promises");
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });
      const uniqueName = `${Date.now()}-${crypto.randomUUID().split("-")[0]}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);
      fileUrl = `/uploads/${uniqueName}`;
    }

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
