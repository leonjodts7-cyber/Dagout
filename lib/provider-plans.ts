import type { DbProfile } from "@/lib/listing-types";

export type PlanTier = "basis" | "pro" | "none";

export const PLAN_DETAILS = {
  basis: {
    label: "Basis",
    price: 14,
    listingLimit: 1,
    badge: "Meest gekozen",
    badgeClass: "bg-[#1D9E75]",
    features: [
      "1 listing",
      "Zichtbaar op kaart en zoekresultaten",
      "Aanvragen ontvangen via het platform",
      "Dashboard met statistieken",
      "Basis positie in zoekresultaten",
    ],
  },
  pro: {
    label: "Pro",
    price: 19,
    listingLimit: 1,
    badge: "Aanbevolen",
    badgeClass: "bg-[#1D9E75]",
    features: [
      "1 listing",
      "Featured plaatsing bovenaan zoekresultaten",
      "Prioriteit in AI aanbevelingen",
      "Pro badge op je listing",
      "Hogere positie op de kaart",
      "Maandelijkse analytics rapport",
    ],
  },
} as const;

export function resolvePlanTier(profile: DbProfile | null): PlanTier {
  if (!profile) return "none";
  if (profile.is_pro || profile.plan_tier === "pro") return "pro";
  if (profile.plan_tier === "basis") return "basis";
  return "none";
}

export function getListingLimit(profile: DbProfile | null): number {
  const tier = resolvePlanTier(profile);
  if (tier === "none") return 0;
  return PLAN_DETAILS[tier].listingLimit;
}

export function getPlanBadgeLabel(profile: DbProfile | null): string | null {
  const tier = resolvePlanTier(profile);
  if (tier === "none") return null;
  return `${PLAN_DETAILS[tier].label} plan`;
}

export function hasActivePlan(profile: DbProfile | null): boolean {
  return resolvePlanTier(profile) !== "none";
}
