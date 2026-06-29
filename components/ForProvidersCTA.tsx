import Link from "next/link";

const BULLETS = [
  "Gratis listing aanmaken",
  "Aanvragen direct in je dashboard",
  "Pro plan voor meer zichtbaarheid",
];

const PROGRESS_ROWS = [
  { label: "Views deze maand", width: "80%" },
  { label: "Aanvragen", width: "50%" },
  { label: "Reactietijd", width: "30%" },
];

export default function ForProvidersCTA() {
  return (
    <section className="bg-[#f9fafb] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-semibold text-[#1D9E75]">
              Voor aanbieders
            </span>
            <h2 className="mt-4 text-[28px] font-bold text-[#111827]">
              Bereik meer klanten via Dagout
            </h2>
            <p className="mt-3 text-base text-[#6b7280]">
              Zet je activiteit online en word gevonden door Belgische bedrijven.
            </p>
            <ul className="mt-6 space-y-2.5">
              {BULLETS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[15px] text-[#374151]">
                  <span className="text-[#1D9E75]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/aanbieders/nieuw"
              className="mt-6 inline-flex rounded-lg bg-[#1D9E75] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#178a66]"
            >
              Lijst je activiteit →
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-semibold text-[#374151]">
              Dashboard voorbeeld
            </p>
            <div className="mt-5 space-y-4">
              {PROGRESS_ROWS.map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex justify-between text-xs text-[#6b7280]">
                    <span>{row.label}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#f3f4f6]">
                    <div
                      className="h-full rounded-full bg-[#1D9E75]/70"
                      style={{ width: row.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs italic text-[#9ca3af]">
              Jouw statistieken na activering
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
