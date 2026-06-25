"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/glass-card";
import { ScrollReveal } from "@/components/scroll-reveal";

const steps = [
  {
    icon: "📸",
    title: "Fotoğrafları Gönder",
    desc: "Önden, yandan ve arkadan çekilmiş 3-5 fotoğrafınızı yükleyin. Net ve iyi aydınlatılmış fotoğraflar en iyi sonucu verir.",
  },
  {
    icon: "🤖",
    title: "AI Model Oluşturma",
    desc: "Yapay zeka teknolojimiz fotoğraflarınızı analiz eder ve 3D modelinizi otomatik olarak oluşturur.",
  },
  {
    icon: "🎨",
    title: "Özelleştir & Onayla",
    desc: "Modelinizi inceleyin, boyut, poz ve renk seçeneklerini belirleyin. Her şey hazır olduğunda onaylayın.",
  },
  {
    icon: "🚚",
    title: "Üretim & Teslimat",
    desc: "Onaylanan modeliniz profesyonel 3D yazıcılarda basılır, özenle paketlenir ve kapınıza gönderilir.",
  },
];

const pricing = [
  { size: "Küçük (10 cm)", price: "599 ₺", time: "5-7 iş günü", popular: false },
  { size: "Orta (15 cm)", price: "999 ₺", time: "7-10 iş günü", popular: true },
  { size: "Büyük (25 cm)", price: "1.899 ₺", time: "10-14 iş günü", popular: false },
];

const features = [
  {
    title: "Yüksek Kalite",
    desc: "Profesyonel SLA ve FDM yazıcılarla yüksek çözünürlüklü baskı.",
    icon: "🏆",
  },
  {
    title: "Hızlı Teslimat",
    desc: "Siparişiniz ortalama 7-10 iş günü içinde kapınızda.",
    icon: "⚡",
  },
  {
    title: "Memnuniyet Garantisi",
    desc: "İşçilik hatası durumunda ücretsiz yeniden baskı.",
    icon: "✅",
  },
  {
    title: "Ücretsiz Danışmanlık",
    desc: "WhatsApp üzerinden ücretsiz tasarım danışmanlığı.",
    icon: "💬",
  },
];

const faq = [
  {
    q: "Hangi fotoğrafları göndermeliyim?",
    a: "Düz bir fon önünde, iyi aydınlatılmış, önden ve yan profilden çekilmiş fotoğraflar en iyi sonucu verir. Gözlük varsa çıkarmanızı öneririz.",
  },
  {
    q: "Fiyatlar neleri kapsıyor?",
    a: "Belirtilen fiyatlar model oluşturma, 3D baskı, zımparalama ve temel boyama işlemlerini kapsar. Özel boya ve kaplama talepleri ek ücrete tabidir.",
  },
  {
    q: "Siparişimi ne zaman alırım?",
    a: "Ortalama teslimat süresi 7-10 iş günüdür. Modelin karmaşıklığına ve seçilen boyuta göre bu süre değişebilir.",
  },
  {
    q: "İade yapabilir miyim?",
    a: "Özel figürler kişiye özel üretildiği için iade kabul edilmemektedir. Ancak işçilik hatası durumunda ücretsiz yeniden baskı yapılır.",
  },
];

