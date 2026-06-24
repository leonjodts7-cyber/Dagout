import Link from "next/link";

const BENEFITS = [
  "Bereik Belgische bedrijven die actief op zoek zijn naar teambuilding",
  "Beheer je activiteit, prijzen en beschikbaarheid in één dashboard",
  "Krijg meer aanvragen via AI-zoekopdrachten en filters",
];

export default function ForProvidersCTA() {
  return (
    <section className="bg-[#0a2a1f] px-6 py-24 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ben jij een teambuilding aanbieder?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Zet je activiteit op Dagout en bereik Belgische bedrijven die op zoek
            zijn naar de perfecte teambuilding.
          </p>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-white/90">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed sm:text-base">{benefit}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-medium text-[#4ade80]">
            Basis vanaf €14/maand
          </p>
          <Link
            href="/prijzen"
            className="btn-primary mt-4 inline-flex items-center rounded-xl bg-[#1D9E75] px-8 py-4 text-base font-semibold text-white hover:bg-[#178a66]"
          >
            Bekijk de plannen →
          </Link>
        </div>

        <div className="relative hidden lg:block">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="rounded-xl bg-white p-5 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="h-10 w-10 rounded-full bg-[#1D9E75]/10" />
                <div>
                  <div className="h-3 w-32 rounded bg-gray-200" />
                  <div className="mt-2 h-2 w-20 rounded bg-gray-100" />
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-24 rounded-lg bg-[#f0fdf4]" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded-lg bg-gray-100" />
                  <div className="h-8 w-20 rounded-lg bg-[#1D9E75]" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-xl bg-[#1D9E75] px-4 py-3 text-sm font-semibold text-white shadow-lg">
              +12 aanvragen deze maand
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
