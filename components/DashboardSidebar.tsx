"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overzicht" },
  { href: "/dashboard#activiteiten", label: "Mijn activiteiten" },
  { href: "/dashboard#aanvragen", label: "Aanvragen" },
  { href: "/dashboard#profiel", label: "Profiel" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="border-b border-gray-100 p-6">
        <Link href="/" className="text-xl font-bold text-[#1D9E75]">
          Dagout
        </Link>
        <p className="mt-1 text-xs text-gray-500">Aanbieder portaal</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === item.href.split("#")[0]
                    ? "bg-[#1D9E75]/10 text-[#1D9E75]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
