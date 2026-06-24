import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold">3D Magza</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              3D baskı teknolojisiyle üretilmiş özel tasarım ürünler.
              Kendi 3D modelinizi yükleyin, size özel basalım.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Hızlı Linkler
            </h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
              <Link href="/urunler" className="hover:text-blue-600">Ürünler</Link>
              <Link href="/yukle" className="hover:text-blue-600">STL Yükle</Link>
              <Link href="/login" className="hover:text-blue-600">Giriş Yap</Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              İletişim
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              info@3dmagza.com
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} 3D Magza. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
