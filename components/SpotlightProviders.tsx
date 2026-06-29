"use client";

import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getCategoryAccentTheme } from "@/lib/constants";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";

const PLACEHOLDER_COUNT = 3;

interface SpotlightProvidersProps {
  providers: Provider[];
}

function SpotlightPlaceholder() {
  return (
    <div className="flex h-[200px] min-w-[340px] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border border-dashed border-[#e5e7eb] bg-[#fafafa] p-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-[#d1d5db]">
        <span className="text-2xl text-[#d1d5db]">+</span>
      </div>
      <p className="mt-3 text-[15px] font-medium text-[#9ca3af]">
        Jouw activiteit hier
      </p>
      <p className="mt-1 text-xs text-[#d1d5db]">Adverteer als eerste</p>
      <Link
        href="/aanbieders/nieuw"
        className="mt-3 text-[13px] font-medium text-[#1D9E75] hover:underline"
      >
        Meer info →
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
            const theme = getCategoryAccentTheme(provider.category);
            const initial = provider.name.charAt(0).toUpperCase();

            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="group flex h-[200px] min-w-[340px] shrink-0 snap-start flex-col rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
              >
                <div className="flex flex-1 gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold"
                    style={{
                      backgroundColor: theme.avatarBg,
                      color: theme.avatarColor,
                    }}
                  >
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-bold text-[#111827]">
                      {provider.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#6b7280]">
                      {provider.city} · {provider.category}
                    </p>
                    <p className="mt-2 text-[15px] font-semibold text-[#1D9E75]">
                      Vanaf &euro;{provider.price_from}/pers
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#fef3c7] px-2.5 py-1 text-[11px] font-semibold text-[#92400e]">
                    Uitgelicht
                  </span>
                  <span className="rounded-lg bg-[#1D9E75] px-4 py-2 text-[13px] font-semibold text-white">
                    Bekijk →
                  </span>
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
