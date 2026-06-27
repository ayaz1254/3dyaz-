"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string[];
  material: string | null;
  colors: string | null;
  category: { name: string; slug: string } | null;
  createdAt: string;
}

interface HomeClientProps {
  products: ProductData[];
  featuredProducts: ProductData[];
}

export function HomeClient({ products, featuredProducts }: HomeClientProps) {
  return (
    <div className="relative bg-black">
      {/* ─── HERO — studio.tripo3d.ai birebir kopya ─── */}
      <section className="relative z-1 min-h-screen w-full overflow-hidden">
        {/* Background layer */}
        <div className="pointer-events-none absolute inset-0 -z-1">
          <div className="size-full bg-gradient-to-b from-[#1a1a1a] to-black" />
        </div>

        {/* Content */}
        <div className="relative z-1 flex flex-col items-center overflow-hidden pt-28 md:pt-36">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3 pb-0 pt-9 text-center max-md:pt-6"
          >
            <h1 className="text-[40px] font-bold leading-[44px] text-[#f2f2f2] max-md:text-[32px] max-md:leading-9">
              Her Şeyi 3D Olarak Üretin
            </h1>
            <p className="text-lg text-white/60 max-md:text-sm">
              Hepsi Bir Arada Yapay Zeka 3D Çalışma Alanınız
            </p>
          </motion.div>

          {/* ─── İKİ KART — studio.tripo3d.ai birebir ─── */}
          <div className="relative mx-auto mt-10 flex max-w-[1200px] items-start justify-center gap-20 px-8 pb-8 max-md:mt-6 max-md:flex-col max-md:items-center max-md:gap-6 max-md:px-4">
            {/* ── KART 1: Yüksek Detaylı Model ── */}
            <Link
              href="/yukle"
              className="group relative h-[326px] w-[547px] shrink-0 cursor-pointer rounded-[20px] max-md:h-[180px] max-md:w-[351px] max-md:overflow-hidden"
            >
              {/* Karakter arkası glow — hover'da büyür */}
              <div className="pointer-events-none absolute -left-10 bottom-0 h-[400px] w-[350px] opacity-30 transition-all duration-700 group-hover:opacity-50 group-hover:scale-110 max-md:hidden">
                <div className="h-full w-full rounded-full bg-[#1235AE] blur-[120px]" />
              </div>

              {/* Karakter katmanı — alttan taşar */}
              <div className="pointer-events-none absolute bottom-0 -left-7 h-[349px] w-[280px] select-none max-md:!-left-1 max-md:!h-[180px] max-md:!w-auto max-md:!bottom-0">
                <img
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-100 transition-opacity duration-500 group-hover:opacity-0 max-md:opacity-100"
                  src="/images/hero5.png"
                  alt=""
                />
                <img
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:hidden"
                  src="/images/hero6.png"
                  alt=""
                />
              </div>

              {/* Text — icon + başlık + açıklama */}
              <div className="absolute left-[259px] top-[70px] flex flex-col items-start max-md:left-[43%] max-md:top-8 max-md:w-[50%]">
                {/* Diamond icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="mb-3 h-10 w-10 text-white/60 max-md:h-5 max-md:w-5"
                  fill="currentColor"
                >
                  <path
                    d="m7.103 10.752 10.066-.046L12.328 23zm1.153-4.456 7.669.069 1.357 2.993-9.953-.069zM6.062 9.198 0 6.638l3.257-2.444 3.891 2.033zM0 8.124l5.746 2.582L11.92 22.91zm18.616 2.56L24 7.872 12.667 22.84zm-.113-1.509-1.515-3.153 3.46-1.943 2.986 2.537zM8.143 4.788l-1.312-.343-2.465-1.394L7.26 2h9.455l2.873 1.211-2.76 1.348-.927.229z"
                    opacity=".6"
                  />
                </svg>
                <div className="flex flex-col gap-3 max-md:gap-2">
                  <h2 className="whitespace-nowrap text-2xl font-bold leading-7 text-[#fafafa] max-md:whitespace-normal max-md:text-sm max-md:leading-5">
                    Yüksek Detaylı Model
                  </h2>
                  <p className="w-[253px] text-base leading-[22px] text-white/60 max-md:w-auto max-md:text-xs max-md:leading-4">
                    3D Baskı ve Görsel Sanatlar için 2 Milyon Poligona Kadar
                  </p>
                </div>
              </div>

              {/* Button — sağ alt */}
              <div className="absolute bottom-0 right-0 h-14 w-[276px] max-md:h-10 max-md:w-auto">
                <span className="inline-flex h-full w-full items-center justify-center gap-3 rounded-[100px] bg-[#1235AE] px-5 text-[17px] font-medium text-white shadow-[0_4px_24px_-2px_#7AA2FF] transition-all duration-300 hover:bg-[#1a44cf] hover:shadow-[0_4px_32px_-2px_#7AA2FFb3] max-md:px-3 max-md:text-sm">
                  HD Model Üret
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                    <path d="m12.847 5.901 3.733 3.733a.93.93 0 010 1.32.93.93 0 01-1.32 0l-2.14-2.14v8.48a.933.933 0 11-1.867 0v-8.48l-2.14 2.14a.932.932 0 11-1.32-1.32L11.526 5.9a.934.934 0 011.321 0" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* ── KART 2: Akıllı Topoloji Ağı ── */}
            <Link
              href="/ozel-figur"
              className="group relative h-[326px] w-[547px] shrink-0 cursor-pointer rounded-[20px] max-md:h-[180px] max-md:w-[351px] max-md:overflow-hidden"
            >
              {/* Karakter arkası glow — hover'da büyür */}
              <div className="pointer-events-none absolute left-[180px] bottom-0 h-[400px] w-[400px] opacity-30 transition-all duration-700 group-hover:opacity-50 group-hover:scale-110 max-md:hidden">
                <div className="h-full w-full rounded-full bg-[#5f2209] blur-[120px]" />
              </div>

              {/* Karakter katmanı — alttan taşar */}
              <div className="pointer-events-none absolute bottom-0 left-[280px] h-[349px] w-[328px] select-none max-md:!left-auto max-md:!right-1 max-md:!h-[180px] max-md:!w-auto max-md:!bottom-0">
                <img
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-100 transition-opacity duration-500 group-hover:opacity-0 max-md:opacity-100"
                  src="/images/wolf6.png"
                  alt=""
                />
                <img
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:hidden"
                  src="/images/wolf5.png"
                  alt=""
                />
              </div>

              {/* Text — icon + başlık + açıklama */}
              <div className="absolute left-8 top-[70px] flex flex-col items-start max-md:left-7 max-md:top-8 max-md:w-[60%]">
                {/* Grid icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="mb-3 h-10 w-10 text-white/60 max-md:h-5 max-md:w-5"
                  fill="currentColor"
                >
                  <path
                    d="M20.534.415a1.466 1.466 0 01.308 2.898l-1.087 7.125a1.466 1.466 0 01-.173 2.86l1.179 7.075a1.465 1.465 0 11-1.59 1.982l-6.145-1.596a1.466 1.466 0 01-2.655-.168l-6.05 1.135a1.466 1.466 0 11-1.667-1.93l.955-6.57a1.465 1.465 0 01.063-2.775L2.645 3.902A1.466 1.466 0 114.366 2.13l5.997.999a1.466 1.466 0 012.689-.135l6.033-1.327a1.465 1.465 0 011.45-1.252M13.44 16.148l-.896 2.689c.318.21.55.54.629.926l5.647 1.468-5.363-5.09zm-8.079-3.533c-.17.279-.43.495-.74.61l-.978 6.721c.303.166.54.437.666.763l6.046-1.133c.182-.52.647-.906 1.211-.971l.819-2.455a1.47 1.47 0 01-.899-1.02zm8.908 2.715q-.03.073-.066.142l5.454 5.175q.06-.044.122-.082l-1.25-7.51-.038-.027zm-.479-5.242q-.135.103-.292.173v3.179c.338.148.609.42.756.76l3.682-2.008-.02-.103zm-7.6 1.788 5.422 2.225a1.47 1.47 0 01.886-.725v-3.052a1.5 1.5 0 01-.543-.295zM4.248 3.124a1.47 1.47 0 01-.615.634l1.058 6.746c.28.12.515.327.672.585l6.098-1.951a1.47 1.47 0 01.737-1.503l-.73-2.555a1.47 1.47 0 01-1.109-.938zm10.116 5.63q.01.082.011.165 0 .167-.037.324l3.778 1.833c.148-.236.36-.427.613-.548l1.105-7.242zm-1.207-4.76a1.47 1.47 0 01-.697.92l.733 2.566c.261.052.496.173.688.342l5.114-5.112z"
                    opacity=".8"
                  />
                </svg>
                <div className="flex flex-col gap-3 max-md:gap-2">
                  <h2 className="whitespace-nowrap text-2xl font-bold leading-7 text-[#fafafa] max-md:whitespace-normal max-md:text-sm max-md:leading-5">
                    Akıllı Topoloji Ağı
                  </h2>
                  <p className="w-[253px] text-base leading-[22px] text-white/60 max-md:w-auto max-md:text-xs max-md:leading-4">
                    ~2s | Oyunlar ve Web Uygulamaları İçin Temiz Topoloji
                  </p>
                </div>
              </div>

              {/* Button — sol alt */}
              <div className="absolute bottom-0 left-0 h-14 w-[276px] max-md:h-10 max-md:w-auto">
                <span className="inline-flex h-full w-full items-center justify-center gap-3 rounded-[100px] bg-[#5f2209] px-5 text-[17px] font-medium text-white shadow-[0_4px_24px_-2px_#FF8F4E] transition-all duration-300 hover:bg-[#7a2e0c] hover:shadow-[0_4px_32px_-2px_#FF8F4Eb3] max-md:px-3 max-md:text-sm">
                  Akıllı Ağ Üret
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                    <path d="m12.847 5.901 3.733 3.733a.93.93 0 010 1.32.93.93 0 01-1.32 0l-2.14-2.14v8.48a.933.933 0 11-1.867 0v-8.48l-2.14 2.14a.932.932 0 11-1.32-1.32L11.526 5.9a.934.934 0 011.321 0" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HİZMETLERİMİZ — figuratolyem-style service cards ─── */}
      <section id="hizmetler" className="bg-[#181a1b] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Hizmetlerimiz
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/50">
            3D baskı teknolojisiyle hayal gücünüzü gerçeğe dönüştürüyoruz.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "3D Baskı Hizmeti",
                desc: "Profesyonel 3D yazıcılarımızla modellerinizi en kaliteli malzemelerle üretiyoruz.",
                icon: (
                  <svg className="h-8 w-8 text-[#05cc47]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h3a2.25 2.25 0 0 0 2.25-2.25V7.5a2.25 2.25 0 0 1 2.25-2.25h3" />
                  </svg>
                ),
                href: "/yukle",
              },
              {
                title: "Özel Figür",
                desc: "Fotoğraflarınızdan 3D heykelcikler üretiyoruz. Doğum günü, evlilik ve anılarınız için.",
                icon: (
                  <svg className="h-8 w-8 text-[#05cc47]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                ),
                href: "/ozel-figur",
              },
              {
                title: "STL Yükle & Bas",
                desc: "Kendi 3D modelini yükle, malzemeyi seç ve üretelim. Türkiye'nin her yerine kargo.",
                icon: (
                  <svg className="h-8 w-8 text-[#05cc47]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
                href: "/yukle",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group rounded-2xl border border-white/[0.06] bg-[#0f1112] p-8 text-left transition hover:border-[#05cc47]/20 hover:bg-[#0f1112]/80"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#05cc47]/10">
                  {service.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{service.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SÜREÇ — 3D baskı adımları ─── */}
      <section id="surec" className="border-t border-white/[0.04] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Nasıl Çalışır?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/50">
              3D baskı sürecimiz 4 basit adımda tamamlanıyor.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Model Seç / Yükle",
                desc: "3D model koleksiyonumuzdan seçin veya kendi STL dosyanızı yükleyin.",
                icon: (
                  <svg className="h-7 w-7 text-[#05cc47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Malzeme Seç",
                desc: "PLA, Reçine veya özel malzemeler arasından seçim yapın.",
                icon: (
                  <svg className="h-7 w-7 text-[#05cc47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 0 2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128m0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Üretim",
                desc: "Endüstriyel 3D yazıcılarımızla hassas üretim yapıyoruz.",
                icon: (
                  <svg className="h-7 w-7 text-[#05cc47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                ),
              },
              {
                step: "4",
                title: "Kapına Teslim",
                desc: "Özenle paketliyoruz ve Türkiye'nin her yerine gönderiyoruz.",
                icon: (
                  <svg className="h-7 w-7 text-[#05cc47]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                {/* Step number background */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 text-[120px] font-bold leading-none text-white/[0.03] select-none">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#05cc47]/10">
                    {item.icon}
                  </div>
                  <h3 className="mb-2.5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mx-auto max-w-[220px] text-sm leading-relaxed text-white/50">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÖNE ÇIKAN ÜRÜNLER — figuratolyem-style product grid ─── */}
      {featuredProducts.length > 0 && (
        <section className="border-t border-white/[0.04] px-4 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Öne Çıkanlar
                </h2>
                <p className="mt-2 text-base text-white/50">
                  En popüler 3D baskı ürünlerimizi keşfedin
                </p>
              </div>
              <Link
                href="/magaza"
                className="hidden items-center gap-1.5 text-sm text-white/70 transition hover:text-white sm:flex"
              >
                Tümünü Gör
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/magaza/${product.slug}`}
                  className="group rounded-2xl border border-white/[0.06] bg-[#0f1112] p-3 transition hover:border-[#05cc47]/20"
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-white/[0.03]">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="truncate text-sm font-medium text-white">{product.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#05cc47]">
                    {Number(product.price).toFixed(2)} ₺
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/magaza"
              className="mt-8 flex items-center justify-center gap-1.5 text-sm text-white/70 transition hover:text-white sm:hidden"
            >
              Tümünü Gör
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* ─── NEDEN BİZ? — figuratolyem-style benefits ─── */}
      <section className="border-t border-white/[0.04] bg-[#0f1112] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Neden 3D Magza?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/50">
              Kalite, hız ve müşteri memnuniyetinde fark yaratıyoruz.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Profesyonel Ekipman", desc: "Endüstriyel 3D yazıcılar ve kaliteli malzemelerle üretim yapıyoruz." },
              { title: "Hızlı Teslimat", desc: "Siparişlerinizi en kısa sürede üretip, özenle paketleyip kargoluyoruz." },
              { title: "Uygun Fiyatlar", desc: "Rekabetçi fiyatlarımızla 3D baskıyı herkes için erişilebilir kılıyoruz." },
              { title: "Müşteri Desteği", desc: "Üretim öncesi ve sonrası her adımda size destek oluyoruz." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#05cc47]/10">
                  <svg className="h-5 w-5 text-[#05cc47]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HAKKIMIZDA ─── */}
      <section id="hakkimizda" className="border-t border-white/[0.04] px-4 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Text */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Hakkımızda
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-white/60">
                <p>
                  3D Magza olarak 3D baskı teknolojisiyle hayalleri gerçeğe dönüştürüyoruz.
                  Profesyonel ekibimiz, endüstriyel yazıcılarımız ve kaliteli malzemelerimizle
                  her ölçekte projeye hizmet veriyoruz.
                </p>
                <p>
                  Figürlerden prototiplere, hediyelik eşyalardan özel tasarımlara kadar geniş
                  bir yelpazede üretim yapıyor, müşterilerimize en iyi 3D baskı deneyimini
                  sunmayı hedefliyoruz.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { label: "Tamamlanan Proje", value: "500+" },
                  { label: "Mutlu Müşteri", value: "300+" },
                  { label: "Yazıcı Sayısı", value: "12" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="block text-2xl font-bold text-[#05cc47]">{stat.value}</span>
                    <span className="mt-0.5 block text-xs text-white/40">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Visual — decorative SVG */}
            <div className="relative flex items-center justify-center">
              <div className="relative flex h-72 w-72 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#0f1112] md:h-80 md:w-80">
                {/* Decorative 3D-like geometric shapes */}
                <svg className="h-40 w-40 text-[#05cc47]/20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2l7 3.5-7 3.5-7-3.5 7-3.5zm-8 8.9v-5.8l7 3.5v5.8l-7-3.5zm16 0l-7 3.5v-5.8l7-3.5v5.8z" />
                </svg>
                {/* Inner ring */}
                <div className="absolute inset-6 rounded-2xl border border-white/[0.04]" />
                {/* Corner accents */}
                <div className="absolute left-4 top-4 h-8 w-px bg-[#05cc47]/30" />
                <div className="absolute left-4 top-4 h-px w-8 bg-[#05cc47]/30" />
                <div className="absolute right-4 bottom-4 h-8 w-px bg-[#05cc47]/30" />
                <div className="absolute right-4 bottom-4 h-px w-8 bg-[#05cc47]/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA — figuratolyem-style call to action ─── */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            3D Baskı Dünyasına Adım Atın
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/50">
            İster kendi modelinizi yükleyin, ister koleksiyonumuzdan seçin. Hayal ettiğiniz her şeyi 3D olarak üretelim.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/magaza"
              className="inline-flex items-center gap-2 rounded-full bg-[#05cc47] px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-[#05cc47]/90"
            >
              Alışverişe Başla
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/yukle"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition hover:border-white/40"
            >
              STL Yükle
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
