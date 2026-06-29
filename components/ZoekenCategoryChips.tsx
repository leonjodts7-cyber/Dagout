"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SEARCH_FILTER_CATEGORIES } from "@/lib/providers";

interface ZoekenCategoryChipsProps {
  query: string;
  region: string;
  category: string;
  personen: string;
  omgeving: string;
}

export default function ZoekenCategoryChips({
  category,
}: ZoekenCategoryChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    <div className="category-chips-row flex flex-nowrap gap-2 overflow-x-auto pb-1">
      {SEARCH_FILTER_CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => selectCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-[#1D9E75] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:border-[#1D9E75]/40 hover:bg-[#1D9E75]/5"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
