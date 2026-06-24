/**
 * POST /api/payment/iyzico-callback?orderId=ORDER_ID
 *
 * Handles the 3D Secure callback from the bank.
 * After the user completes OTP verification on the bank page,
 * the bank redirects (POST) to this URL with paymentId.
 *
 * Flow:
 *   1. Extract paymentId from POST body
 *   2. Extract orderId from URL query
 *   3. Call iyzico Auth 3DS to finalize payment
 *   4. Update order paymentStatus → PAID
 *   5. Update Payment record with iyzico paymentId
 *   6. Redirect user to order confirmation page
 *
 * Note: The bank POSTs form-encoded data. We parse it as either
 * JSON or form-encoded to handle both iyzico sandbox and production.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth3DS, IyzicoError } from "@/lib/iyzico";

export async function POST(req: Request) {
  // Extract orderId from URL query
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    console.error("[iyzico-callback] Missing orderId in callback URL");
    return new Response("Missing orderId", { status: 400 });
  }

  let paymentId: string | null = null;

  // Parse body — could be form-encoded (bank) or JSON (test/debug)
  const contentType = req.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const json = await req.json();
      paymentId = json.paymentId || null;
    } else {
      // Form-encoded — extract paymentId from form data
      const text = await req.text();
      const params = new URLSearchParams(text);
      paymentId = params.get("paymentId");
    }
  } catch {
    // If parsing fails, try reading raw text
    try {
      const text = await req.text();
      const params = new URLSearchParams(text);
      paymentId = params.get("paymentId");
    } catch {
      console.error("[iyzico-callback] Failed to parse callback body");
    }
  }

  if (!paymentId) {
    console.error("[iyzico-callback] No paymentId in callback", { orderId });
    return new Response("Missing paymentId", { status: 400 });
  }

  try {
    // Complete the payment via iyzico Auth 3DS
    const authResult = await auth3DS(paymentId, orderId);

    // Update payment record
    await prisma.payment.update({
      where: { orderId },
      data: {
        status: "PAID",
        iyzicoPaymentId: authResult.paymentId || paymentId,
        iyzicoConversationId: orderId,
      },
    });

    // Update order payment status
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID" },
    });

    console.log(`[iyzico-callback] Payment successful for order ${orderId}, paymentId: ${paymentId}`);

    // Redirect user to order page
    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/siparis/${orderId}`
      : `/siparis/${orderId}`;

    // For POST callback from bank, we return HTML that redirects
    return new Response(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ödeme Başarılı</title>
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  <script>window.location.href = "${redirectUrl}";</script>
</head>
<body>
  <p>Ödemeniz başarıyla tamamlandı. Yönlendiriliyorsunuz...</p>
</body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("[iyzico-callback] Auth 3DS failed:", error);

    if (error instanceof IyzicoError) {
      console.error("[iyzico-callback] Iyzico error:", error.message, error.code, error.rawResponse);
    }

    // Log the failed payment to order notes
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          notes: `3DS ödemesi başarısız (paymentId: ${paymentId})`,
        },
      });
    } catch {
      // Non-critical
    }

    // Show error to user (bank displayed page, so we return HTML)
    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/siparis/${orderId}`
      : `/siparis/${orderId}`;

    return new Response(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ödeme Başarısız</title>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 40px;">
  <h1>Ödeme Onaylanamadı</h1>
  <p>Ödeme işlemi sırasında bir hata oluştu. Siparişiniz alındı ancak ödemeniz henüz onaylanmadı.</p>
  <p>Lütfen sipariş detaylarını kontrol edip tekrar deneyin veya bankanızla iletişime geçin.</p>
  <br/>
  <a href="${redirectUrl}" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px;">Sipariş Detayına Git</a>
</body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}
