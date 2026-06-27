"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  {
    label: "Genel Bakış",
    href: "/admin",
    icon: "📊",
  },
  {
    label: "Mağaza",
    href: "/admin/products",
    icon: "📦",
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: "📝",
  },
  {
    label: "Kategoriler",
    href: "/admin/categories",
    icon: "📁",
  },
  {
    label: "Siparişler",
    href: "/admin/orders",
    icon: "📋",
  },
  {
    label: "Özel Talepler",
    href: "/admin/custom-uploads",
    icon: "🖨️",
  },
  {
    label: "Müşteriler",
    href: "/admin/customers",
    icon: "👥",
  },
  {
    label: "Yorumlar",
    href: "/admin/reviews",
    icon: "⭐",
  },
  {
    label: "Kuponlar",
    href: "/admin/kuponlar",
    icon: "🏷️",
  },
  {
    label: "Ayarlar",
    href: "/admin/ayarlar",
    icon: "⚙️",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r bg-white dark:bg-gray-950">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="text-lg font-bold">
          3D Magza Admin
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/"
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          ← Siteye Dön
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
