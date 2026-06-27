import Link from "next/link";

export default function AdvertentiePlatformSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-[28px] font-bold text-[#111827] sm:text-[30px]">
          Bereik meer klanten met een gesponsorde listing
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-[#6b7280]">
          Pro aanbieders verschijnen bovenaan de zoekresultaten en worden als
          eerste aanbevolen door onze AI.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Basis */}
          <div className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <span className="inline-block w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
              Basis listing
            </span>
            <p className="mt-4 text-3xl font-bold text-[#111827]">Gratis</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-[#374151]">
              <li className="flex gap-2">
                <span className="text-[#1D9E75]">✓</span> Zichtbaar op kaart
              </li>
              <li className="flex gap-2">
                <span className="text-[#1D9E75]">✓</span> Aanvragen ontvangen
              </li>
              <li className="flex gap-2">
                <span className="text-[#1D9E75]">✓</span> Eigen profielpagina
              </li>
            </ul>
            <Link
              href="/aanbieders/nieuw"
              className="mt-8 inline-flex justify-center rounded-lg border-2 border-[#1D9E75] px-5 py-3 text-sm font-semibold text-[#1D9E75] transition-colors hover:bg-[#f0fdf4]"
            >
              Begin gratis
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border-2 border-[#1D9E75] bg-white p-6 shadow-md">
            <span className="inline-block w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Aanbevolen
            </span>
            <p className="mt-1 text-xs font-medium text-[#1D9E75]">Pro listing</p>
            <p className="mt-3 text-3xl font-bold text-[#111827]">
              &euro;19<span className="text-lg font-semibold text-[#6b7280]">/maand</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-[#374151]">
              <li className="flex gap-2">
                <span className="text-[#1D9E75]">✓</span> Alles van Gratis
              </li>
              <li className="flex gap-2">
                <span className="text-[#1D9E75]">✓</span> Bovenaan zoekresultaten
              </li>
              <li className="flex gap-2">
                <span className="text-[#1D9E75]">✓</span> Prioriteit in AI aanbevelingen
              </li>
              <li className="flex gap-2">
                <span className="text-[#1D9E75]">✓</span> Gesponsord badge op listing
              </li>
              <li className="flex gap-2">
                <span className="text-[#1D9E75]">✓</span> Maandelijkse statistieken
              </li>
            </ul>
            <Link
              href="/prijzen"
              className="mt-8 inline-flex justify-center rounded-lg bg-[#1D9E75] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#178a66]"
            >
              Kies Pro
            </Link>
          </div>

          {/* Info */}
          <div className="flex flex-col rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-6">
            <p className="text-lg font-bold text-[#111827]">
              Waarom adverteren op Dagout?
            </p>
            <ul className="mt-6 flex-1 space-y-4 text-sm leading-relaxed text-[#374151]">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D9E75]" />
                Bedrijven zoeken actief naar teambuilding
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D9E75]" />
                Directe aanvragen in je dashboard
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D9E75]" />
                Meetbaar resultaat via statistieken
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
