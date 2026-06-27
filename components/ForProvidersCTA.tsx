import Link from "next/link";

const BENEFITS = [
  "Gratis listing",
  "Aanvragen ontvangen",
  "Pro plan €19/maand",
];

const STATS = [
  { value: "Gratis", label: "listing aanmaken" },
  { value: "€19/maand", label: "Pro plan" },
  { value: "Vlaanderen", label: "volledige dekking" },
];

export default function ForProvidersCTA() {
  return (
    <section className="mx-6 mb-16 mt-16">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#f0fdf4] p-10 sm:p-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[32px] font-bold text-[#111827]">
              Ben jij een teambuilding aanbieder?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6b7280]">
              Zet je activiteit op Dagout en word gevonden door Belgische
              bedrijven.
            </p>
            <ul className="mt-8 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-[#1D9E75]">✓</span>
                  <span className="text-[15px] text-[#374151]">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/aanbieders/nieuw"
              className="mt-6 inline-flex rounded-lg bg-[#1D9E75] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#178a66]"
            >
              Lijst je activiteit gratis →
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="rounded-xl border border-[#e5e7eb] bg-white px-6 py-5 shadow-sm"
              >
                <p className="text-lg font-bold text-[#111827]">{stat.value}</p>
                <p className="mt-1 text-sm text-[#6b7280]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
