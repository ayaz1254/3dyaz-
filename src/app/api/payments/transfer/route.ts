import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const orderId = formData.get("orderId") as string | null;
    const transferName = formData.get("transferName") as string | null;
    const transferDate = formData.get("transferDate") as string | null;
    const receiptImage = formData.get("receiptImage") as File | null;

    if (!orderId || !transferName || !transferDate) {
      return NextResponse.json(
        { error: "Eksik bilgiler: orderId, transferName, transferDate gerekli" },
        { status: 400 }
      );
    }

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

      const uploadDir = path.join(process.cwd(), "public/uploads/receipts");
      await mkdir(uploadDir, { recursive: true });

      const uniqueName = `receipt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);
      const buffer = Buffer.from(await receiptImage.arrayBuffer());
      await writeFile(filePath, buffer);

      receiptUrl = `/uploads/receipts/${uniqueName}`;
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
