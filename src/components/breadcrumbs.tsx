"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mx-auto w-full max-w-7xl px-4 pt-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500">
        <li>
          <Link href="/" className="flex items-center gap-1 transition hover:text-cyan-400">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Ana Sayfa</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
            {item.href ? (
              <Link href={item.href} className="transition hover:text-cyan-400">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
