"use client";

import { motion } from "motion/react";
import Link from "next/link";

const sections = [
  {
    title: "İade Koşulları",
    content: "3D Magza olarak, kişiye özel üretim yaptığımız için 6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 'Cayma Hakkı' istisnaları kapsamına girmekteyiz. Kişiye özel üretilen 3D baskı ürünlerinde (özel figür, kişiselleştirilmiş tasarımlar) cayma hakkı bulunmamaktadır.",
  },
  {
    title: "İşçilik Hatası Durumunda",
    content: "Ürününüzde işçilik kaynaklı bir hata oluşması durumunda (baskı hatası, yanlış renk, ölçü hatası) ücretsiz olarak yeniden üretim yapılır. Hatalı ürünü teslim aldıktan sonra 7 gün içinde info@3dmagza.com adresine fotoğraflarıyla birlikte bildirmeniz gerekmektedir.",
  },
  {
    title: "Stand/Katalog Ürünlerde İade",
    content: "Koleksiyonumuzdaki standart ürünler, teslim alındıktan sonra 14 gün içinde, kullanılmamış ve orijinal ambalajında olmak kaydıyla iade edilebilir. İade kargo ücreti alıcıya aittir. İade onayı için öncelikle bizimle iletişime geçmelisiniz.",
  },
  {
    title: "İade Süreci",
    content: "İade talebiniz onaylandıktan sonra, ürünü güvenli bir şekilde tarafımıza göndermeniz gerekmektedir. Ürün tarafımıza ulaştıktan sonra incelenir ve onaylanması halinde ödeme iadeniz 3-5 iş günü içerisinde yapılır.",
  },
  {
    title: "Hasarlı Teslimat",
    content: "Kargonuz hasarlı teslim edilirse, teslimat anında kargo görevlisine tutanak tutturun ve en kısa sürede bizimle iletişime geçin. Hasarlı ürünler ücretsiz olarak yeniden gönderilir.",
  },
];

export default function IadePage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-[25vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-72 w-72 animate-float rounded-full bg-amber-500/10 blur-[100px]" />
        </div>
        <div className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300 backdrop-blur-sm">
              Politikalar
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">İade & Değişim Politikası</h1>
            <p className="mx-auto max-w-xl text-gray-400">Müşteri memnuniyetini önemsiyor, şeffaf bir iade süreci sunuyoruz.</p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      <section className="relative px-4 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
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
          <div className="mt-10 text-center">
            <p className="mb-4 text-gray-400">İade veya değişim talepleriniz için bize ulaşın.</p>
            <Link href="/iletisim" className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40">
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
