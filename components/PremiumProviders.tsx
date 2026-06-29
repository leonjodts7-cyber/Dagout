"use client";

import Link from "next/link";
import type { Provider } from "@/lib/types";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";

const PLACEHOLDER_COUNT = 5;

const BEIGE = {
  surface: "#f3f0eb",
  avatar: "#e5e0d8",
  muted: "#a89f94",
  placeholder: "#c4bdb5",
};

interface PremiumProvidersProps {
  providers: Provider[];
}

function PremiumPlaceholder() {
  return (
    <div className="w-[220px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
      <div
        className="flex h-[130px] items-center justify-center"
        style={{ backgroundColor: BEIGE.surface }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: BEIGE.avatar }}
        >
          <span
            className="text-[22px] font-light"
            style={{ color: BEIGE.placeholder }}
          >
            +
          </span>
        </div>
      </div>
      <div className="space-y-0 p-3">
        <div
          className="h-3.5 w-[70%] rounded"
          style={{ backgroundColor: BEIGE.surface }}
        />
        <div
          className="mt-1.5 h-3 w-[50%] rounded"
          style={{ backgroundColor: BEIGE.surface }}
        />
        <div
          className="mt-1 h-3 w-[35%] rounded"
          style={{ backgroundColor: BEIGE.surface }}
        />
      </div>
    </div>
  );
}

export default function PremiumProviders({ providers }: PremiumProvidersProps) {
  return (
    <section className="bg-[#f9fafb] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold text-[#111827]">
            Premium aanbieders
          </h2>
          <Link
            href="/zoeken"
            className="text-sm font-medium text-[#1D9E75] hover:text-[#178a66]"
          >
            Bekijk alle aanbieders →
          </Link>
        </div>

        <HorizontalScrollRow>
          {providers.map((provider) => {
            const initial = provider.name.charAt(0).toUpperCase();

            return (
              <Link
                key={provider.id}
                href={`/activiteit/${provider.slug}`}
                className="group w-[220px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
              >
                <div
                  className="relative flex h-[130px] items-center justify-center"
                  style={{ backgroundColor: BEIGE.surface }}
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: BEIGE.avatar }}
                  >
                    <span
                      className="text-[22px] font-semibold"
                      style={{ color: BEIGE.muted }}
                    >
                      {initial}
                    </span>
                  </div>
                  <span
                    className="absolute right-0 top-0 bg-[#1D9E75] px-2 py-0.5 text-[10px] font-bold text-white"
                    style={{ borderRadius: "0 14px 0 6px" }}
                  >
                    PRO
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
                  <span className="mt-1.5 inline-block cursor-pointer text-xs text-[#1D9E75] group-hover:underline">
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

        <p className="mt-4 text-center text-sm text-[#6b7280]">
          Wil jij hier ook staan?{" "}
          <Link
            href="/aanbieders/nieuw"
            className="font-medium text-[#1D9E75] hover:text-[#178a66] hover:underline"
          >
            Lijst je activiteit →
          </Link>
        </p>
      </div>
    </section>
  );
}
