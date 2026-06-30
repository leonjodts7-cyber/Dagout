import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export interface DbListingPublic {
  id: string;
  name: string;
  category: string;
  region: string | null;
  city: string | null;
  short_description: string;
  full_description: string | null;
  price_from: number | null;
  min_persons: number | null;
  max_persons: number | null;
  duration: string | null;
  indoor_outdoor: string | null;
  image_urls: string[] | null;
  status: string;
  featured: boolean | null;
  user_id: string;
  created_at: string;
  contact_email: string | null;
  company_name: string | null;
  website: string | null;
  phone: string | null;
  rejection_reason: string | null;
}

const LISTING_SELECT =
  "id, name, category, region, city, short_description, full_description, price_from, min_persons, max_persons, duration, indoor_outdoor, image_urls, status, featured, user_id, created_at, contact_email, company_name, website, phone, rejection_reason";

export async function getActiveListings(filters?: {
  region?: string;
  category?: string;
}): Promise<DbListingPublic[]> {
  try {
    const supabase = getSupabaseAdmin();
    let query = supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active");

    if (filters?.region) {
      query = query.ilike("region", filters.region);
    }
    if (filters?.category) {
      query = query.ilike("category", filters.category);
    }

    const { data } = await query.order("created_at", { ascending: false });
    return (data as DbListingPublic[]) ?? [];
  } catch {
    return [];
  }
}

export async function getActiveListingBySlug(
  slug: string
): Promise<DbListingPublic | null> {
  try {
    const listings = await getActiveListings();
    return listings.find((l) => slugify(l.name) === slug) ?? null;
  } catch {
    return null;
  }
}

export async function getListingsByIds(
  ids: string[]
): Promise<DbListingPublic[]> {
  if (ids.length === 0) return [];

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .in("id", ids);

    return (data as DbListingPublic[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllListingsAdmin(): Promise<
  (DbListingPublic & {
    profiles?: {
      first_name: string | null;
      last_name: string | null;
      company_name: string | null;
    } | null;
  })[]
> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("listings")
    .select("*, profiles(first_name, last_name, company_name)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export function listingPublicUrl(name: string): string {
  return `/activiteit/${slugify(name)}`;
}
