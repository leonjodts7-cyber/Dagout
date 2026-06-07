import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { TOOLS_LINKS } from "@/lib/tools-constants";

export default function Footer() {
  return (
    <footer className="bg-[#0a2a1f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-2xl font-bold text-[#1D9E75]">
              Dagout
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Het Belgische platform om de perfecte teambuilding te vinden.
              AI-gestuurd, eenvoudig en professioneel.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Activiteiten
            </h3>
            <ul className="mt-4 space-y-3">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/zoeken?categorie=${encodeURIComponent(c.name)}`}
                    className="text-sm text-white/70 transition-colors hover:text-[#1D9E75]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Tools
            </h3>
            <ul className="mt-4 space-y-3">
              {TOOLS_LINKS.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#1D9E75]"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="mailto:info@dagout.be"
                  className="transition-colors hover:text-[#1D9E75]"
                >
                  info@dagout.be
                </a>
              </li>
              <li>Gent, België</li>
              <li>
                <Link
                  href="/aanbieders/nieuw"
                  className="transition-colors hover:text-[#1D9E75]"
                >
                  Lijst je activiteit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/40">&copy; 2026 Dagout.be</p>
        </div>
      </div>
    </footer>
  );
}
