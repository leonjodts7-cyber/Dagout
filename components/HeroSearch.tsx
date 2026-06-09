"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { SEARCH_SUGGESTIONS } from "@/lib/constants";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [query]);

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
        <div className="flex items-center gap-3 rounded-2xl bg-white p-2 pl-5 shadow-2xl ring-1 ring-white/20 sm:p-2.5">
          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            placeholder="Beschrijf jullie perfecte teambuilding dag..."
            className="max-h-[120px] min-h-[28px] flex-1 resize-none border-0 bg-transparent py-2.5 text-base leading-snug text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
          />
          <button
            type="submit"
            className="btn-primary shrink-0 rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66] sm:px-8 sm:text-base"
          >
            Zoek met AI →
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            onClick={() => handleSuggestionClick(suggestion.query)}
            className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-white/30"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
}
