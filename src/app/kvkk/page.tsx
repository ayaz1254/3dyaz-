"use client";

import { motion } from "motion/react";

const sections = [
  {
    title: "1. Veri Sorumlusu",
    content: "3D Magza (3dmagza.com) olarak, kişisel verilerinizin güvenliğine önem vermekteyiz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, kişisel verilerinizin işlenme amaçları, hukuki sebepleri, aktarılması ve haklarınız hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.",
  },
  {
    title: "2. Hangi Verileriniz İşleniyor?",
    content: "Platformumuz üzerinden sunduğumuz hizmetler kapsamında; ad, soyad, e-posta adresi, telefon numarası, teslimat adresi, IP adresi, tarayıcı bilgileri, ödeme bilgileri (3. parti ödeme kuruluşları aracılığıyla, bizde saklanmaz), sipariş geçmişi ve talep ettiğiniz 3D model dosyaları işlenebilmektedir.",
  },
  {
    title: "3. Verilerinizin İşlenme Amaçları",
    content: "Kişisel verileriniz; siparişlerinizin alınması ve teslimatı, müşteri hizmetleri, ödeme işlemlerinin gerçekleştirilmesi, hizmet kalitesinin artırılması, hukuki yükümlülüklerin yerine getirilmesi, kampanya ve duyuruların iletilmesi (onayınız dahilinde) amaçlarıyla işlenmektedir.",
  },
  {
    title: "4. Verilerinizin Aktarılması",
    content: "Kişisel verileriniz; kargo firmaları, ödeme hizmet sağlayıcıları (Iyzico), barındırma hizmeti aldığımız üçüncü taraflar ve yasal yükümlülükler gereği resmi kurumlarla paylaşılabilmektedir. Verileriniz yurt dışına aktarılmamaktadır.",
  },
  {
    title: "5. Verilerinizin Saklanma Süresi",
    content: "Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve kanuni yükümlülüklerimiz kapsamında (örneğin vergi mevzuatı gereği 10 yıl) saklanmaktadır. Süre sonunda verileriniz güvenli bir şekilde imha edilmektedir.",
  },
  {
    title: "6. Haklarınız (KVKK Madde 11)",
    content: "KVKK kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenme amacını sorgulama, üçüncü kişilere aktarılıp aktarılmadığını bilme, eksik/yanlış verilerin düzeltilmesini talep etme, verilerinizin silinmesini veya yok edilmesini isteme, aktarıldığı üçüncü kişilere bildirilmesini talep etme ve işlenen verilerin münhasıran otomatik sistemlerle analiz edilmesine itiraz etme haklarına sahipsiniz.",
  },
  {
    title: "7. Çerezler (Cookies)",
    content: "Sitemiz, kullanıcı deneyimini iyileştirmek ve hizmet kalitemizi artırmak amacıyla çerezler kullanmaktadır. Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz. Detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz.",
  },
  {
    title: "8. Başvuru ve İletişim",
    content: "Haklarınızı kullanmak veya sorularınızı iletmek için info@3dmagza.com adresine e-posta gönderebilirsiniz. Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.",
  },
];

export default function KvvkPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative flex min-h-[25vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-72 w-72 animate-float rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>
        <div className="relative text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm">
              Yasal
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">KVKK & Gizlilik Politikası</h1>
            <p className="mx-auto max-w-xl text-gray-400">Kişisel verilerinizin korunmasına önem veriyoruz.</p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      <section className="relative px-4 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
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
          <p className="mt-10 text-center text-sm text-gray-500">
            Son güncelleme: Haziran 2026. Sorularınız için{" "}
            <a href="mailto:info@3dmagza.com" className="text-cyan-400 transition hover:text-cyan-300">info@3dmagza.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
