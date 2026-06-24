import Link from "next/link";

export default function ForProvidersCTA() {
  return (
    <section className="bg-[#0d2818] px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ben jij een teambuilding aanbieder?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Zet je activiteit op Dagout en word gevonden door Belgische bedrijven.
          </p>
          <p className="mt-4 text-sm font-medium text-[#4ade80]">
            Gratis te starten. Pro vanaf €19/maand.
          </p>
          <Link
            href="/aanbieders/nieuw"
            className="mt-8 inline-flex rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-[#0d2818] transition-colors hover:bg-gray-100"
          >
            Lijst je activiteit →
          </Link>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="rounded-lg bg-white p-5 shadow-xl">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-sm font-semibold text-gray-900">Dashboard</p>
                <p className="text-xs text-gray-500">Je activiteit beheren</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-3 w-3/4 rounded bg-gray-100" />
                <div className="h-3 w-1/2 rounded bg-gray-100" />
                <div className="mt-4 h-20 rounded-lg bg-[#f9fafb]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
