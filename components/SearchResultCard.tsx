"use client";

import Link from "next/link";
import { useState } from "react";
import type { Provider } from "@/lib/types";
import { getCategoryStyle, getProviderImageUrl } from "@/lib/constants";
import CategoryIcon, { resolveCategorySlug } from "@/components/CategoryIcon";

interface SearchResultCardProps {
  provider: Provider;
}

export default function SearchResultCard({ provider }: SearchResultCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const style = getCategoryStyle(provider.category);
  const slug = resolveCategorySlug(provider.category);
  const imageUrl =
    provider.image_url ?? getProviderImageUrl(provider.category, provider.slug);
  const showColorFallback = imageFailed || !imageUrl;

  return (
    <Link
      href={`/activiteit/${provider.slug}`}
      className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className="relative h-[160px] w-[160px] shrink-0 overflow-hidden rounded-lg"
        style={
          showColorFallback ? { backgroundColor: style.color } : undefined
        }
      >
        {!showColorFallback && (
          <img
            src={imageUrl}
            alt={provider.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              setImageFailed(true);
            }}
          />
        )}
        {showColorFallback && (
          <div className="absolute bottom-2 right-2 opacity-[0.15]">
            <CategoryIcon slug={slug} className="h-12 w-12" />
          </div>
        )}
        {provider.featured && (
          <span className="absolute right-1.5 top-1.5 rounded bg-[#fef3c7] px-2 py-0.5 text-[11px] font-semibold text-[#92400e]">
            Gesponsord
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {provider.category}
        </span>
        <h2 className="mt-2 text-lg font-bold text-gray-900">{provider.name}</h2>
        <p className="mt-0.5 text-sm text-gray-500">{provider.city}</p>
        <p className="mt-2 text-base font-semibold text-[#1D9E75]">
          &euro;{provider.price_from}/pers
        </p>
      </div>
    </Link>
  );
}
