"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ActivityCard from "@/components/ActivityCard";
import AiRecommendations from "@/components/AiRecommendations";
import { sortProviders } from "@/lib/providers";
import type { Provider } from "@/lib/types";

type SortOption = "relevant" | "price-asc" | "rating";

interface ZoekenResultsProps {
  providers: Provider[];
  query: string;
  region: string;
  category: string;
  aiMode?: boolean;
}

export default function ZoekenResults({
  providers,
  query,
  region,
  category,
  aiMode = false,
}: ZoekenResultsProps) {
  const router = useRouter();
  const [sort, setSort] = useState<SortOption>("relevant");

  const sorted = useMemo(
    () => sortProviders(providers, sort),
    [providers, sort]
  );

  const resultLabel = `${providers.length} ${
    providers.length === 1 ? "activiteit" : "activiteiten"
  } gevonden`;

  function clearSearch() {
    router.push("/zoeken");
  }

  return (
    <>
      {aiMode && query.trim() && (
        <AiRecommendations query={query} region={region} />
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-8">
        <h2 className="text-xl font-bold text-gray-900">{resultLabel}</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sorteer op"
          className="rounded-lg border border-gray-200/80 bg-white px-4 py-2 text-sm text-gray-700 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
        >
          <option value="relevant">Meest relevant</option>
          <option value="price-asc">Prijs laag-hoog</option>
          <option value="rating">Hoogst beoordeeld</option>
        </select>
      </div>

      <div className="space-y-4 pb-8">
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-gray-200/60 bg-gray-50 p-10 text-center">
            <p className="text-lg font-medium text-gray-800">
              Geen activiteiten gevonden
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Probeer andere zoektermen of filters.
            </p>
            <button
              type="button"
              onClick={clearSearch}
              className="mt-6 rounded-xl bg-[#1D9E75] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
            >
              Wis zoekopdracht
            </button>
          </div>
        ) : (
          sorted.map((provider) => (
            <ActivityCard
              key={provider.id}
              provider={provider}
              variant="list"
              showFavorite
            />
          ))
        )}
      </div>
    </>
  );
}
