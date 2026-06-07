import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/admin";
import { ALL_SEO_SLUGS } from "@/lib/seo-content";
import { getActiveListings } from "@/lib/listings-server";
import { slugify } from "@/lib/utils";
import { TOOLS_LINKS } from "@/lib/tools-constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");
  const listings = await getActiveListings();

  const staticPages = [
    "",
    "/zoeken",
    "/calculator",
    "/dagassistent",
    "/stemmen/nieuw",
    "/prijzen",
    "/inloggen",
    "/aanbieders/nieuw",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const seoPages = ALL_SEO_SLUGS.map((slug) => ({
    url: `${base}/teambuilding/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const toolPages = TOOLS_LINKS.map((t) => ({
    url: `${base}${t.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const listingPages = listings.map((l) => ({
    url: `${base}/activiteit/${slugify(l.name)}`,
    lastModified: new Date(l.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...seoPages, ...toolPages, ...listingPages];
}
