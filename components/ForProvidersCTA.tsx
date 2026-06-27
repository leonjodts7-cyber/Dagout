import Link from "next/link";

const HIGHLIGHTS = [
  "Gratis starten",
  "Pro zichtbaarheid",
  "Direct aanvragen",
];

export default function ForProvidersCTA() {
  return (
    <section className="bg-[#111827] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[30px] font-bold text-white">
              Ben jij een teambuilding aanbieder?
            </h2>
            <p className="mt-4 text-base text-white/70">
              Bereik honderden Belgische bedrijven die actief op zoek zijn naar
              teambuilding activiteiten.
            </p>
            <Link
              href="/aanbieders/nieuw"
              className="mt-6 inline-flex rounded-lg bg-white px-7 py-3.5 text-[15px] font-semibold text-[#1D9E75] transition-colors hover:bg-gray-100"
            >
              Ontdek de mogelijkheden →
            </Link>
          </div>

          <div className="rounded-2xl bg-[#1D9E75] p-5">
            <div className="flex flex-col gap-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-white px-5 py-4 text-center text-[15px] font-semibold text-[#111827]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
