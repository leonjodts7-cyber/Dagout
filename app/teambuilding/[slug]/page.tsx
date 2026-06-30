import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getActiveListings } from "@/lib/listings-server";
import {
  REGION_SEO,
  REGION_SLUGS,
  CATEGORY_SLUG_MAP,
  getCategorySeo,
  isCategorySlug,
  isRegionSlug,
} from "@/lib/seo-content";
import { slugify } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const regions = Object.keys(REGION_SLUGS);
  const categories = ["kajakken", "escape-room", "kookworkshop", "lasergame", "outdoor", "wellness"];
  return [...regions, ...categories].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isRegionSlug(slug)) {
    const seo = REGION_SEO[slug];
    return { title: seo.title, description: seo.description };
  }
  if (isCategorySlug(slug)) {
    const seo = getCategorySeo(slug);
    if (!seo) return {};
    return { title: seo.title, description: seo.description };
  }
  return {};
}

export default async function TeambuildingSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const isRegion = isRegionSlug(slug);
  const isCategory = isCategorySlug(slug);

  if (!isRegion && !isCategory) notFound();

  const regionName = isRegion ? REGION_SLUGS[slug] : undefined;
  const categoryName = isCategory ? CATEGORY_SLUG_MAP[slug] : undefined;

  const listings = await getActiveListings(
    isRegion
      ? { region: regionName }
      : isCategory
        ? { category: categoryName }
        : undefined
  );

  const seo = isRegion
    ? REGION_SEO[slug]
    : getCategorySeo(slug);

  if (!seo) notFound();

  const zoekUrl = isRegion
    ? `/zoeken?regio=${encodeURIComponent(regionName!)}`
    : `/zoeken?categorie=${encodeURIComponent(categoryName!)}`;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="hero-pattern px-6 py-16 text-white">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-extrabold sm:text-4xl">{seo.intro}</h1>
            <p className="mt-4 max-w-2xl text-white/75">{seo.description}</p>
            <Link
              href={zoekUrl}
              className="mt-6 inline-flex rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white hover:bg-[#178a66]"
            >
              Bekijk alle activiteiten &rarr;
            </Link>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-semibold text-gray-900">
              {listings.length === 0
                ? "Binnenkort beschikbaar"
                : `${listings.length} activiteiten gevonden`}
            </h2>
            {listings.length === 0 ? (
              <p className="mt-4 text-gray-500">
                Er zijn nog geen actieve activiteiten in deze categorie.{" "}
                <Link href="/aanbieders/nieuw" className="text-[#1D9E75] hover:underline">
                  Lijst je activiteit als eerste
                </Link>
              </p>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((l) => (
                  <Link
                    key={l.id}
                    href={`/activiteit/${slugify(l.name)}`}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#1D9E75]/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{l.name}</h3>
                      {l.featured && (
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {l.city ?? l.region} · {l.category}
                    </p>
                    {l.price_from != null && (
                      <p className="mt-2 font-semibold text-[#1D9E75]">
                        Vanaf €{l.price_from}/pers
                      </p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {l.short_description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-gray-100 bg-gray-50 px-6 py-12">
          <div className="mx-auto max-w-3xl prose prose-gray">
            <p className="text-gray-600 leading-relaxed">{seo.body}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
