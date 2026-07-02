"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    setQuery(defaultQuery);
    setRegion(defaultRegion);
    setCategory(defaultCategory);
    setPersonen(defaultPersonen);
    setOmgeving(defaultOmgeving);
  }, [
    defaultQuery,
    defaultRegion,
    defaultCategory,
    defaultPersonen,
    defaultOmgeving,
  ]);

  const navigate = useCallback(
    (overrides?: {
      query?: string;
      region?: string;
      category?: string;
      personen?: string;
      omgeving?: string;
    }) => {
      const q = overrides?.query ?? query;
      const r = overrides?.region ?? region;
      const c = overrides?.category ?? category;
      const p = overrides?.personen ?? personen;
      const o = overrides?.omgeving ?? omgeving;

      const params = new URLSearchParams();
      if (q.trim()) {
        params.set("q", q.trim());
        params.set("ai", "true");
      } else if (defaultAi) {
        params.set("ai", "true");
      }
      if (r) params.set("regio", r);
      if (c) params.set("categorie", c);
      if (p) params.set("personen", p);
      if (o) params.set("omgeving", o);
      router.push(`/zoeken?${params.toString()}`);
    },
    [query, region, category, personen, omgeving, defaultAi, router]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate();
  }

  const selectClass =
    "min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Beschrijf wat jullie zoeken voor AI-aanbevelingen..."
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <select
          value={region}
          onChange={(e) => {
            const value = e.target.value;
            setRegion(value);
            navigate({ region: value });
          }}
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
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);
            navigate({ category: value });
          }}
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
          onChange={(e) => {
            const value = e.target.value;
            setPersonen(value);
            navigate({ personen: value });
          }}
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
          onChange={(e) => {
            const value = e.target.value;
            setOmgeving(value);
            navigate({ omgeving: value });
          }}
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
