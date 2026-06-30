import { CATEGORY_IMAGES } from "@/lib/constants";
import { getCoordsForCity } from "@/lib/geocoding";
import {
  getActiveListingBySlug,
  getActiveListings,
  getListingsByIds,
  type DbListingPublic,
} from "@/lib/listings-server";
import type { Provider } from "@/lib/types";
import { slugify } from "@/lib/utils";

export type SortOption = "relevant" | "price-asc" | "price-desc" | "rating";

const DEFAULT_INCLUDES = [
  "Professionele begeleiding",
  "Veiligheidsbriefing",
  "Alle benodigde materialen",
];

function normalizeRegion(region: string): string {
  const map: Record<string, string> = {
    gent: "Gent",
    antwerpen: "Antwerpen",
    brussel: "Brussel",
    mechelen: "Mechelen",
    leuven: "Leuven",
    brugge: "Brugge",
    hasselt: "Hasselt",
    kortrijk: "Kortrijk",
  };
  const lower = region.toLowerCase();
  return map[lower] ?? region.charAt(0).toUpperCase() + region.slice(1);
}

function parseDurationMinutes(duration: string | null | undefined): number {
  if (!duration) return 120;
  const match = duration.match(/(\d+)/);
  if (!match) return 120;
  const value = parseInt(match[1], 10);
  if (duration.includes("dag") || duration.includes("day")) return value * 480;
  return value * 60;
}

function mapIndoorOutdoor(
  value: string | null | undefined
): Provider["indoor_outdoor"] {
  if (value === "indoor" || value === "outdoor" || value === "both") {
    return value;
  }
  return "both";
}

export function dbListingToProvider(listing: DbListingPublic): Provider {
  const slug = slugify(listing.name);
  const city = listing.city ?? listing.region ?? "Vlaanderen";
  const region = listing.region ? normalizeRegion(listing.region) : city;
  const [lat, lng] = getCoordsForCity(city);
  const imageUrl =
    listing.image_urls?.[0] ?? CATEGORY_IMAGES[listing.category] ?? null;

  return {
    id: listing.id,
    listing_id: listing.id,
    name: listing.name,
    slug,
    category: listing.category,
    region,
    city,
    description:
      listing.full_description?.trim() ||
      listing.short_description ||
      "Meer informatie volgt binnenkort.",
    short_description: listing.short_description,
    price_from: listing.price_from ?? 0,
    price_per_person: true,
    min_persons: listing.min_persons ?? 6,
    max_persons: listing.max_persons ?? 50,
    duration_minutes: parseDurationMinutes(listing.duration),
    indoor_outdoor: mapIndoorOutdoor(listing.indoor_outdoor),
    lat,
    lng,
    website: listing.website ?? null,
    phone: listing.phone ?? null,
    email: listing.contact_email ?? null,
    image_url: imageUrl,
    featured: listing.featured ?? false,
    active: listing.status === "active",
    rating: 4.7,
    includes: [...DEFAULT_INCLUDES],
  };
}

function regionMatches(providerRegion: string, filter: string): boolean {
  return (
    providerRegion.toLowerCase() === filter.toLowerCase() ||
    normalizeRegion(providerRegion).toLowerCase() === filter.toLowerCase()
  );
}

function matchesPersonen(provider: Provider, personen?: string): boolean {
  if (!personen) return true;
  switch (personen) {
    case "1-10":
      return provider.max_persons >= 1 && provider.min_persons <= 10;
    case "10-25":
      return provider.max_persons >= 10 && provider.min_persons <= 25;
    case "25-50":
      return provider.max_persons >= 25 && provider.min_persons <= 50;
    case "50+":
      return provider.max_persons >= 50;
    default:
      return true;
  }
}

function matchesOmgeving(provider: Provider, omgeving?: string): boolean {
  if (!omgeving) return true;
  if (omgeving === "both") return provider.indoor_outdoor === "both";
  return (
    provider.indoor_outdoor === omgeving ||
    provider.indoor_outdoor === "both"
  );
}

