import type { DbProfile } from "@/lib/listing-types";

export type PlanTier = "basis" | "pro" | "none";

export const PLAN_DETAILS = {
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
  if (!profile) return "none";
  if (profile.is_pro || profile.plan_tier === "pro") return "pro";
  if (profile.plan_tier === "basis") return "basis";
  return "none";
}

export function getListingLimit(profile: DbProfile | null): number {
  const tier = resolvePlanTier(profile);
  if (tier === "none") return 0;
  const limit = PLAN_DETAILS[tier].listingLimit;
  return limit === Infinity ? 999 : limit;
}

export function getPlanBadgeLabel(profile: DbProfile | null): string | null {
  const tier = resolvePlanTier(profile);
  if (tier === "none") return null;
  return `${PLAN_DETAILS[tier].label} plan`;
}

export function hasActivePlan(profile: DbProfile | null): boolean {
  return resolvePlanTier(profile) !== "none";
}
