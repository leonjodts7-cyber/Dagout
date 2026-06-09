"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { SEARCH_SUGGESTIONS } from "@/lib/constants";

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

  function handleSuggestionClick(suggestionQuery: string) {
    setQuery(suggestionQuery);
    navigate(suggestionQuery);
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl bg-white p-4 shadow-xl sm:p-5">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            placeholder="bv. Wij zijn met 25 mensen, willen iets actiefs buiten doen in Gent, budget €30 per persoon"
            className="min-h-[120px] w-full resize-y rounded-xl border-0 bg-gray-50 px-5 py-4 text-base leading-relaxed text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/30 sm:text-lg"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="btn-primary w-full rounded-xl bg-[#1D9E75] px-8 py-3.5 text-base font-semibold text-white hover:bg-[#178a66] sm:w-auto sm:px-10"
            >
              Zoek met AI &rarr;
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            onClick={() => handleSuggestionClick(suggestion.query)}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/20"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
