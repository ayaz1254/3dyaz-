"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#0f1112]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Top row: logo + description + social + links */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-[13px] font-bold tracking-tight text-white">
                3D
              </span>
              <span className="text-lg font-bold text-white">Magza</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              3D baskı teknolojisiyle üretilmiş özel tasarım ürünler. Modelini yükle, biz basalım.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.instagram.com/3dmagza"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-[#05cc47]/20 hover:text-[#05cc47]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
                </svg>
              </a>
              <a
                href="https://wa.me/905555555555"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 transition hover:bg-[#05cc47]/20 hover:text-[#05cc47]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-1.102-1.03-1.847-2.263-2.062-2.645-.215-.382-.022-.59.16-.779.163-.169.362-.442.543-.663.181-.222.241-.374.362-.623.121-.249.06-.468-.03-.65-.092-.182-.667-1.607-.914-2.2-.24-.577-.485-.478-.668-.48-.172-.002-.37-.003-.568-.003s-.519.074-.79.372c-.272.297-1.036 1.009-1.036 2.46 0 1.452 1.057 2.854 1.204 3.052.148.197 2.08 3.176 5.04 4.454.704.303 1.254.485 1.683.623.709.227 1.354.195 1.864.118.57-.086 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-10 md:flex md:gap-14">
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase">Mağaza</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="/magaza" className="text-sm text-white/50 transition hover:text-white">Mağaza</Link></li>
                <li><Link href="/ozel-figur" className="text-sm text-white/50 transition hover:text-white">Özel Figür</Link></li>
                <li><Link href="/yukle" className="text-sm text-white/50 transition hover:text-white">STL Yükle</Link></li>
                <li><Link href="/favoriler" className="text-sm text-white/50 transition hover:text-white">Favoriler</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase">Kurumsal</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="/blog" className="text-sm text-white/50 transition hover:text-white">Blog</Link></li>
                <li><Link href="/iletisim" className="text-sm text-white/50 transition hover:text-white">İletişim</Link></li>
                <li><Link href="/sss" className="text-sm text-white/50 transition hover:text-white">SSS</Link></li>
                <li><Link href="/kvkk" className="text-sm text-white/50 transition hover:text-white">KVKK</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase">Destek</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="/iade" className="text-sm text-white/50 transition hover:text-white">İade Koşulları</Link></li>
                <li><Link href="/kargo" className="text-sm text-white/50 transition hover:text-white">Kargo Bilgisi</Link></li>
                <li><Link href="/sss" className="text-sm text-white/50 transition hover:text-white">Sık Sorulanlar</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.04] pt-6 md:flex-row md:items-center">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} 3D Magza. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/kvkk" className="text-white/30 transition hover:text-white/60">KVKK ve Gizlilik</Link>
            <Link href="/sss" className="text-white/30 transition hover:text-white/60">Sıkça Sorulan Sorular</Link>
            <Link href="/iade" className="text-white/30 transition hover:text-white/60">İptal ve İade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
