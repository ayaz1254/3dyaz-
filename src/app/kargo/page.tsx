"use client";

import { motion } from "motion/react";

const sections = [
  {
    title: "Teslimat Süresi",
    content: "Siparişleriniz, ödeme onayından sonra 1-3 iş günü içinde hazırlanarak kargoya teslim edilir. Özel figür ve kişiselleştirilmiş ürünlerde hazırlık süresi 7-10 iş günüdür. Tahmini teslimat süresi, ürün detay sayfasında belirtilmektedir.",
  },
  {
    title: "Kargo Ücreti",
    content: "250 ₺ ve üzeri tüm siparişlerde kargo ücretsizdir. 250 ₺ altındaki siparişlerde kargo ücreti 49.90 ₺'dir. Kampanyalı dönemlerde kargo ücreti değişiklik gösterebilir.",
  },
  {
    title: "Kargo Firması",
    content: "Siparişleriniz Yurtiçi Kargo veya Aras Kargo ile gönderilmektedir. Kargo takip numaranız, siparişiniz kargoya verildiğinde e-posta ve SMS ile tarafınıza iletilir.",
  },
  {
    title: "Teslimat Adresi Değişikliği",
    content: "Siparişiniz kargoya verilmeden önce teslimat adresinizi değiştirebilirsiniz. Adres değişikliği için siparişiniz onaylandıktan sonra en geç 2 saat içinde bizimle iletişime geçmelisiniz.",
  },
  {
    title: "Kargo Takibi",
    content: "Siparişiniz kargoya verildikten sonra, Hesabım > Siparişlerim bölümünden kargonuzu takip edebilirsiniz. Kargo firması kaynaklı gecikmelerde tarafımıza bilgi verdiğinizde firmayla iletişime geçerek süreci takip ederiz.",
  },
  {
    title: "Teslimat Anında Dikkat Edilmesi Gerekenler",
    content: "Kargonuzu teslim alırken paketi mutlaka kontrol edin. Hasarlı bir paket görüyorsanız, kargo görevlisine tutanak tutturun ve tarafımıza bilgi verin. Teslimat sırasında fark edilmeyen hasarlardan maalesef sorumluluk kabul edememekteyiz.",
  },
];

export default function KargoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-[25vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-72 w-72 animate-float rounded-full bg-teal-500/10 blur-[100px]" />
        </div>
        <div className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-teal-500/20 bg-teal-500/10 px-4 py-1.5 text-xs font-medium text-teal-300 backdrop-blur-sm">
              Teslimat
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Kargo & Teslimat</h1>
            <p className="mx-auto max-w-xl text-gray-400">Siparişleriniz özenle hazırlanır ve hızlıca kargoya verilir.</p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      <section className="relative px-4 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm"
              >
                <h2 className="mb-3 text-lg font-bold text-white">{s.title}</h2>
                <p className="leading-relaxed text-gray-400">{s.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
