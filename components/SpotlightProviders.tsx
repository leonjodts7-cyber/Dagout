"use client";

import Link from "next/link";
import type { Provider } from "@/lib/types";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";

const SPOTLIGHT_BACKGROUNDS: Record<string, string> = {
  "1": "radial-gradient(at 40% 20%, #1e40af 0%, #0c4a6e 50%, #0f172a 100%)",
  "2": "radial-gradient(at 40% 20%, #7c3aed 0%, #3b0764 50%, #0f172a 100%)",
  "3": "radial-gradient(at 40% 20%, #c2410c 0%, #7c2d12 50%, #0f172a 100%)",
};

const PLACEHOLDER_COUNT = 3;

interface SpotlightProvidersProps {
  providers: Provider[];
}

function SpotlightPlaceholder({ index }: { index: number }) {
  return (
    <div
      key={`placeholder-${index}`}
      className="flex h-[280px] min-w-[340px] shrink-0 snap-start flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#d1d5db] bg-[#f3f4f6] p-6 text-center"
    >
      <span className="text-5xl font-light text-[#9ca3af]">+</span>
      <p className="mt-2 text-base font-medium text-[#9ca3af]">
        Jouw activiteit hier
      </p>
      <p className="mt-1 text-[13px] text-[#d1d5db]">Adverteer op Dagout</p>
      <Link
        href="/aanbieders/nieuw"
        className="btn-secondary mt-4 inline-flex px-5 py-2 text-sm"
      >
        Lijst je activiteit →
      </Link>
    </div>
  );
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

        <HorizontalScrollRow>
          {providers.map((provider) => {
            const background =
              SPOTLIGHT_BACKGROUNDS[provider.id] ?? SPOTLIGHT_BACKGROUNDS["1"];
            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="spotlight-card group relative block h-[280px] min-w-[340px] shrink-0 snap-start overflow-hidden rounded-[20px] transition-transform duration-[250ms] ease-out hover:scale-[1.02]"
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
                  <span className="btn-ghost shrink-0">Bekijk →</span>
                </div>
              </Link>
            );
          })}
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <SpotlightPlaceholder key={i} index={i} />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
