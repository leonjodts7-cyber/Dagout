"use client";

import Link from "next/link";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";

const PLACEHOLDER_COUNT = 4;

const BEIGE = {
  surface: "#f3f0eb",
  avatar: "#e5e0d8",
  placeholder: "#c4bdb5",
};

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
        <Link
          href="/aanbieders/nieuw"
          className="mt-4 inline-block rounded-md bg-[#1D9E75] px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-[#178a66]"
        >
          Lijst je activiteit →
        </Link>
      </div>
    </div>
  );
}

export default function SpotlightProviders() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-2 flex items-center justify-between gap-4">
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
        <p className="mb-6 text-sm text-[#6b7280]">
          Wees een van de eerste aanbieders op Dagout
        </p>

        <HorizontalScrollRow>
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <SpotlightPlaceholder key={i} />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
