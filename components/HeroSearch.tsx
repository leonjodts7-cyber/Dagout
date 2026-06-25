"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const CHIPS = [
  { label: "Kajakken Gent", query: "Kajakken teambuilding voor 20 personen in Gent" },
  { label: "Escape room Antwerpen", query: "Escape room teambuilding Antwerpen voor 15 personen" },
  { label: "Kookworkshop Brussel", query: "Kookworkshop teambuilding Brussel voor 25 personen" },
  { label: "Outdoor Hasselt", query: "Outdoor teambuilding Hasselt voor 15 personen" },
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
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-[#e5e7eb] bg-white p-1.5 shadow-md sm:flex-row sm:items-center sm:pl-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="bv. kajakken voor 20 mensen in Gent"
            className="min-w-0 flex-1 border-0 bg-transparent px-2 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#178a66]"
          >
            Zoek met AI →
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => navigate(chip.query)}
            className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
