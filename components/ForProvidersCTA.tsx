import Link from "next/link";

const DASHBOARD_STATS = [
  { value: "12", label: "aanvragen" },
  { value: "340", label: "views" },
  { value: "€19", label: "/maand" },
];

const CHART_BARS = [40, 72, 55];

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
              className="mt-6 inline-flex rounded-lg bg-white px-7 py-3.5 text-[15px] font-semibold text-[#1D9E75] transition-all hover:bg-gray-100 hover:shadow-md"
            >
              Ontdek de mogelijkheden →
            </Link>
          </div>

          <div className="rounded-2xl bg-[#1D9E75] p-5">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="grid grid-cols-3 gap-3">
                {DASHBOARD_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg bg-[#f0fdf4] px-3 py-3 text-center"
                  >
                    <p className="text-lg font-bold text-[#1D9E75]">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex h-24 items-end justify-center gap-3">
                {CHART_BARS.map((height, i) => (
                  <div
                    key={i}
                    className="w-10 rounded-t-md bg-[#1D9E75] opacity-80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-gray-400">
                Voorbeeld dashboard — jouw statistieken
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
