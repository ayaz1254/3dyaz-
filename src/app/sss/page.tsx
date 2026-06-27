"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { GlassCard } from "@/components/glass-card";
import { ScrollReveal } from "@/components/scroll-reveal";

interface FAQItem {
  q: string;
  a: string;
}

const categories: { title: string; items: FAQItem[] }[] = [
  {
    title: "Sipariş & Teslimat",
    items: [
      {
        q: "Sipariş nasıl verilir?",
        a: "Ürün sayfasından istediğiniz ürünü sepete ekleyin, ardından ödeme adımlarını takip ederek siparişinizi tamamlayın. Üyelik oluşturmanıza gerek yoktur, misafir olarak da sipariş verebilirsiniz.",
      },
      {
        q: "Teslimat süresi ne kadar?",
        a: "Standart siparişlerde üretim + kargo toplam 3-7 iş günü içerisinde ürününüz kapınızda. Saat 15:00'e kadar verilen siparişler aynı gün üretime alınır.",
      },
      {
        q: "Kargo takibi nasıl yapılır?",
        a: "Siparişiniz kargoya verildiğinde e-posta ve SMS ile gönderi takip numaranızı iletiyoruz. Ayrıca hesabınızdan sipariş durumunu anlık takip edebilirsiniz.",
      },
      {
        q: "İade ve değişim koşullarınız nedir?",
        a: "Teslimat tarihinden itibaren 14 gün içinde, kullanılmamış ve hasarsız ürünler için iade yapabilirsiniz. Kişiye özel üretilen ürünlerde (özel figür vb.) iade kabul edilmemektedir.",
      },
    ],
  },
  {
    title: "Ödeme",
    items: [
      {
        q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        a: "Kredi kartı (Visa, Mastercard), banka kartı, Havale/EFT ve kapıda ödeme seçeneklerimiz mevcuttur. Tüm ödemeler 256-bit SSL ile korunmaktadır.",
      },
      {
        q: "Havale/EFT ile ödeme nasıl yapılır?",
        a: "Ödeme adımında Havale/EFT seçeneğini seçin. Sipariş onay e-postasında IBAN bilgilerimizi göreceksiniz. Havale onaylandıktan sonra siparişiniz üretime alınır.",
      },
      {
        q: "Taksit seçeneği var mı?",
        a: "Kredi kartına 3D Secure ile 6 taksite kadar seçenek bulunmaktadır. Taksit sayısı kartınıza ve bankanıza göre değişiklik gösterebilir.",
      },
      {
        q: "Fatura nasıl alabilirim?",
        a: "Sipariş sırasında fatura bilgilerinizi girerseniz e-fatura e-posta adresinize gönderilir. Kurumsal müşterilerimiz için e-arşiv fatura düzenlenmektedir.",
      },
    ],
  },
  {
    title: "3D Baskı",
    items: [
      {
        q: "Hangi malzemelerle baskı yapıyorsunuz?",
        a: "PLA, PETG, ABS, TPU (esnek) ve reçine (SLA) malzemeleriyle baskı yapıyoruz. Her malzemenin farklı dayanıklılık ve görünüm özellikleri vardır.",
      },
      {
        q: "Hangi dosya formatlarını kabul ediyorsunuz?",
        a: "STL, OBJ, 3MF, STEP ve IGES formatlarını kabul ediyoruz. Modelinizi yüklemeden önce manifold (su geçirmez) olduğundan emin olun.",
      },
      {
        q: "Renk seçenekleri nelerdir?",
        a: "10+ farklı renk seçeneğimiz mevcuttur: Siyah, Beyaz, Gri, Kırmızı, Mavi, Yeşil, Sarı, Turuncu, Mor ve şeffaf. Özel renk talepleri için WhatsApp üzerinden iletişime geçebilirsiniz.",
      },
      {
        q: "Maksimum baskı boyutu nedir?",
        a: "Standart baskı boyutumuz 25x25x30 cm'dir. Daha büyük modeller parçalara bölünerek basılabilir ve birleştirilebilir. Büyük boyutlu projeler için lütfen bizimle iletişime geçin.",
      },
    ],
  },
  {
    title: "Dosya Yükleme & Özel İmalat",
    items: [
      {
        q: "STL dosyamı nasıl yüklerim?",
        a: "STL Yükle sayfamızdan dosyanızı sürükleyip bırakarak veya seçerek yükleyebilirsiniz. Dosya boyutu 100MB'a kadar desteklenmektedir.",
      },
      {
        q: "Hangi dosya boyutlarına kadar yükleme yapabilirim?",
        a: "Maksimum 100MB dosya boyutuna kadar yükleme yapabilirsiniz. Daha büyük dosyalar için lütfen WhatsApp üzerinden iletişime geçin.",
      },
      {
        q: "Özel figür siparişi nasıl veririm?",
        a: "Özel Figür sayfamızdan fotoğraflarınızı yükleyin, tercihlerinizi belirtin. Ekibimiz 24 saat içinde size özel fiyat teklifi ile dönecektir.",
      },
      {
        q: "Toplu sipariş verebilir miyim?",
        a: "Evet, kurumsal ve toplu siparişler için WhatsApp üzerinden bizimle iletişime geçebilir, özel fiyat teklifi alabilirsiniz. 50+ adet siparişlerde %15'e varan indirim uygulanmaktadır.",
      },
    ],
  },
];

