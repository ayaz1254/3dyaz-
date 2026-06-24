import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

function getResend(): Resend | null {
  if (!resendApiKey) return null;
  return new Resend(resendApiKey);
}

type OrderStatus = "PENDING" | "APPROVED" | "PRINTING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Bekliyor",
  APPROVED: "Onaylandı",
  PRINTING: "Basılıyor",
  SHIPPED: "Kargoda",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
};

function orderStatusEmailHtml(params: {
  customerName: string;
  orderNumber: string;
  oldStatus: string;
  newStatus: string;
  cargoCompany?: string | null;
  cargoTrackingNo?: string | null;
  totalAmount: number;
}): string {
  const statusLabel = statusLabels[params.newStatus as OrderStatus] || params.newStatus;
  const fromLabel = statusLabels[params.oldStatus as OrderStatus] || params.oldStatus;

  let cargoInfo = "";
  if (params.newStatus === "SHIPPED" && (params.cargoCompany || params.cargoTrackingNo)) {
    cargoInfo = `
      <tr>
        <td style="padding: 12px 0;">
          <strong>Kargo Bilgisi:</strong><br/>
          ${params.cargoCompany ? `Firma: ${params.cargoCompany}<br/>` : ""}
          ${params.cargoTrackingNo ? `Takip No: ${params.cargoTrackingNo}` : ""}
        </td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
      <div style="max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1);">
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">3D Magza</h1>
          <p style="color: rgba(255,255,255,.8); margin: 8px 0 0; font-size: 14px;">Sipariş Durumu Güncellendi</p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 16px; margin: 0 0 16px;">Merhaba ${params.customerName},</p>
          <p style="font-size: 14px; color: #52525b; margin: 0 0 20px;">
            <strong>${params.orderNumber}</strong> numaralı siparişinizin durumu
            <strong>${fromLabel}</strong> iken <strong>${statusLabel}</strong> olarak güncellendi.
          </p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-top: 1px solid #e4e4e7;">
                <strong>Sipariş No</strong><br/>
                <span style="color: #52525b; font-size: 14px;">${params.orderNumber}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-top: 1px solid #e4e4e7;">
                <strong>Yeni Durum</strong><br/>
                <span style="color: #52525b; font-size: 14px;">${statusLabel}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-top: 1px solid #e4e4e7;">
                <strong>Önceki Durum</strong><br/>
                <span style="color: #52525b; font-size: 14px;">${fromLabel}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-top: 1px solid #e4e4e7;">
                <strong>Toplam Tutar</strong><br/>
                <span style="color: #52525b; font-size: 14px;">${params.totalAmount.toFixed(2)} ₺</span>
              </td>
            </tr>
            ${cargoInfo}
          </table>

          <p style="font-size: 14px; color: #52525b; margin: 24px 0 0;">
            Sipariş detaylarını görüntülemek için hesabınıza giriş yapabilirsiniz.
          </p>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://3dmagza.vercel.app"}/dashboard/siparisler/${params.orderNumber}"
               style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">
              Siparişi Görüntüle
            </a>
          </div>
        </div>

        <div style="padding: 24px; text-align: center; border-top: 1px solid #e4e4e7; font-size: 12px; color: #a1a1aa;">
          <p style="margin: 0;">3D Magza — 3D baskı teknolojisiyle üretilmiş özel tasarım ürünler</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function lowStockEmailHtml(params: { products: { name: string; stock: number }[] }): string {
  const rows = params.products
    .map((p) => `<tr><td style="padding: 8px 12px; border-bottom: 1px solid #e4e4e7;">${p.name}</td><td style="padding: 8px 12px; border-bottom: 1px solid #e4e4e7; color: #dc2626; font-weight: 600;">${p.stock} adet</td></tr>`)
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
      <div style="max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1);">
        <div style="background: #dc2626; padding: 32px 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">3D Magza</h1>
          <p style="color: rgba(255,255,255,.8); margin: 8px 0 0; font-size: 14px;">Stok Uyarısı</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; margin: 0 0 16px;">Merhaba,</p>
          <p style="font-size: 14px; color: #52525b; margin: 0 0 20px;">
            Aşağıdaki ürünlerin stoğu kritik seviyenin altına düştü:
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background: #f4f4f5;">
                <th style="padding: 8px 12px; text-align: left;">Ürün</th>
                <th style="padding: 8px 12px; text-align: left;">Kalan Stok</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="font-size: 14px; color: #52525b; margin: 24px 0 0;">
            Yeni stok siparişi vermeyi unutmayın.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendLowStockAlert(products: { name: string; stock: number }[]) {
  const resend = getResend();
  if (!resend || !process.env.ADMIN_EMAIL) {
    console.log("[Email] RESEND_API_KEY or ADMIN_EMAIL not configured — skipping low stock alert");
    return;
  }

  const from = process.env.EMAIL_FROM || "noreply@3dmagza.com";

  try {
    await resend.emails.send({
      from: `3D Magza <${from}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Stok Uyarısı — ${products.length} ürün kritik seviyede`,
      html: lowStockEmailHtml({ products }),
    });
    console.log(`[Email] Low stock alert sent to admin for ${products.length} products`);
  } catch (error) {
    console.error("[Email] Failed to send low stock alert:", error);
  }
}

export async function sendOrderStatusNotification(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  oldStatus: string;
  newStatus: string;
  cargoCompany?: string | null;
  cargoTrackingNo?: string | null;
  totalAmount: number;
}) {
  const resend = getResend();
  if (!resend) {
    console.log("[Email] RESEND_API_KEY not configured — skipping email notification");
    return;
  }

  const from = process.env.EMAIL_FROM || "noreply@3dmagza.com";

  try {
    await resend.emails.send({
      from: `3D Magza <${from}>`,
      to: params.to,
      subject: `Sipariş Durumu Güncellendi — ${params.orderNumber}`,
      html: orderStatusEmailHtml(params),
    });
    console.log(`[Email] Notification sent to ${params.to} for order ${params.orderNumber}`);
  } catch (error) {
    console.error("[Email] Failed to send notification:", error);
  }
}
