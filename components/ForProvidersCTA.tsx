import Link from "next/link";

const FEATURES = [
  {
    icon: "✓",
    iconBg: "bg-[#f0fdf4] text-[#1D9E75]",
    title: "Gratis listing aanmaken",
    description: "Zet je activiteit online in 5 minuten",
  },
  {
    icon: "✓",
    iconBg: "bg-[#f0fdf4] text-[#1D9E75]",
    title: "Aanvragen ontvangen",
    description: "Bedrijven nemen direct contact op",
  },
  {
    icon: "★",
    iconBg: "bg-amber-50 text-amber-600",
    title: "Pro zichtbaarheid",
    description: "Verschijn bovenaan bij zoekresultaten",
  },
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

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex items-start gap-4 p-4 ${
                  index < FEATURES.length - 1 ? "border-b border-[#f3f4f6]" : ""
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-semibold ${feature.iconBg}`}
                >
                  {feature.icon}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#111827]">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-sm text-[#6b7280]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
