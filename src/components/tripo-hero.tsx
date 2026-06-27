"use client";

import Link from "next/link";

const cards = [
  {
    id: "blue",
    bgImg: "/img/hero/smart-poly-bg-b.webp",
    bgImgHover: "/img/hero/smart-poly-bg-b-hover.webp",
    charImg: "/img/hero/smart-poly-char-b.webp",
    charImgHover: "/img/hero/smart-poly-char-b-hover.webp",
    title: "Yüksek Detaylı Model",
    desc: "3D Baskı ve Görsel Sanatlar için 2 Milyon Poligona Kadar",
    btnText: "HD Model Üret",
    btnHref: "/workspace/generate",
    // Card 1: character on left, text+button on right
    bgPos: "left-[78px] top-[16px]",
    charPos: "left-[-28px] top-[-23px]",
    charWidth: "w-[280px]",
    charHeight: "h-[349px]",
    textPos: "left-[259px] top-[70px]",
    textWidth: "w-[253px]",
    btnPos: "left-[271px]",
    btnGradient: "from-[#1235AE] to-[#4F66FD]",
  },
  {
    id: "red",
    bgImg: "/img/hero/smart-poly-bg-r.webp",
    bgImgHover: "/img/hero/smart-poly-bg-r-hover.webp",
    charImg: "/img/hero/smart-poly-char-r.webp",
    charImgHover: "/img/hero/smart-poly-char-r-hover.webp",
    title: "Akıllı Topoloji Ağı",
    desc: "~2s | Oyunlar ve Web Uygulamaları İçin Temiz Topoloji",
    btnText: "Akıllı Ağ Üret",
    btnHref: "/workspace/generate",
    // Card 2: character on right, text+button on left
    bgPos: "left-[0px] top-[16px]",
    charPos: "left-[280px] top-[-23px]",
    charWidth: "w-[328px]",
    charHeight: "h-[349px]",
    textPos: "left-[32px] top-[70px]",
    textWidth: "w-[253px]",
    btnPos: "left-[0px]",
    btnGradient: "from-[#5F2209] to-[#DB4203]",
  },
];

export function TripoHero() {
  return (
    <div className="min-w-[1280px] w-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative z-1 overflow-hidden">
        {/* Heading */}
        <div className="flex flex-col items-center gap-3 pt-9 pb-0 text-center max-md:pt-6">
          <h1 className="m-0 text-[40px] font-bold leading-[44px] text-white">
            Her Şeyi 3D Olarak Üretin
          </h1>
          <p className="m-0 text-[18px] font-normal leading-[22px] text-white/60">
            Hepsi Bir Arada Yapay Zeka 3D Çalışma Alanınız
          </p>
        </div>

        {/* Cards */}
        <div className="relative mx-auto flex max-w-[1200px] items-start justify-center gap-20 px-8 pb-8 max-md:mt-6 max-md:flex-col max-md:items-center max-md:gap-6 max-md:px-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group relative h-[326px] w-[547px] shrink-0 cursor-pointer max-md:h-[180px] max-md:w-[351px] max-md:overflow-hidden max-md:rounded-[20px]"
            >
              {/* Empty placeholder div (original has one) */}
              <div />

              {/* Background image - default state */}
              <img
                src={card.bgImg}
                alt=""
                className="pointer-events-none absolute left-[78px] top-[16px] h-[310px] w-[469px] rounded-[20px] object-cover opacity-100 transition-opacity duration-300 group-hover:opacity-0 max-md:hidden"
              />

              {/* Background image - hover state */}
              <img
                src={card.bgImgHover}
                alt=""
                className="pointer-events-none absolute left-[78px] top-[16px] h-[310px] w-[469px] rounded-[20px] object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden"
              />

              {/* Character image - default state */}
              <img
                src={card.charImg}
                alt=""
                className={`pointer-events-none absolute select-none object-cover opacity-100 transition-opacity duration-300 group-hover:opacity-0 ${card.charPos} ${card.charWidth} ${card.charHeight}`}
              />

              {/* Character image - hover state */}
              <img
                src={card.charImgHover}
                alt=""
                className={`pointer-events-none absolute select-none object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${card.charPos} ${card.charWidth} ${card.charHeight}`}
              />

              {/* Text content */}
              <div
                className={`absolute flex flex-col items-start ${card.textPos} ${card.textWidth} max-md:w-[50%] max-md:left-[43%] max-md:top-8`}
              >
                <h2 className="text-[24px] font-bold leading-[28px] text-white">
                  {card.title}
                </h2>
                <p className="mt-0 text-[16px] leading-[20px] text-white/60">
                  {card.desc}
                </p>
              </div>

              {/* Button */}
              <Link
                href={card.btnHref}
                className={`absolute bottom-0 ${card.btnPos} flex h-[56px] w-[276px] items-center justify-center overflow-hidden rounded-[100px] border-none text-[17px] font-medium text-white no-underline`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${card.btnGradient}`}
                />
                <span className="relative z-1 flex items-center justify-center gap-3">
                  {card.btnText}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
