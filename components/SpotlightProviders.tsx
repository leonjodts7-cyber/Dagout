"use client";

import Link from "next/link";
import type { Provider } from "@/lib/types";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";

const PLACEHOLDER_COUNT = 4;

const BEIGE = {
  surface: "#f3f0eb",
  avatar: "#e5e0d8",
  muted: "#a89f94",
  placeholder: "#c4bdb5",
};

interface SpotlightProvidersProps {
  providers: Provider[];
}

function SpotlightPlaceholder() {
  return (
    <div className="min-h-[220px] w-[340px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
      <div
        className="flex h-[130px] flex-col items-center justify-center"
        style={{ backgroundColor: BEIGE.surface }}
      >
        <div
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full"
          style={{ backgroundColor: BEIGE.avatar }}
        >
          <span
            className="text-[28px] font-light"
            style={{ color: BEIGE.placeholder }}
          >
            +
          </span>
        </div>
        <p className="mt-2 text-xs" style={{ color: BEIGE.placeholder }}>
          Adverteer hier
        </p>
      </div>
      <div className="p-4">
        <div
          className="h-4 w-[65%] rounded-md"
          style={{ backgroundColor: BEIGE.surface }}
        />
        <div
          className="mt-1.5 h-3 w-[45%] rounded-md"
          style={{ backgroundColor: BEIGE.surface }}
        />
        <div
          className="mt-1 h-3 w-[35%] rounded-md"
          style={{ backgroundColor: BEIGE.surface }}
        />
        <div className="mt-4 flex items-center justify-between">
          <div
            className="h-6 w-20 rounded-full"
            style={{ backgroundColor: BEIGE.surface }}
          />
          <div
            className="h-8 w-20 rounded-md"
            style={{ backgroundColor: BEIGE.surface }}
          />
        </div>
      </div>
    </div>
  );
}

export default function SpotlightProviders({ providers }: SpotlightProvidersProps) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold text-[#111827]">
            Uitgelichte aanbieders
          </h2>
          <Link
            href="/zoeken"
            className="text-sm font-medium text-[#1D9E75] hover:text-[#178a66]"
          >
            Bekijk alle activiteiten →
          </Link>
        </div>

        <HorizontalScrollRow>
          {providers.map((provider) => {
            const initial = provider.name.charAt(0).toUpperCase();

            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="min-h-[220px] w-[340px] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              >
                <div
                  className="flex h-[130px] items-center justify-center"
                  style={{ backgroundColor: BEIGE.surface }}
                >
                  <div
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-full"
                    style={{ backgroundColor: BEIGE.avatar }}
                  >
                    <span
                      className="text-[28px] font-semibold"
                      style={{ color: BEIGE.muted }}
                    >
                      {initial}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-base font-bold text-[#111827]">
                    {provider.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#9ca3af]">
                    {provider.city} · {provider.category}
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-[#1D9E75]">
                    Vanaf &euro;{provider.price_from}/pers
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#fef3c7] px-2.5 py-1 text-[11px] font-semibold text-[#92400e]">
                      Uitgelicht
                    </span>
                    <span className="rounded-md bg-[#1D9E75] px-3.5 py-1.5 text-[13px] font-semibold text-white">
                      Bekijk →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <SpotlightPlaceholder key={i} />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
