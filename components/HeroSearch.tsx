"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const CHIPS = [
  { label: "Kajakken in Gent", query: "Kajakken teambuilding voor 20 personen in Gent" },
  { label: "Escape room Antwerpen", query: "Escape room teambuilding Antwerpen voor 15 personen" },
  { label: "Kookworkshop Brussel", query: "Kookworkshop teambuilding Brussel voor 25 personen" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function navigate(searchQuery: string) {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    params.set("ai", "true");
    router.push(`/zoeken?${params.toString()}`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(query);
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 rounded-[14px] bg-white p-1.5 shadow-lg sm:flex-row sm:items-center sm:pl-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="bv. actieve dag voor 25 mensen in Gent, budget €30/pers"
            className="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:py-3.5"
          />
          <button
            type="submit"
            className="shrink-0 rounded-[10px] bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#178a66] sm:px-6"
          >
            Zoek met AI →
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => navigate(chip.query)}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
