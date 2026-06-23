"use client";

import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import AddToVoteButton from "@/components/AddToVoteButton";
import type { Provider } from "@/lib/types";
import { getProviderImageUrl } from "@/lib/constants";
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

function ProBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
      title="Pro listing"
    >
      ★ PRO
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
    provider.image_url ??
    getProviderImageUrl(provider.category, provider.slug) ??
    null;
  const durationLabel = formatDurationBadge(provider.duration_minutes);
  const personsLabel = `${provider.min_persons}-${provider.max_persons} pers`;

  if (variant === "list") {
    return (
      <div
        className={`card-hover flex gap-5 rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm sm:p-5 ${className}`}
      >
        <Link
          href={`/activiteit/${provider.slug}`}
          className="relative hidden h-[180px] w-48 shrink-0 overflow-hidden rounded-xl sm:block"
        >
          {imageUrl ? (
            <Image src={imageUrl} alt={provider.name} fill className="object-cover" sizes="192px" />
          ) : (
            <div className="h-full bg-gray-100" />
          )}
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-gray-800 backdrop-blur-md">
            {indoorBadgeLabel(provider.indoor_outdoor)}
          </span>
          {provider.featured && (
            <span className="absolute right-2.5 top-2.5">
              <ProBadge />
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#1D9E75]/10 px-2.5 py-0.5 text-xs font-medium text-[#1D9E75]">
                  {provider.category}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                  {personsLabel}
                </span>
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
            <p className="mt-3 text-lg font-bold text-[#1D9E75]">
              &euro;{provider.price_from}/pers
            </p>
          </div>
          <Link
            href={`/activiteit/${provider.slug}`}
            className="btn-primary inline-flex shrink-0 items-center justify-center rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
          >
            Bekijk activiteit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article
      className={`card-hover group flex h-full min-h-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm ${className}`}
    >
      <div className="relative min-h-0 flex-[55] overflow-hidden">
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
            <div className="h-full bg-gray-100" />
          )}
        </Link>

        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-gray-800 backdrop-blur-md">
          {indoorBadgeLabel(provider.indoor_outdoor)}
        </span>

        {provider.featured && (
          <span className="absolute right-3 top-3">
            <ProBadge />
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {durationLabel}
          </span>
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {personsLabel}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 flex items-start gap-2">
          {showAddToVote && <AddToVoteButton provider={provider} />}
          {showFavorite && (
            <div className="rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
              <FavoriteButton provider={provider} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-[45] flex-col p-5">
        <Link href={`/activiteit/${provider.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-[#1D9E75]">
            {provider.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500">{provider.city}</p>
        <span className="mt-2 inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {provider.category}
        </span>
        <p className="mt-auto pt-3 text-lg font-bold text-[#1D9E75]">
          &euro;{provider.price_from}/pers
        </p>
        <Link
          href={`/activiteit/${provider.slug}`}
          className="mt-3 inline-flex items-center justify-center rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-150 hover:border-[#1D9E75] hover:text-[#1D9E75]"
        >
          Bekijk
        </Link>
      </div>
    </article>
  );
}