function comparePlanVisibility(a: Provider, b: Provider): number {
  const rank = (p: Provider) => (p.featured ? 2 : 1);
  const diff = rank(b) - rank(a);
  if (diff !== 0) return diff;
  return b.rating - a.rating;
}

export function sortProviders(
  providers: Provider[],
  sort: SortOption
): Provider[] {
  const copy = [...providers];
  switch (sort) {
    case "price-asc":
      return copy.sort(
        (a, b) => comparePlanVisibility(a, b) || a.price_from - b.price_from
      );
    case "price-desc":
      return copy.sort(
        (a, b) => comparePlanVisibility(a, b) || b.price_from - a.price_from
      );
    case "rating":
      return copy.sort(
        (a, b) => comparePlanVisibility(a, b) || b.rating - a.rating
      );
    case "relevant":
    default:
      return copy.sort(comparePlanVisibility);
  }
}

export async function getActiveProviders(): Promise<Provider[]> {
  const listings = await getActiveListings();
  return listings.map(dbListingToProvider);
}

export async function searchAllProviders(
  query?: string,
  region?: string,
  category?: string,
  personen?: string,
  omgeving?: string
): Promise<Provider[]> {
  let listings = await getActiveListings({
    region: region || undefined,
    category: category || undefined,
  });

  let providers = listings.map(dbListingToProvider);

  if (query?.trim()) {
    const q = query.toLowerCase();
    providers = providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q)
    );
  }

  if (region) {
    providers = providers.filter((p) => regionMatches(p.region, region));
  }

  if (category) {
    providers = providers.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  return providers.filter(
    (p) => matchesPersonen(p, personen) && matchesOmgeving(p, omgeving)
  );
}

export async function getProviderBySlugUnified(
  slug: string
): Promise<Provider | null> {
  const listing = await getActiveListingBySlug(slug);
  if (!listing) return null;
  return dbListingToProvider(listing);
}

export async function getProviderByIdUnified(
  id: string
): Promise<Provider | null> {
  const listings = await getListingsByIds([id]);
  const listing = listings[0];
  if (!listing) return null;
  return dbListingToProvider(listing);
}

export async function getProvidersByIds(ids: string[]): Promise<Provider[]> {
  const listings = await getListingsByIds(ids);
  return listings.map(dbListingToProvider);
}

export async function getRelatedProviders(
  provider: Provider,
  limit = 3
): Promise<Provider[]> {
  const all = await searchAllProviders(undefined, undefined, provider.category);
  return all.filter((p) => p.slug !== provider.slug).slice(0, limit);
}

export async function getProvidersForAi() {
  const providers = await getActiveProviders();
  return providers.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    region: p.region,
    city: p.city,
    price_from: p.price_from,
    min_persons: p.min_persons,
    max_persons: p.max_persons,
    duration_minutes: p.duration_minutes,
    indoor_outdoor: p.indoor_outdoor,
    featured: p.featured,
  }));
}

export interface ListingExtras {
  includes: string[];
  openingHours: { day: string; open: string; close: string; closed: boolean }[];
}

export async function getListingExtras(
  listingId: string
): Promise<ListingExtras | null> {
  try {
    const { getSupabaseAdmin } = await import("@/lib/supabase/admin");
    const supabase = getSupabaseAdmin();

    const [{ data: includes }, { data: hours }] = await Promise.all([
      supabase
        .from("listing_includes")
        .select("item")
        .eq("listing_id", listingId),
      supabase
        .from("opening_hours")
        .select("day_of_week, open_time, close_time, is_closed")
        .eq("listing_id", listingId)
        .order("day_of_week"),
    ]);

    const dayNames = [
      "Maandag",
      "Dinsdag",
      "Woensdag",
      "Donderdag",
      "Vrijdag",
      "Zaterdag",
      "Zondag",
    ];

    return {
      includes: (includes ?? []).map((i) => i.item as string),
      openingHours: (hours ?? []).map((h) => ({
        day: dayNames[h.day_of_week] ?? `Dag ${h.day_of_week}`,
        open: h.open_time?.slice(0, 5) ?? "",
        close: h.close_time?.slice(0, 5) ?? "",
        closed: h.is_closed ?? false,
      })),
    };
  } catch {
    return null;
  }
}
