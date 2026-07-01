import type { DbListingPublic } from "@/lib/listings-server";
import {
  getActiveListings,
  getFeaturedListings,
  getListingsByCategory,
  getListingsByCategories,
} from "@/lib/listings-server";

export type HomeCardItem =
  | { isPlaceholder: true }
  | { isPlaceholder: false; listing: DbListingPublic };

export function padListings(
  listings: DbListingPublic[],
  targetCount: number
): HomeCardItem[] {
  const items: HomeCardItem[] = listings.map((listing) => ({
    isPlaceholder: false,
    listing,
  }));

  while (items.length < targetCount) {
    items.push({ isPlaceholder: true });
  }

  return items.slice(0, targetCount);
}

export async function getHomeFeaturedCards(
  minCount = 6
): Promise<HomeCardItem[]> {
  const listings = await getFeaturedListings(minCount);
  return padListings(listings, minCount);
}

export async function getHomeCategoryCards(
  category: string,
  count = 8
): Promise<HomeCardItem[]> {
  const listings = await getListingsByCategory(category, count);
  return padListings(listings, count);
}

export async function getHomeMultiCategoryCards(
  categories: string[],
  count = 8
): Promise<HomeCardItem[]> {
  const listings = await getListingsByCategories(categories, count);
  return padListings(listings, count);
}

export { getListingsByCategory, getFeaturedListings, getActiveListings };
