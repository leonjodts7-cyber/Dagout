import Link from "next/link";

const BENEFITS = [
  "Gratis listing aanmaken",
  "Ontvang aanvragen van Belgische bedrijven",
  "Pro plan voor meer zichtbaarheid — €19/maand",
];

export default function ForProvidersCTA() {
  return (
    <section className="bg-[#f0fdf4] px-6 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-[32px] font-bold text-gray-900">
            Ben jij een teambuilding aanbieder?
          </h2>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-gray-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1D9E75] text-white">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-base">{benefit}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/aanbieders/nieuw"
            className="mt-8 inline-flex rounded-lg bg-[#1D9E75] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#178a66]"
          >
            Lijst je activiteit gratis
          </Link>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-xl border border-[#bbf7d0] bg-white p-4 shadow-sm">
            <div className="rounded-lg border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-900">Dashboard</p>
              <p className="text-xs text-gray-500">Beheer je activiteit en aanvragen</p>
              <div className="mt-5 space-y-3">
                <div className="h-2.5 w-2/3 rounded bg-gray-100" />
                <div className="h-2.5 w-1/2 rounded bg-gray-100" />
                <div className="mt-4 h-24 rounded-lg bg-[#f9fafb]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
