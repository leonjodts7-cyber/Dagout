import type { SupabaseClient } from "@supabase/supabase-js";
import {
  defaultOpeningHours,
  type ListingFormData,
  type OpeningHourRow,
} from "@/lib/listing-types";

export interface LoadedListing {
  id: string;
  form: ListingFormData;
  existingImageUrls: string[];
}

export async function loadListingForEdit(
  supabase: SupabaseClient,
  listingId: string,
  userId: string
): Promise<LoadedListing | null> {
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !listing) return null;

  const [{ data: hours }, { data: includes }, { data: tags }] =
    await Promise.all([
      supabase
        .from("opening_hours")
        .select("*")
        .eq("listing_id", listingId)
        .order("day_of_week"),
      supabase
        .from("listing_includes")
        .select("item, sort_order")
        .eq("listing_id", listingId)
        .order("sort_order"),
      supabase
        .from("listing_tags")
        .select("tag")
        .eq("listing_id", listingId),
    ]);

  const openingHours: OpeningHourRow[] = defaultOpeningHours().map((row) => {
    const dbRow = (hours ?? []).find((h) => h.day_of_week === row.dayOfWeek);
    if (!dbRow) return row;
    return {
      ...row,
      isClosed: dbRow.is_closed,
      timeFrom: dbRow.time_from?.slice(0, 5) ?? row.timeFrom,
      timeTo: dbRow.time_to?.slice(0, 5) ?? row.timeTo,
    };
  });

  const form: ListingFormData = {
    name: listing.name ?? "",
    category: listing.category ?? "",
    shortDescription: listing.short_description ?? "",
    fullDescription: listing.full_description ?? "",
    indoorOutdoor: listing.indoor_outdoor ?? "outdoor",
    companyName: listing.company_name ?? "",
    streetAddress: listing.street_address ?? "",
    city: listing.city ?? "",
    postalCode: listing.postal_code ?? "",
    region: listing.region ?? "",
    website: listing.website ?? "",
    phone: listing.phone ?? "",
    contactEmail: listing.contact_email ?? "",
    minPersons: listing.min_persons ?? 6,
    maxPersons: listing.max_persons ?? 20,
    duration: listing.duration ?? "2u",
    priceFrom: listing.price_from != null ? String(listing.price_from) : "",
    priceOnRequest: listing.price_on_request ?? false,
    openingHours,
    includes: (includes ?? []).map((i) => i.item as string),
    tags: (tags ?? []).map((t) => t.tag as string),
    languages: listing.languages ?? ["Nederlands"],
    certificates: listing.certificates ?? "",
    videoUrl: listing.video_url ?? "",
  };

  return {
    id: listing.id as string,
    form,
    existingImageUrls: (listing.image_urls as string[]) ?? [],
  };
}
