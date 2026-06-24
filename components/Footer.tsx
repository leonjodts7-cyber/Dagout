import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { TOOLS_LINKS } from "@/lib/tools-constants";

export default function Footer() {
  return (
    <footer className="bg-[#0d2818] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-xl font-bold text-[#1D9E75]">
              Dagout
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Teambuilding platform voor Belgische bedrijven.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Activiteiten
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/zoeken?categorie=${encodeURIComponent(c.name)}`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Tools
            </h3>
            <ul className="mt-4 space-y-2.5">
              {TOOLS_LINKS.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li>
                <a href="mailto:info@dagout.be" className="hover:text-white">
                  info@dagout.be
                </a>
              </li>
              <li>Gent, België</li>
              <li>
                <Link href="/aanbieders/nieuw" className="hover:text-white">
                  Lijst je activiteit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          &copy; 2026 Dagout.be
        </div>
      </div>
    </footer>
  );
}
