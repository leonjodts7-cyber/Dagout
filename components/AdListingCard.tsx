import Link from "next/link";
import type { HomeCardItem } from "@/lib/home-listings";
import { getCategoryCardAccent } from "@/lib/constants";
import { slugify } from "@/lib/utils";

const BEIGE = {
  surface: "#f3f0eb",
  avatar: "#e5e0d8",
  muted: "#a89f94",
  placeholder: "#c4bdb5",
};

interface AdListingCardProps {
  item: HomeCardItem;
  variant?: "teaser" | "full";
  className?: string;
}

function PlaceholderLines() {
  return (
    <div className="space-y-0">
      <div
        className="h-3.5 w-[70%] rounded"
        style={{ backgroundColor: BEIGE.surface }}
      />
      <div
        className="mt-1.5 h-3 w-[50%] rounded"
        style={{ backgroundColor: BEIGE.surface }}
      />
      <div
        className="mt-1 h-3 w-[35%] rounded"
        style={{ backgroundColor: BEIGE.surface }}
      />
    </div>
  );
}

export default function AdListingCard({
  item,
  variant = "full",
  className = "",
}: AdListingCardProps) {
  const isPlaceholder = item.isPlaceholder;
  const href = isPlaceholder
    ? "/aanbieders/nieuw"
    : `/activiteit/${slugify(item.listing.name)}`;

  const initial = isPlaceholder
    ? "+"
    : item.listing.name.charAt(0).toUpperCase();
  const featured = !isPlaceholder && item.listing.featured;
  const showTeaser = variant === "teaser" || isPlaceholder;

  const categoryAccent = !isPlaceholder
    ? getCategoryCardAccent(item.listing.category)
    : null;

  const hoverClass = isPlaceholder
    ? "cursor-default"
    : "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]";

  const borderClass = featured
    ? "border-[1.5px] border-[#1D9E75] shadow-[0_0_0_3px_rgba(29,158,117,0.08)]"
    : "border border-[#e5e7eb]";

  return (
    <Link
      href={href}
      className={`block overflow-hidden rounded-[14px] bg-white ${borderClass} ${hoverClass} ${className}`}
    >
      {categoryAccent && (
        <div
          className="h-[4px] w-full"
          style={{ backgroundColor: categoryAccent.accent }}
        />
      )}

      <div
        className="relative flex h-[140px] items-center justify-center"
        style={{
          backgroundColor: categoryAccent ? "#fafafa" : BEIGE.surface,
        }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: categoryAccent?.avatarBg ?? BEIGE.avatar,
          }}
        >
          <span
            className="text-[22px] font-semibold"
            style={{
              color: isPlaceholder
                ? BEIGE.placeholder
                : (categoryAccent?.avatarColor ?? BEIGE.muted),
              fontWeight: isPlaceholder ? 300 : 600,
            }}
          >
            {initial}
          </span>
        </div>
        {featured && (
          <span
            className="absolute right-0 top-0 bg-[#1D9E75] px-2 py-0.5 text-[10px] font-bold text-white"
            style={{ borderRadius: "0 14px 0 6px" }}
          >
            PRO
          </span>
        )}
      </div>

      <div className="p-3">
        {showTeaser ? (
          <PlaceholderLines />
        ) : (
          <>
            <p className="text-sm font-semibold text-[#111827]">
              {item.listing.name}
            </p>
            <p className="mt-0.5 text-xs text-[#9ca3af]">
              {item.listing.city ?? item.listing.region}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[#1D9E75]">
              Vanaf &euro;{item.listing.price_from ?? 0}/pers
            </p>
            <span className="mt-1.5 inline-block text-xs text-[#1D9E75]">
              Bekijk →
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
