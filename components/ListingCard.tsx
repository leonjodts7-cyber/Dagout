import Link from "next/link";
import CategoryIcon, { resolveCategorySlug } from "@/components/CategoryIcon";
import type { HomeCardItem } from "@/lib/home-listings";
import type { Provider } from "@/lib/types";
import { slugify } from "@/lib/utils";

interface ListingCardProps {
  layout?: "grid" | "search";
  className?: string;
  item?: HomeCardItem;
  provider?: Provider;
}

function ProBadge() {
  return (
    <span
      className="absolute right-0 top-0 bg-[#1D9E75] px-[10px] py-[3px] text-[10px] font-bold text-white"
      style={{ borderRadius: "0 14px 0 8px" }}
    >
      PRO
    </span>
  );
}

function InitialCircle({
  letter,
  isPlaceholder,
}: {
  letter: string;
  isPlaceholder?: boolean;
}) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e9e5df]">
      <span
        className="text-[24px] text-[#9c948a]"
        style={{ fontWeight: isPlaceholder ? 300 : 600 }}
      >
        {letter}
      </span>
    </div>
  );
}

function PlaceholderLines() {
  return (
    <div>
      <div className="h-[15px] w-[70%] rounded bg-[#f3f4f6]" />
      <div className="mt-2 h-3 w-[45%] rounded bg-[#f3f4f6]" />
      <div className="mt-1.5 h-3 w-[35%] rounded bg-[#f3f4f6]" />
    </div>
  );
}

function GridCard({
  item,
  provider,
  className = "",
}: {
  item?: HomeCardItem;
  provider?: Provider;
  className?: string;
}) {
  const isPlaceholder = item?.isPlaceholder === true;
  const listing =
    item && !item.isPlaceholder ? item.listing : undefined;

  const href = isPlaceholder
    ? "/aanbieders/nieuw"
    : provider
      ? `/activiteit/${provider.slug}`
      : listing
        ? `/activiteit/${slugify(listing.name)}`
        : "/aanbieders/nieuw";

  const name = provider?.name ?? listing?.name ?? "";
  const city = provider?.city ?? listing?.city ?? listing?.region ?? "";
  const price = provider?.price_from ?? listing?.price_from ?? 0;
  const featured = provider?.featured ?? listing?.featured ?? false;
  const initial = isPlaceholder ? "+" : name.charAt(0).toUpperCase();

  const hoverClass = isPlaceholder
    ? "cursor-default"
    : "cursor-pointer transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]";

  return (
    <Link
      href={href}
      className={`flex h-[320px] w-full flex-col overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white ${hoverClass} ${className}`}
    >
      <div className="relative flex h-[160px] shrink-0 items-center justify-center bg-[#f7f5f2]">
        <InitialCircle letter={initial} isPlaceholder={isPlaceholder} />
        {featured && !isPlaceholder && <ProBadge />}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {isPlaceholder ? (
          <PlaceholderLines />
        ) : (
          <>
            <p className="truncate text-[15px] font-semibold text-[#111827]">
              {name}
            </p>
            <p className="mt-0.5 text-[13px] text-[#9ca3af]">{city}</p>
            <p className="mt-1.5 text-[14px] font-semibold text-[#1D9E75]">
              &euro;{price}/pers
            </p>
            <div className="flex-1" />
            <span className="text-[13px] font-medium text-[#1D9E75]">
              Bekijk →
            </span>
          </>
        )}
      </div>
    </Link>
  );
}

function SearchCard({
  provider,
  className = "",
}: {
  provider: Provider;
  className?: string;
}) {
  const categorySlug = resolveCategorySlug(provider.category);

  return (
    <Link
      href={`/activiteit/${provider.slug}`}
      className={`flex h-[120px] w-full cursor-pointer overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${className}`}
    >
      <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center bg-[#f7f5f2]">
        <CategoryIcon
          slug={categorySlug}
          className="h-6 w-6"
          stroke="#b8b0a4"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3.5">
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

        <div className="mt-1 flex items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-[15px] font-bold text-[#111827]">
            {provider.name}
          </h2>
          <p className="shrink-0 text-[14px] font-semibold text-[#1D9E75]">
            &euro;{provider.price_from}/pers
          </p>
        </div>

        <p className="mt-0.5 truncate text-[13px] text-[#9ca3af]">
          {provider.city}
        </p>

        <span className="mt-auto text-[13px] font-medium text-[#1D9E75]">
          Bekijk →
        </span>
      </div>
    </Link>
  );
}

export default function ListingCard({
  layout = "grid",
  className = "",
  item,
  provider,
}: ListingCardProps) {
  if (layout === "search") {
    if (!provider) return null;
    return <SearchCard provider={provider} className={className} />;
  }

  return (
    <GridCard item={item} provider={provider} className={className} />
  );
}
