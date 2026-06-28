import Link from "next/link";
import type { Provider } from "@/lib/types";

const SPOTLIGHT_BACKGROUNDS: Record<string, string> = {
  "1": "radial-gradient(at 40% 20%, #1e40af 0%, #0c4a6e 50%, #0f172a 100%)",
  "2": "radial-gradient(at 40% 20%, #7c3aed 0%, #3b0764 50%, #0f172a 100%)",
  "3": "radial-gradient(at 40% 20%, #c2410c 0%, #7c2d12 50%, #0f172a 100%)",
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
            const background =
              SPOTLIGHT_BACKGROUNDS[provider.id] ??
              SPOTLIGHT_BACKGROUNDS["1"];
            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="spotlight-card group relative block h-[280px] overflow-hidden rounded-[20px] transition-transform duration-[250ms] ease-out hover:scale-[1.02]"
                style={{ background }}
              >
                <span
                  className="absolute right-0 top-0 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{
                    borderRadius: "0 20px 0 8px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  Uitgelicht
                </span>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                  <div className="min-w-0 flex-1">
                    <p className="text-[22px] font-bold text-white">
                      {provider.name}
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      {provider.city} · {provider.category}
                    </p>
                    <p className="mt-1.5 text-[15px] font-semibold text-[#86efac]">
                      Vanaf &euro;{provider.price_from}/pers
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-white/30 bg-white/15 px-3.5 py-1.5 text-[13px] text-white backdrop-blur-sm">
                    Bekijk →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
