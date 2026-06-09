"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  SEARCH_FILTER_CATEGORIES,
  getCategoryCounts,
} from "@/lib/providers";

interface ZoekenCategoryChipsProps {
  query: string;
  region: string;
  category: string;
  personen: string;
  omgeving: string;
}

export default function ZoekenCategoryChips({
  query,
  region,
  category,
  personen,
  omgeving,
}: ZoekenCategoryChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const counts = getCategoryCounts(query, region, personen, omgeving);
  const active = category || "Alle";

  function selectCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "Alle") {
      params.delete("categorie");
    } else {
      params.set("categorie", cat);
    }
    router.push(`/zoeken?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {SEARCH_FILTER_CATEGORIES.map((cat) => {
        const isActive = active === cat;
        const count = counts[cat] ?? 0;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => selectCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-[#1D9E75] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:border-[#1D9E75]/40 hover:bg-[#1D9E75]/5"
            }`}
          >
            {cat} ({count})
          </button>
        );
      })}
    </div>
  );
}
