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
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 rounded-full border-[1.5px] border-[#d1d5db] bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:pl-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="bv. kajakken voor 20 mensen in Gent"
            className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2.5 text-[15px] text-gray-900 placeholder:text-[#9ca3af] focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#1D9E75] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#178a66]"
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
            className="rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-sm text-[#374151] transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
