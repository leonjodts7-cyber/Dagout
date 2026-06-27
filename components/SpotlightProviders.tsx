import Link from "next/link";
import type { Provider } from "@/lib/types";

const SPOTLIGHT_COLORS: Record<string, string> = {
  "1": "#0c4a6e",
  "2": "#3b0764",
  "3": "#7c2d12",
};

interface SpotlightProvidersProps {
  providers: Provider[];
}

export default function SpotlightProviders({ providers }: SpotlightProvidersProps) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-[#111827]">
            Uitgelichte aanbieders
          </h2>
          <Link
            href="/zoeken"
            className="text-sm font-semibold text-[#1D9E75] hover:text-[#178a66]"
          >
            Bekijk alle activiteiten →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {providers.map((provider) => {
            const baseColor = SPOTLIGHT_COLORS[provider.id] ?? "#0c4a6e";
            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="group relative block h-[280px] overflow-hidden rounded-[20px] transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
                style={{
                  background: `linear-gradient(160deg, ${baseColor} 0%, ${baseColor} 55%, rgba(29, 158, 117, 0.45) 100%)`,
                }}
              >
                <span
                  className="absolute right-0 top-0 bg-[#f59e0b] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ borderRadius: "0 20px 0 8px" }}
                >
                  Uitgelicht
                </span>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xl font-bold">{provider.name}</p>
                  <p className="mt-1 text-sm opacity-80">
                    {provider.city} · {provider.category}
                  </p>
                  <p className="mt-2 text-[15px] font-semibold">
                    Vanaf &euro;{provider.price_from}/pers
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
