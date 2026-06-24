import type { DbProfile } from "@/lib/listing-types";

export type PlanTier = "free" | "pro" | "none";

export const PLAN_DETAILS = {
  free: {
    label: "Gratis",
    price: 0,
    listingLimit: 1,
    badge: "Start hier",
    badgeClass: "bg-gray-600",
    features: [
      "1 activiteit",
      "Zichtbaar op kaart en zoekresultaten",
      "Aanvragen ontvangen via het platform",
      "Dashboard om je activiteit te beheren",
    ],
  },
  pro: {
    label: "Pro",
    price: 19,
    listingLimit: 1,
    badge: "Meer zichtbaarheid",
    badgeClass: "bg-[#1D9E75]",
    features: [
      "1 activiteit",
      "Featured plaatsing bovenaan zoekresultaten",
      "Prioriteit in AI aanbevelingen",
      "Pro badge op je activiteit",
      "Hogere positie op de kaart",
      "Maandelijks analytics rapport",
    ],
  },
} as const;

export function resolvePlanTier(profile: DbProfile | null): PlanTier {
  if (!profile) return "none";
  if (profile.is_pro || profile.plan_tier === "pro") return "pro";
  return "free";
}

export function getListingLimit(profile: DbProfile | null): number {
  const tier = resolvePlanTier(profile);
  if (tier === "none") return 0;
  return PLAN_DETAILS[tier].listingLimit;
}

export function getPlanBadgeLabel(profile: DbProfile | null): string | null {
  const tier = resolvePlanTier(profile);
  if (tier === "none") return null;
  if (tier === "free") return null;
  return `${PLAN_DETAILS.pro.label} plan`;
}

export function hasActivePlan(profile: DbProfile | null): boolean {
  return resolvePlanTier(profile) !== "none";
}

export function canCreateListing(profile: DbProfile | null): boolean {
  return resolvePlanTier(profile) === "free" || resolvePlanTier(profile) === "pro";
}
