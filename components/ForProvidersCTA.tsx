import Link from "next/link";

const BENEFITS = [
  "Gratis listing aanmaken",
  "Ontvang aanvragen van Belgische bedrijven",
  "Pro plan voor meer zichtbaarheid",
];

const STATS = [
  { value: "Gratis", label: "listing aanmaken" },
  { value: "€19/maand", label: "Pro plan" },
  { value: "Vlaanderen", label: "dekking" },
];

export default function ForProvidersCTA() {
  return (
    <section className="px-6 pb-16 pt-4">
      <div className="mx-auto max-w-6xl rounded-3xl bg-[#f0fdf4] px-8 py-16 sm:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[32px] font-bold tracking-tight text-gray-900">
              Ben jij een teambuilding aanbieder?
            </h2>
            <ul className="mt-8 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1D9E75] text-white">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-[15px] text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/aanbieders/nieuw"
              className="mt-8 inline-flex rounded-lg bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#178a66]"
            >
              Lijst je activiteit gratis
            </Link>
          </div>

          <div className="rounded-2xl bg-[#1D9E75] p-6 text-white shadow-lg">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {STATS.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-xl bg-white/10 px-4 py-5 text-center backdrop-blur-sm"
                >
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
