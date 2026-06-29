"use client";

import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getCategoryStyle } from "@/lib/constants";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";

function premiumGradient(color: string): string {
  return `radial-gradient(at 30% 20%, ${color}dd 0%, ${color} 55%, #0f172a 100%)`;
}

const PLACEHOLDER_COUNT = 4;

interface PremiumProvidersProps {
  providers: Provider[];
}

function PremiumPlaceholder({ index }: { index: number }) {
  return (
    <div
      key={`premium-placeholder-${index}`}
      className="min-w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-dashed border-[#d1d5db] bg-white sm:min-w-[300px]"
    >
      <div className="flex h-[150px] flex-col items-center justify-center border-b border-dashed border-[#e5e7eb] bg-[#f9fafb]">
        <span className="text-3xl font-light text-[#9ca3af]">+</span>
        <span className="mt-1 text-xs text-[#9ca3af]">Foto</span>
      </div>
      <div className="space-y-2 p-3.5">
        <div className="h-4 w-[60%] rounded bg-[#f3f4f6]" />
        <div className="h-3 w-[40%] rounded bg-[#f3f4f6]" />
        <div className="h-3 w-[30%] rounded bg-[#f3f4f6]" />
        <div className="mt-3 h-8 w-[80%] rounded bg-[#f3f4f6]" />
      </div>
    </div>
  );
}

export default function PremiumProviders({ providers }: PremiumProvidersProps) {
  return (
    <section className="bg-[#f9fafb] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#111827]">
            Premium aanbieders
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Verified en aanbevolen door Dagout
          </p>
        </div>

        <HorizontalScrollRow>
          {providers.map((provider) => {
            const style = getCategoryStyle(provider.category);
            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="group min-w-[280px] shrink-0 snap-start cursor-pointer overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] sm:min-w-[300px]"
              >
                <div
                  className="relative h-[150px]"
                  style={{ background: premiumGradient(style.color) }}
                >
                  <span className="absolute bottom-3 left-3 rounded bg-[#1D9E75] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Pro
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="text-[15px] font-semibold text-[#111827]">
                    {provider.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#9ca3af]">
                    {provider.city} · {provider.category}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-[#1D9E75]">
                    Vanaf &euro;{provider.price_from}/pers
                  </p>
                  <span className="mt-2 inline-block text-[13px] font-semibold text-[#1D9E75] group-hover:underline">
                    Bekijk →
                  </span>
                </div>
              </Link>
            );
          })}
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <PremiumPlaceholder key={i} index={i} />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
