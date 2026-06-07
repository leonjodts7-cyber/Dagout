import { CATEGORY_IMAGES } from "@/lib/constants";
import { getCoordsForCity } from "@/lib/geocoding";
import {
  getActiveListings,
  type DbListingPublic,
} from "@/lib/listings-server";
import {
  MOCK_PROVIDERS,
  getProviderBySlug as getMockBySlug,
  searchProviders as searchMock,
} from "@/lib/providers";
import type { Provider } from "@/lib/types";
import { slugify } from "@/lib/utils";

const DEFAULT_INCLUDES = [
  "Professionele begeleiding",
  "Veiligheidsbriefing",
  "Alle benodigde materialen",
];

export function dbListingToProvider(listing: DbListingPublic): Provider {
  const slug = slugify(listing.name);
  const city = listing.city ?? listing.region ?? "Vlaanderen";
  const region = listing.region ?? city;
  const [lat, lng] = getCoordsForCity(city);
  const imageUrl =
    listing.image_urls?.[0] ??
    CATEGORY_IMAGES[listing.category] ??
    null;

  return {
    id: listing.id,
    listing_id: listing.id,
    name: listing.name,
    slug,
    category: listing.category,
    region,
    city,
    description: listing.short_description,
    short_description: listing.short_description,
    price_from: listing.price_from ?? 0,
    price_per_person: true,
    min_persons: 6,
    max_persons: 50,
    duration_minutes: 120,
    indoor_outdoor: "both",
    lat,
    lng,
    website: null,
    phone: null,
    email: listing.contact_email,
    image_url: imageUrl,
    featured: listing.featured ?? false,
    active: listing.status === "active",
    rating: 4.7,
    includes: [...DEFAULT_INCLUDES],
  };
}

function mergeProviders(mock: Provider[], db: Provider[]): Provider[] {
  const seen = new Set<string>();
  const merged: Provider[] = [];

  for (const p of [...db, ...mock]) {
    if (!p.active || seen.has(p.slug)) continue;
    seen.add(p.slug);
    merged.push(p);
  }

  return merged;
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

function applyExtraFilters(
  providers: Provider[],
  personen?: string,
  omgeving?: string
): Provider[] {
  return providers.filter(
    (p) => matchesPersonen(p, personen) && matchesOmgeving(p, omgeving)
  );
}

export async function searchAllProviders(
  query?: string,
  region?: string,
  category?: string,
  personen?: string,
  omgeving?: string
): Promise<Provider[]> {
  const mock = searchMock(query, region, category);
  let dbListings: DbListingPublic[] = [];

  try {
    dbListings = await getActiveListings({
      region: region || undefined,
      category: category || undefined,
    });
  } catch {
    dbListings = [];
  }

  let dbProviders = dbListings.map(dbListingToProvider);

  if (query?.trim()) {
    const q = query.toLowerCase();
    dbProviders = dbProviders.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    );
  }

  const merged = mergeProviders(mock, dbProviders);
  return applyExtraFilters(merged, personen, omgeving);
}

export async function getProviderBySlugUnified(
  slug: string
): Promise<Provider | null> {
  const mock = getMockBySlug(slug);
  if (mock) return mock;

  try {
    const listings = await getActiveListings();
    const match = listings.find((l) => slugify(l.name) === slug);
    if (match) return dbListingToProvider(match);
  } catch {
    // fallback naar mock-only
  }

  return null;
}

export async function getRelatedProviders(
  provider: Provider,
  limit = 3
): Promise<Provider[]> {
  const all = await searchAllProviders(undefined, undefined, provider.category);
  return all.filter((p) => p.slug !== provider.slug).slice(0, limit);
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
