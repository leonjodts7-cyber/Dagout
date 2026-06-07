"use client";

import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import AddToVoteButton from "@/components/AddToVoteButton";
import type { Provider } from "@/lib/types";
import { CATEGORY_IMAGES } from "@/lib/constants";
import { formatDurationBadge } from "@/lib/voting-utils";

interface ActivityCardProps {
  provider: Provider;
  variant?: "grid" | "list";
  showFavorite?: boolean;
  showAddToVote?: boolean;
  className?: string;
}

function indoorBadgeLabel(value: Provider["indoor_outdoor"]): string {
  if (value === "indoor") return "Binnen";
  if (value === "outdoor") return "Buiten";
  return "Binnen & buiten";
}

function FeaturedStar() {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-md"
      title="Featured activiteit"
    >
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
      </svg>
    </span>
  );
}

export default function ActivityCard({
  provider,
  variant = "grid",
  showFavorite = true,
  showAddToVote = false,
  className = "",
}: ActivityCardProps) {
  const imageUrl =
    provider.image_url ?? CATEGORY_IMAGES[provider.category] ?? null;
  const durationLabel = formatDurationBadge(provider.duration_minutes);
  const personsLabel = `${provider.min_persons}-${provider.max_persons} pers`;

  if (variant === "list") {
    return (
      <div
        className={`flex gap-4 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5 ${className}`}
      >
        <Link
          href={`/activiteit/${provider.slug}`}
          className="relative hidden h-36 w-44 shrink-0 overflow-hidden rounded-xl sm:block"
        >
          {imageUrl ? (
            <Image src={imageUrl} alt={provider.name} fill className="object-cover" sizes="176px" />
          ) : (
            <div className="h-full bg-[#1D9E75]/10" />
          )}
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
            {indoorBadgeLabel(provider.indoor_outdoor)}
          </span>
          <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
            {durationLabel}
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#1D9E75]/10 px-2.5 py-0.5 text-xs font-medium text-[#1D9E75]">
                  {provider.category}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  {personsLabel}
                </span>
                {provider.featured && <FeaturedStar />}
              </div>
              <div className="flex items-center gap-1">
                {showAddToVote && <AddToVoteButton provider={provider} />}
                {showFavorite && <FavoriteButton provider={provider} />}
              </div>
            </div>
            <Link href={`/activiteit/${provider.slug}`}>
              <h2 className="mt-2 text-lg font-bold text-gray-900 hover:text-[#1D9E75]">
                {provider.name}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-gray-500">{provider.city}</p>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
              {provider.short_description}
            </p>
            <p className="mt-2 font-bold text-[#1D9E75]">
              &euro;{provider.price_from}/pers
            </p>
          </div>
          <Link
            href={`/activiteit/${provider.slug}`}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#1D9E75] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#178a66]"
          >
            Bekijk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${provider.featured ? "ring-1 ring-amber-300/80" : ""} ${className}`}
    >
      <div className="relative aspect-[5/3] overflow-hidden">
        <Link href={`/activiteit/${provider.slug}`} className="block h-full w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={provider.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#1D9E75]/10" />
          )}
        </Link>

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm">
          {indoorBadgeLabel(provider.indoor_outdoor)}
        </span>

        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">
            {durationLabel}
          </span>
          <span className="rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">
            {personsLabel}
          </span>
        </div>

        <div className="absolute right-3 top-3 flex items-start gap-2">
          {provider.featured && <FeaturedStar />}
          {showAddToVote && <AddToVoteButton provider={provider} />}
          {showFavorite && (
            <div className="rounded-full bg-white/95 shadow-sm">
              <FavoriteButton provider={provider} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/activiteit/${provider.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-[#1D9E75]">
            {provider.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500">{provider.city}</p>
        <span className="mt-3 inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {provider.category}
        </span>
        <p className="mt-3 text-base font-bold text-[#1D9E75]">
          &euro;{provider.price_from}/pers
        </p>
        <Link
          href={`/activiteit/${provider.slug}`}
          className="mt-4 inline-flex items-center justify-center rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]"
        >
          Bekijk
        </Link>
      </div>
    </article>
  );
}