export default function OzelFigurPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-float rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/3 h-80 w-80 animate-float rounded-full bg-orange-600/10 blur-[100px]" style={{ animationDelay: "-2s" }} />
          <div className="absolute bottom-1/4 left-1/3 h-72 w-72 animate-float rounded-full bg-rose-500/10 blur-[80px]" style={{ animationDelay: "-4s" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(234,88,12,0.05),transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-glow-pulse" />
              Fotoğraftan 3D Figür
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Fotoğraflarını
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                3D Figüre Dönüştür
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
              Sevdiklerinin fotoğraflarını gönder, yapay zeka ile 3D modele dönüştürelim.
              Özel günler için benzersiz, kişiselleştirilmiş hediyeler.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/905555555555?text=Merhaba%2C%20%C3%B6zel%20fig%C3%BCr%20sipari%C5%9Fi%20vermek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/40"
              >
                <span className="relative z-10">WhatsApp'tan Sipariş Ver</span>
                <svg className="relative z-10 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.102-1.03-1.847-2.263-2.062-2.645-.215-.382-.022-.59.16-.779.163-.169.362-.442.543-.663.181-.222.241-.374.362-.623.121-.249.06-.468-.03-.65-.092-.182-.667-1.607-.914-2.2-.24-.577-.485-.478-.668-.48-.172-.002-.37-.003-.568-.003s-.519.074-.79.372c-.272.297-1.036 1.009-1.036 2.46 0 1.452 1.057 2.854 1.204 3.052.148.197 2.08 3.176 5.04 4.454.704.303 1.254.485 1.683.623.709.227 1.354.195 1.864.118.57-.086 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-green-400 to-emerald-500 transition group-hover:translate-x-0" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10"
              >
                Nasıl Çalışır?
              </a>
            </div>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative border-t border-white/5 px-4 py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-white">Nasıl Çalışır?</h2>
              <p className="mt-2 text-gray-400">4 adımda kendi 3D figürüne sahip ol</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative text-center"
                >
                  {i < 3 && (
                    <div className="pointer-events-none absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-amber-500/40 to-transparent md:block" />
                  )}
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-2xl">
                    {step.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Pricing ── */}
      <section className="relative border-t border-white/5 px-4 py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-white">Fiyatlandırma</h2>
              <p className="mt-2 text-gray-400">İhtiyacına uygun boyutu seç</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pricing.map((p, i) => (
                <motion.div
                  key={p.size}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <GlassCard
                    glowColor={p.popular ? "rgba(251, 191, 36, 0.15)" : "rgba(255,255,255,0.05)"}
                    className={p.popular ? "relative" : ""}
                  >
                    {p.popular && (
                      <div className="absolute -right-3 -top-3 z-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                        Popüler
                      </div>
                    )}
                    <div className="p-6 text-center">
                      <p className="mb-2 text-sm text-gray-400">{p.size}</p>
                      <p className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                        {p.price}
                      </p>
                      <p className="mb-6 text-sm text-gray-500">Teslimat: {p.time}</p>
                      <a
                        href={`https://wa.me/905555555555?text=Merhaba,%20${encodeURIComponent(p.size)}%20boyutunda%20%C3%B6zel%20fig%C3%BCr%20sipari%C5%9Fi%20vermek%20istiyorum.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-full rounded-full py-2.5 text-sm font-medium transition ${
                          p.popular
                            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40"
                            : "border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/40"
                        }`}
                      >
                        Sipariş Ver
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Features ── */}
      <section className="relative border-t border-white/5 px-4 py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <h2 className="text-3xl font-bold text-white">Neden Bizi Seçmelisiniz?</h2>
              <p className="mt-2 text-gray-400">Kaliteli hizmet, müşteri memnuniyeti</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <GlassCard glowColor="rgba(251, 191, 36, 0.06)">
                    <div className="flex flex-col items-center px-4 py-8 text-center">
                      <span className="mb-4 text-4xl">{f.icon}</span>
                      <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                      <p className="text-sm text-gray-400">{f.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FAQ ── */}
      <section className="relative border-t border-white/5 px-4 py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-white">Sıkça Sorulan Sorular</h2>
              <p className="mt-2 text-gray-400">Özel figür hakkında merak ettikleriniz</p>
            </div>
            <div className="space-y-3">
              {faq.map((item) => (
                <details
                  key={item.q}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition hover:border-white/20"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-medium text-white transition hover:bg-white/[0.02]">
                    {item.q}
                    <svg className="h-4 w-4 shrink-0 text-amber-400 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-white/5 px-6 py-4">
                    <p className="text-sm leading-relaxed text-gray-400">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative px-4 py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl">
            <GlassCard glowColor="rgba(251, 191, 36, 0.15)">
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <div className="mb-6 inline-flex rounded-full bg-gradient-to-r from-amber-500/20 to-orange-600/20 p-3">
                  <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Haydi Başlayalım
                </h2>
                <p className="mb-8 max-w-lg text-gray-400">
                  Fotoğraflarını gönder, sana özel 3D figürünü üretelim.
                  WhatsApp üzerinden hemen sipariş verebilirsin.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://wa.me/905555555555?text=Merhaba%2C%20%C3%B6zel%20fig%C3%BCr%20sipari%C5%9Fi%20vermek%20istiyorum."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-3.5 font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/40"
                  >
                    <span className="relative z-10">WhatsApp'tan Yaz</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-green-400 to-emerald-500 transition group-hover:translate-x-0" />
                  </a>
                  <Link
                    href="/urunler"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:border-white/40"
                  >
                    Hazır Ürünlere Göz At
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
