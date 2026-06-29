"use client";

import Link from "next/link";
import type { Provider } from "@/lib/types";
import CategoryIcon, { resolveCategorySlug } from "@/components/CategoryIcon";

interface SearchResultCardProps {
  provider: Provider;
}

export default function SearchResultCard({ provider }: SearchResultCardProps) {
  const slug = resolveCategorySlug(provider.category);

  return (
    <Link
      href={`/activiteit/${provider.slug}`}
      className="flex cursor-pointer overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="flex h-[130px] w-[160px] shrink-0 items-center justify-center bg-[#f3f0eb]">
        <CategoryIcon slug={slug} className="h-9 w-9" stroke="#a89f94" />
      </div>

      <div className="min-w-0 flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-xs text-[#374151]">
            {provider.category}
          </span>
          {provider.featured && (
            <span className="shrink-0 rounded-full bg-[#fef3c7] px-2 py-0.5 text-[11px] font-semibold text-[#92400e]">
              Gesponsord
            </span>
          )}
        </div>

        <h2 className="mt-1.5 text-[17px] font-bold text-[#111827]">
          {provider.name}
        </h2>
        <p className="mt-0.5 text-sm text-[#6b7280]">{provider.city}</p>
        <p className="mt-1.5 text-base font-semibold text-[#1D9E75]">
          &euro;{provider.price_from}/pers
        </p>
        <span className="mt-2.5 inline-block rounded-md bg-[#1D9E75] px-4 py-2 text-[13px] font-semibold text-white">
          Bekijk activiteit →
        </span>
      </div>
    </Link>
  );
}
