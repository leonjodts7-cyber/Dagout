import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { TOOLS_LINKS } from "@/lib/tools-constants";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold text-[#1D9E75]">
              Dagout
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[#9ca3af]">
              Het slimste teambuilding platform van België
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Activiteiten
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/zoeken?categorie=${encodeURIComponent(c.name)}`}
                    className="text-sm text-[#9ca3af] transition-colors hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tools
            </h3>
            <ul className="mt-4 space-y-2.5">
              {TOOLS_LINKS.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-[#9ca3af] transition-colors hover:text-white"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#9ca3af]">
              <li>
                <a href="mailto:info@dagout.be" className="hover:text-white">
                  info@dagout.be
                </a>
              </li>
              <li>
                <Link href="/aanbieders/nieuw" className="hover:text-white">
                  Voor aanbieders
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#374151] pt-6 text-center text-sm text-[#9ca3af]">
          &copy; 2026 Dagout.be
        </div>
      </div>
    </footer>
  );
}
