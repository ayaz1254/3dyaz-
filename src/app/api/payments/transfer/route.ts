import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import path from "path";
import { uploadBuffer, isCloudinaryConfigured } from "@/lib/cloudinary";

const transferSchema = z.object({
  orderId: z.string().min(1, "Sipariş ID gerekli"),
  transferName: z.string().min(1, "Gönderen adı gerekli"),
  transferDate: z.string().min(1, "Havale tarihi gerekli").regex(/^\d{4}-\d{2}-\d{2}/, "Geçerli bir tarih giriniz (YYYY-AA-GG)"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const receiptImage = formData.get("receiptImage") as File | null;

    const parsed = transferSchema.safeParse({
      orderId: formData.get("orderId") as string,
      transferName: formData.get("transferName") as string,
      transferDate: formData.get("transferDate") as string,
    });

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Geçersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { orderId, transferName, transferDate } = parsed.data;

    // Validate order belongs to user
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: session.user.id },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    if (order.paymentMethod !== "TRANSFER") {
      return NextResponse.json(
        { error: "Bu sipariş havale/EFT ile ödenemez" },
        { status: 400 }
      );
    }

    if (order.payment?.status === "PAID") {
      return NextResponse.json(
        { error: "Bu sipariş zaten ödenmiş" },
        { status: 400 }
      );
    }

    // Save receipt image if provided
    let receiptUrl: string | null = null;
    if (receiptImage && receiptImage.size > 0) {
      const validTypes = [".jpg", ".jpeg", ".png", ".pdf", ".webp"];
      const ext = path.extname(receiptImage.name).toLowerCase();
      if (!validTypes.includes(ext)) {
        return NextResponse.json(
          { error: "Geçersiz dosya türü. JPG, PNG, PDF veya WEBP yükleyin." },
          { status: 400 }
        );
      }

      if (receiptImage.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Dekont 10MB'dan küçük olmalıdır" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await receiptImage.arrayBuffer());
      if (isCloudinaryConfigured()) {
        const result = await uploadBuffer(buffer, "receipts", receiptImage.name);
        receiptUrl = result.secure_url;
      } else {
        const { writeFile, mkdir } = await import("fs/promises");
        const uploadDir = path.join(process.cwd(), "public/uploads/receipts");
        await mkdir(uploadDir, { recursive: true });
        const uniqueName = `receipt-${Date.now()}-${crypto.randomUUID().split("-")[0]}${ext}`;
        const filePath = path.join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);
        receiptUrl = `/uploads/receipts/${uniqueName}`;
      }
    }

    // Update payment record
    await prisma.payment.update({
      where: { orderId },
      data: {
        transferName,
        transferDate: new Date(transferDate),
        receiptImage: receiptUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Havale bildiriminiz alındı. Ödemeniz admin tarafından onaylanacaktır.",
    });
  } catch {
    return NextResponse.json(
      { error: "Havale bildirimi gönderilemedi" },
      { status: 500 }
    );
  }
}
