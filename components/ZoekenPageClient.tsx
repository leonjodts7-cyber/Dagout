"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ActivityCard from "@/components/ActivityCard";
import AiRecommendations from "@/components/AiRecommendations";
import ProviderMap from "@/components/ProviderMap";
import ZoekenCategoryChips from "@/components/ZoekenCategoryChips";
import {
  searchProviders,
  sortProviders,
  type SortOption,
} from "@/lib/providers";

interface ZoekenPageClientProps {
  query: string;
  region: string;
  category: string;
  personen: string;
  omgeving: string;
  aiMode: boolean;
}

export default function ZoekenPageClient({
  query,
  region,
  category,
  personen,
  omgeving,
  aiMode,
}: ZoekenPageClientProps) {
  const router = useRouter();
  const [sort, setSort] = useState<SortOption>("relevant");

  const providers = useMemo(
    () => searchProviders(query, region, category, personen, omgeving),
    [query, region, category, personen, omgeving]
  );

  const sorted = useMemo(
    () => sortProviders(providers, sort),
    [providers, sort]
  );

  const resultLabel = `${providers.length} ${
    providers.length === 1 ? "activiteit" : "activiteiten"
  } gevonden`;

  return (
    <div className="flex flex-1 flex-col-reverse lg:flex-row lg:overflow-hidden">
      <div className="order-2 lg:order-1 lg:h-[calc(100vh-8.5rem)] lg:w-1/2 lg:overflow-y-auto">
        <div className="px-6 py-8">
          {aiMode && query.trim() && (
            <AiRecommendations query={query} region={region} />
          )}

          <div className="mb-6">
            <ZoekenCategoryChips
              query={query}
              region={region}
              category={category}
              personen={personen}
              omgeving={omgeving}
            />
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-900">{resultLabel}</h2>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sorteer op"
              className="rounded-lg border border-gray-200/80 bg-white px-4 py-2 text-sm text-gray-700 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
            >
              <option value="relevant">Meest relevant</option>
              <option value="price-asc">Prijs laag-hoog</option>
              <option value="price-desc">Prijs hoog-laag</option>
              <option value="rating">Hoogst beoordeeld</option>
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-xl border border-gray-200/60 bg-gray-50 p-10 text-center">
              <p className="text-lg font-medium text-gray-800">
                Geen activiteiten gevonden voor deze filters
              </p>
              <button
                type="button"
                onClick={() => router.push("/zoeken")}
                className="btn-primary mt-6 rounded-xl bg-[#1D9E75] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
              >
                Wis filters
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-8">
              {sorted.map((provider) => (
                <ActivityCard
                  key={provider.id}
                  provider={provider}
                  variant="list"
                  showFavorite
                  showAddToVote
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sticky top-[65px] order-1 h-72 lg:top-[8.5rem] lg:h-[calc(100vh-8.5rem)] lg:w-1/2">
        <ProviderMap providers={sorted} region={region} />
      </div>
    </div>
  );
}