export default function SSSCPage() {
  const [openIndex, setOpenIndex] = useState<Record<string, number | null>>({});

  const toggle = (catIdx: number, itemIdx: number) => {
    const key = `cat-${catIdx}`;
    setOpenIndex((prev) => ({
      ...prev,
      [key]: prev[key] === itemIdx ? null : itemIdx,
    }));
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/4 h-72 w-72 animate-float rounded-full bg-cyan-500/10 blur-[100px]" />
          <div className="absolute right-1/4 top-1/2 h-96 w-96 animate-float rounded-full bg-blue-600/10 blur-[120px]" style={{ animationDelay: "-3s" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Sıkça Sorulan Sorular
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Merak Ettikleriniz
            </h1>
            <p className="mx-auto max-w-xl text-lg text-gray-400">
              3D baskı, sipariş süreci ve daha fazlası hakkında en çok sorulan soruların yanıtları.
            </p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </section>

      {/* FAQ Content */}
      <section className="relative px-4 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-10">
            {categories.map((cat, catIdx) => (
              <ScrollReveal key={cat.title} delay={catIdx * 0.1}>
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white">
                    <span className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {cat.title}
                    </span>
                  </h2>
                  <div className="space-y-2">
                    {cat.items.map((item, itemIdx) => {
                      const isOpen = openIndex[`cat-${catIdx}`] === itemIdx;
                      return (
                        <div
                          key={item.q}
                          className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition hover:border-white/20"
                        >
                          <button
                            onClick={() => toggle(catIdx, itemIdx)}
                            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition hover:bg-white/[0.02]"
                          >
                            <span className="font-medium text-white">
                              {item.q}
                            </span>
                            <motion.svg
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="h-4 w-4 shrink-0 text-cyan-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                              >
                                <div className="border-t border-white/5 px-6 py-4">
                                  <p className="leading-relaxed text-gray-400">
                                    {item.a}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <ScrollReveal delay={0.3}>
            <GlassCard glowColor="rgba(56, 189, 248, 0.1)" className="mt-12">
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <h3 className="mb-2 text-xl font-bold text-white">
                  Aradığınızı Bulamadınız mı?
                </h3>
                <p className="mb-6 max-w-md text-gray-400">
                  Sorunuz burada yoksa WhatsApp üzerinden bize ulaşın, size yardımcı olalım.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://wa.me/905555555555?text=Merhaba%2C%20bir%20sorum%20var."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-medium text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/40"
                  >
                    <span className="relative z-10">WhatsApp'tan Yaz</span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-green-400 to-emerald-500 transition group-hover:translate-x-0" />
                  </a>
                  <Link
                    href="/magaza"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur-sm transition hover:border-white/40"
                  >
                    Ürünlere Göz At
                  </Link>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
