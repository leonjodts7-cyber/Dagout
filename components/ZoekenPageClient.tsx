"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AiRecommendations from "@/components/AiRecommendations";
import ListingCard from "@/components/ListingCard";
import ZoekenCategoryChips from "@/components/ZoekenCategoryChips";
import { Skeleton } from "@/components/ui/Skeleton";
import { sortProviders, type SortOption } from "@/lib/providers-unified";
import type { Provider } from "@/lib/types";

const ProviderMap = dynamic(() => import("@/components/ProviderMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

interface ZoekenPageClientProps {
  providers: Provider[];
  isLaunchEmpty: boolean;
  query: string;
  region: string;
  category: string;
  personen: string;
  omgeving: string;
  aiMode: boolean;
}

function SearchEmptyState({ isLaunchEmpty }: { isLaunchEmpty: boolean }) {
  const router = useRouter();

  if (isLaunchEmpty) {
    return (
      <div className="rounded-xl border border-[#e5e7eb] bg-white px-6 py-14 text-center">
        <svg
          className="mx-auto h-16 w-16 text-[#9ca3af]"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <h2 className="mt-5 text-xl font-semibold text-[#111827]">
          Nog geen activiteiten gevonden
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6b7280]">
          Dagout is net gelanceerd. Ben jij een aanbieder? Wees de eerste op het
          platform.
        </p>
        <Link
          href="/aanbieders/nieuw"
          className="mt-6 inline-block rounded-md bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
        >
          Lijst je activiteit →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-10 text-center">
      <p className="font-medium text-gray-800">Geen activiteiten gevonden</p>
      <button
        type="button"
        onClick={() => router.push("/zoeken")}
        className="mt-4 rounded-lg bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
      >
        Wis filters
      </button>
    </div>
  );
}

export default function ZoekenPageClient({
  providers,
  isLaunchEmpty,
  query,
  region,
  category,
  personen,
  omgeving,
  aiMode,
}: ZoekenPageClientProps) {
  const [sort, setSort] = useState<SortOption>("relevant");
  const [mapReady, setMapReady] = useState(false);

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
            <ZoekenCategoryChips category={category} />
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <p className="text-sm font-medium text-gray-700">{resultLabel}</p>
            {sorted.length > 0 && (
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
            )}
          </div>

          {sorted.length === 0 ? (
            <SearchEmptyState isLaunchEmpty={isLaunchEmpty} />
          ) : (
            <div className="space-y-4 pb-8">
              {sorted.map((provider) => (
                <ListingCard
                  key={provider.id}
                  layout="search"
                  provider={provider}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative order-1 h-64 shrink-0 lg:sticky lg:top-[140px] lg:order-2 lg:h-[calc(100vh-140px)] lg:w-1/2">
        {!mapReady && sorted.length > 0 && (
          <Skeleton className="absolute inset-0 z-10 h-full w-full" />
        )}
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center bg-[#f9fafb] text-sm text-[#9ca3af]">
            Geen locaties om te tonen
          </div>
        ) : (
          <div className={`h-full w-full ${mapReady ? "" : "opacity-0"}`}>
            <ProviderMap
              providers={sorted}
              region={region}
              onReady={() => setMapReady(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
