"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AiRecommendations from "@/components/AiRecommendations";
import SearchResultCard from "@/components/SearchResultCard";
import ZoekenCategoryChips from "@/components/ZoekenCategoryChips";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  searchProviders,
  sortProviders,
  type SortOption,
} from "@/lib/providers";

const ProviderMap = dynamic(() => import("@/components/ProviderMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

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
  const [mapReady, setMapReady] = useState(false);

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
  }`;

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <div className="order-2 flex-1 overflow-y-auto lg:order-1 lg:max-h-[calc(100vh-140px)] lg:w-1/2">
        <div className="px-4 py-6 sm:px-6">
          {aiMode && query.trim() && (
            <AiRecommendations query={query} region={region} />
          )}

          <div className="mb-5 -mx-1 overflow-x-auto px-1 pb-1">
            <ZoekenCategoryChips
              query={query}
              region={region}
              category={category}
              personen={personen}
              omgeving={omgeving}
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <p className="text-sm font-medium text-gray-700">{resultLabel}</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sorteer op"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#1D9E75] focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/20"
            >
              <option value="relevant">Meest relevant</option>
              <option value="price-asc">Prijs laag-hoog</option>
              <option value="price-desc">Prijs hoog-laag</option>
              <option value="rating">Hoogst beoordeeld</option>
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-10 text-center">
              <p className="font-medium text-gray-800">
                Geen activiteiten gevonden
              </p>
              <button
                type="button"
                onClick={() => router.push("/zoeken")}
                className="mt-4 rounded-lg bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
              >
                Wis filters
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-8">
              {sorted.map((provider) => (
                <SearchResultCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative order-1 h-64 shrink-0 lg:sticky lg:top-[140px] lg:order-2 lg:h-[calc(100vh-140px)] lg:w-1/2">
        {!mapReady && <Skeleton className="absolute inset-0 z-10 h-full w-full" />}
        <div className={`h-full w-full ${mapReady ? "" : "opacity-0"}`}>
          <ProviderMap
            providers={providers}
            region={region}
            onReady={() => setMapReady(true)}
          />
        </div>
      </div>
    </div>
  );
}
