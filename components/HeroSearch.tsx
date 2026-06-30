"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const CHIPS = [
  { label: "Kajakken Gent", query: "Kajakken teambuilding voor 20 personen in Gent" },
  { label: "Escape room Antwerpen", query: "Escape room teambuilding Antwerpen voor 15 personen" },
  { label: "Kookworkshop Brussel", query: "Kookworkshop teambuilding Brussel voor 25 personen" },
];

const ROTATING_PLACEHOLDERS = [
  "bv. kajakken voor 20 mensen in Gent",
  "bv. escape room voor 15 mensen in Antwerpen",
  "bv. kookworkshop met lunch in Brussel",
];

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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

  const placeholder = focused ? "" : ROTATING_PLACEHOLDERS[placeholderIndex];

  return (
    <div className="mx-auto mt-8 w-full max-w-[600px]">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className="hero-search-bar flex w-full flex-col gap-2 sm:flex-row sm:items-center"
          data-focused={focused ? "true" : "false"}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="min-w-0 flex-1 border-0 bg-transparent text-base text-gray-900 outline-none placeholder:text-[#9ca3af]"
          />
          <button
            type="submit"
            className="btn-primary hero-search-submit w-full shrink-0 sm:w-auto"
          >
            Zoek met AI →
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-nowrap justify-center gap-2 overflow-x-auto pb-1">
        {CHIPS.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => navigate(chip.query)}
            className="shrink-0 cursor-pointer rounded-full border border-[#e5e7eb] bg-white px-3.5 py-1.5 text-[13px] text-[#374151] transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
