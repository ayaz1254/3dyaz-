"use client";

import { useState, useCallback } from "react";
import { Lightbox } from "./lightbox";

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const lbPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const lbNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-gray-800/30">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">Görsel Yok</span>
        </div>
      </div>
    );
  }

  const selected = images[selectedIndex];

  return (
    <>
      {/* Main image — tıklanabilir, lightbox açar */}
      <div>
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-800/30 cursor-pointer group"
          onClick={() => openLightbox(selectedIndex)}
        >
          <img
            src={selected}
            alt={`${productName} - Görsel ${selectedIndex + 1}`}
            className="w-full object-cover transition duration-700"
          />
          {/* Büyüt butonu */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
            <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
              Büyüt
            </span>
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                aria-label="Önceki görsel"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                aria-label="Sonraki görsel"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            </>
          )}
          {/* Mobilde büyüt ipucu */}
          <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm sm:hidden">
            Dokun büyüt
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border bg-gray-800/30 transition sm:h-20 sm:w-20 ${
                  i === selectedIndex
                    ? "border-cyan-500 ring-1 ring-cyan-500/50"
                    : "border-white/10 hover:border-cyan-500/50"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox open={lightboxOpen} onClose={() => setLightboxOpen(false)}>
        <div className="relative flex max-h-[85vh] max-w-[90vw] items-center">
          <img
            src={images[lightboxIndex]}
            alt={`${productName} - Görsel ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={lbPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={lbNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {lightboxIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </Lightbox>
    </>
  );
}
