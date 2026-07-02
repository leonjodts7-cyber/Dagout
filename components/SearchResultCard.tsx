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
      className="flex min-h-[110px] cursor-pointer overflow-hidden rounded-xl border border-[#e5e7eb] bg-white transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className="flex w-[120px] shrink-0 items-center justify-center self-stretch bg-[#f3f0eb]">
        <CategoryIcon slug={slug} className="h-8 w-8" stroke="#a89f94" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs text-[#374151]">
            {provider.category}
          </span>
          {provider.featured && (
            <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[11px] font-semibold text-[#92400e]">
              Gesponsord
            </span>
          )}
        </div>

        <h2 className="mt-1 text-[15px] font-bold leading-tight text-[#111827]">
          {provider.name}
        </h2>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-[13px] text-[#6b7280]">{provider.city}</p>
          <p className="shrink-0 text-[13px] font-semibold text-[#1D9E75]">
            &euro;{provider.price_from}/pers
          </p>
        </div>

        <span className="mt-1.5 inline-flex w-fit rounded-md bg-[#1D9E75] px-2.5 py-1 text-xs font-semibold text-white">
          Bekijk →
        </span>
      </div>
    </Link>
  );
}
