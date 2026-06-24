"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { REGIONS, CATEGORY_NAMES } from "@/lib/constants";

export const PERSONEN_OPTIONS = [
  { value: "", label: "Aantal personen" },
  { value: "1-10", label: "1–10 personen" },
  { value: "10-25", label: "10–25 personen" },
  { value: "25-50", label: "25–50 personen" },
  { value: "50+", label: "50+ personen" },
] as const;

export const OMGEVING_OPTIONS = [
  { value: "", label: "Alle" },
  { value: "indoor", label: "Binnen" },
  { value: "outdoor", label: "Buiten" },
  { value: "both", label: "Beide" },
] as const;

interface FilterSearchBarProps {
  defaultRegion?: string;
  defaultCategory?: string;
  defaultPersonen?: string;
  defaultOmgeving?: string;
  variant?: "default" | "hero" | "home";
}

export default function FilterSearchBar({
  defaultRegion = "",
  defaultCategory = "",
  defaultPersonen = "",
  defaultOmgeving = "",
  variant = "default",
}: FilterSearchBarProps) {
  const router = useRouter();
  const [region, setRegion] = useState(defaultRegion);
  const [category, setCategory] = useState(defaultCategory);
  const [personen, setPersonen] = useState(defaultPersonen);
  const [omgeving, setOmgeving] = useState(defaultOmgeving);

  const isHero = variant === "hero";
  const isHome = variant === "home";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (region) params.set("regio", region);
    if (category) params.set("categorie", category);
    if (personen) params.set("personen", personen);
    if (omgeving) params.set("omgeving", omgeving);
    router.push(`/zoeken?${params.toString()}`);
  }

  const rowClass = isHome
    ? "flex flex-wrap items-center gap-3"
    : "flex flex-col gap-2 sm:flex-row sm:items-stretch";

  const homeSelectClass =
    "min-w-[140px] flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  const selectClass = isHome
    ? homeSelectClass
    : isHero
      ? "min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white backdrop-blur-sm transition-all focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 [&>option]:text-gray-900"
      : "min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition-all focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={rowClass}>
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
              {o.value === "" ? "Binnen/Buiten" : o.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="btn-primary shrink-0 rounded-lg bg-[#1D9E75] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66] sm:min-w-[120px]"
        >
          Zoek
        </button>
      </div>
    </form>
  );
}
