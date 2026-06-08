import type { DbProfile } from "@/lib/listing-types";

export type PlanTier = "free" | "basis" | "pro";

export const PLAN_DETAILS = {
  free: {
    label: "Gratis",
    price: 0,
    listingLimit: 1,
    features: [
      "1 listing",
      "Basis zichtbaarheid",
      "Aanvragen ontvangen",
      "Dashboard toegang",
    ],
  },
  basis: {
    label: "Basis",
    price: 14,
    listingLimit: 1,
    features: [
      "1 listing",
      "Basis zichtbaarheid op kaart",
      "Aanvragen ontvangen",
      "Dashboard toegang",
    ],
  },
  pro: {
    label: "Pro",
    price: 19,
    listingLimit: Infinity,
    features: [
      "Onbeperkt listings",
      "Featured plaatsing bovenaan",
      "AI prioriteit",
      "Analytics",
      "Pro badge",
    ],
  },
} as const;

export function resolvePlanTier(profile: DbProfile | null): PlanTier {
  if (!profile) return "free";
  if (profile.is_pro || profile.plan_tier === "pro") return "pro";
  if (profile.plan_tier === "basis") return "basis";
  return "free";
}

export function getListingLimit(profile: DbProfile | null): number {
  const tier = resolvePlanTier(profile);
  const limit = PLAN_DETAILS[tier].listingLimit;
  return limit === Infinity ? 999 : limit;
}

export function getPlanBadgeLabel(profile: DbProfile | null): string {
  return `${PLAN_DETAILS[resolvePlanTier(profile)].label} plan`;
}
