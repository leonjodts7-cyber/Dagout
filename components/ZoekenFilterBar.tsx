"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { REGIONS, CATEGORY_NAMES } from "@/lib/constants";
import { PERSONEN_OPTIONS, OMGEVING_OPTIONS } from "@/components/FilterSearchBar";

interface ZoekenFilterBarProps {
  defaultQuery?: string;
  defaultRegion?: string;
  defaultCategory?: string;
  defaultPersonen?: string;
  defaultOmgeving?: string;
  defaultAi?: boolean;
}

export default function ZoekenFilterBar({
  defaultQuery = "",
  defaultRegion = "",
  defaultCategory = "",
  defaultPersonen = "",
  defaultOmgeving = "",
  defaultAi = false,
}: ZoekenFilterBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [region, setRegion] = useState(defaultRegion);
  const [category, setCategory] = useState(defaultCategory);
  const [personen, setPersonen] = useState(defaultPersonen);
  const [omgeving, setOmgeving] = useState(defaultOmgeving);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
      params.set("ai", "true");
    }

    if (region) params.set("regio", region);
    if (category) params.set("categorie", category);
    if (personen) params.set("personen", personen);
    if (omgeving) params.set("omgeving", omgeving);

    if (!query.trim() && defaultAi) {
      params.set("ai", "true");
    }

    router.push(`/zoeken?${params.toString()}`);
  }

  const selectClass =
    "min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Beschrijf wat jullie zoeken voor AI-aanbevelingen..."
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Regio"
          className={selectClass}
        >
          <option value="">Alle regio&apos;s</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Categorie"
          className={selectClass}
        >
          <option value="">Alle categorieën</option>
          {CATEGORY_NAMES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={personen}
          onChange={(e) => setPersonen(e.target.value)}
          aria-label="Aantal personen"
          className={selectClass}
        >
          {PERSONEN_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={omgeving}
          onChange={(e) => setOmgeving(e.target.value)}
          aria-label="Binnen of buiten"
          className={selectClass}
        >
          {OMGEVING_OPTIONS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.value === "" ? "Binnen/Buiten: Alle" : o.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="btn-primary shrink-0 rounded-lg bg-[#1D9E75] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66] lg:px-8"
        >
          Zoek
        </button>
      </div>
    </form>
  );
}
