"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { REGIONS, CATEGORY_NAMES } from "@/lib/constants";

interface SearchBarProps {
  defaultQuery?: string;
  defaultRegion?: string;
  defaultCategory?: string;
  large?: boolean;
  showCategory?: boolean;
  buttonLabel?: string;
}

export default function SearchBar({
  defaultQuery = "",
  defaultRegion = "",
  defaultCategory = "",
  large = false,
  showCategory = false,
  buttonLabel = "Zoek met AI →",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [region, setRegion] = useState(defaultRegion);
  const [category, setCategory] = useState(defaultCategory);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (region) params.set("regio", region);
    if (category) params.set("categorie", category);
    router.push(`/zoeken?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex w-full flex-col gap-3 ${
          large ? "sm:flex-row sm:items-center" : "lg:flex-row lg:items-center"
        }`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Beschrijf wat jullie zoeken — groepsgrootte, regio, budget..."
          className={`min-w-0 flex-1 rounded-lg border border-gray-200/80 bg-white px-4 text-gray-900 placeholder:text-gray-400 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 ${
            large ? "py-4 text-base" : "py-2.5 text-sm"
          }`}
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Regio"
          className={`min-w-0 rounded-lg border border-gray-200 bg-white px-4 text-gray-700 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 ${
            large ? "py-4 text-base sm:w-48" : "py-2.5 text-sm sm:w-44"
          }`}
        >
          <option value="">Alle regio&apos;s</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {showCategory && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Categorie"
            className="min-w-0 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20 sm:w-44"
          >
            <option value="">Alle categorieën</option>
            {CATEGORY_NAMES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className={`shrink-0 rounded-lg bg-[#1D9E75] font-medium text-white transition-colors hover:bg-[#178a66] ${
            large ? "px-8 py-4 text-base" : "px-6 py-2.5 text-sm"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
