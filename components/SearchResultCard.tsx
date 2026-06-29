"use client";

import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getCategoryStyle } from "@/lib/constants";
import CategoryIcon, { resolveCategorySlug } from "@/components/CategoryIcon";

interface SearchResultCardProps {
  provider: Provider;
}

export default function SearchResultCard({ provider }: SearchResultCardProps) {
  const style = getCategoryStyle(provider.category);
  const slug = resolveCategorySlug(provider.category);

  return (
    <Link
      href={`/activiteit/${provider.slug}`}
      className="flex cursor-pointer gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div
        className="relative flex h-[160px] w-[160px] shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{
          background: `radial-gradient(at 30% 25%, ${style.color}ee 0%, ${style.color} 70%, #0f172a 100%)`,
        }}
      >
        <div className="opacity-35">
          <CategoryIcon slug={slug} className="h-14 w-14" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {provider.category}
        </span>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">{provider.name}</h2>
          {provider.featured && (
            <span className="rounded bg-[#fffbeb] px-2 py-0.5 text-[11px] font-semibold text-[#92400e]">
              Gesponsord
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-gray-500">{provider.city}</p>
        <p className="mt-2 text-base font-semibold text-[#1D9E75]">
          &euro;{provider.price_from}/pers
        </p>
      </div>
    </Link>
  );
}
