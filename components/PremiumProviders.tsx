"use client";

import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getCategoryAccentTheme } from "@/lib/constants";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";

const PLACEHOLDER_COUNT = 4;

interface PremiumProvidersProps {
  providers: Provider[];
}

function PremiumPlaceholder() {
  return (
    <div className="min-w-[240px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-dashed border-[#e5e7eb] bg-[#fafafa]">
      <div className="flex h-[120px] items-center justify-center bg-[#f3f4f6]">
        <span className="text-3xl font-light text-[#d1d5db]">+</span>
      </div>
      <div className="space-y-1.5 p-3">
        <div className="h-3.5 w-[70%] rounded bg-[#f3f4f6]" />
        <div className="mt-1.5 h-3 w-[50%] rounded bg-[#f3f4f6]" />
        <div className="mt-1 h-3 w-[40%] rounded bg-[#f3f4f6]" />
      </div>
    </div>
  );
}

export default function PremiumProviders({ providers }: PremiumProvidersProps) {
  return (
    <section className="bg-[#f9fafb] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-6 text-2xl font-bold text-[#111827]">
          Premium aanbieders
        </h2>

        <HorizontalScrollRow>
          {providers.map((provider) => {
            const theme = getCategoryAccentTheme(provider.category);

            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="group min-w-[240px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div
                  className="relative flex h-[120px] items-center justify-center"
                  style={{ backgroundColor: theme.proBg }}
                >
                  <span className="text-[32px] opacity-80" aria-hidden>
                    {theme.emoji}
                  </span>
                  <span
                    className="absolute right-0 top-0 bg-[#1D9E75] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                    style={{ borderRadius: "0 14px 0 6px" }}
                  >
                    Pro
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[#111827]">
                    {provider.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#9ca3af]">{provider.city}</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1D9E75]">
                    Vanaf &euro;{provider.price_from}/pers
                  </p>
                  <span className="mt-1.5 inline-block text-xs font-medium text-[#1D9E75] group-hover:underline">
                    Bekijk →
                  </span>
                </div>
              </Link>
            );
          })}
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <PremiumPlaceholder key={i} />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
