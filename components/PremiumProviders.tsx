"use client";

import Link from "next/link";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";

const PLACEHOLDER_COUNT = 5;

const BEIGE = {
  surface: "#f3f0eb",
  avatar: "#e5e0d8",
  placeholder: "#c4bdb5",
};

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

export default function PremiumProviders() {
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
