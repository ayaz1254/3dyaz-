import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const navItems = [
  { label: "Genel Bakış", href: "/dashboard", icon: "📊" },
  { label: "Siparişlerim", href: "/dashboard/siparisler", icon: "📦" },
  { label: "Yüklemelerim", href: "/dashboard/yuklemeler", icon: "🖨️" },
  { label: "Profil", href: "/dashboard/profil", icon: "👤" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-56 shrink-0 border-r bg-white p-4 dark:bg-gray-950 md:block">
        <p className="mb-4 truncate text-sm font-medium text-gray-500">
          {session.user.name || session.user.email}
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6 dark:bg-gray-900">{children}</main>
    </div>
  );
}
