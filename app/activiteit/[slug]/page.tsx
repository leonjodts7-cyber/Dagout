import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import BookingCard from "@/components/BookingCard";
import MiniMap from "@/components/MiniMap";
import PageHeader from "@/components/PageHeader";
import ListingCard from "@/components/ListingCard";
import CategoryIcon, { resolveCategorySlug } from "@/components/CategoryIcon";
import { getCategoryStyle } from "@/lib/constants";
import { DEFAULT_OPENING_HOURS } from "@/lib/providers";
import {
  getListingExtras,
  getProviderBySlugUnified,
  getRelatedProviders,
} from "@/lib/providers-unified";

interface ActiviteitPageProps {
  params: Promise<{ slug: string }>;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours} uur`;
  return `${hours}u ${rest}min`;
}

export default async function ActiviteitPage({ params }: ActiviteitPageProps) {
  const { slug } = await params;
  const provider = await getProviderBySlugUnified(slug);

  if (!provider || !provider.active) notFound();

  const [related, extras] = await Promise.all([
    getRelatedProviders(provider, 3),
    provider.listing_id
      ? getListingExtras(provider.listing_id)
      : Promise.resolve(null),
  ]);

  const includes =
    extras?.includes && extras.includes.length > 0
      ? extras.includes
      : provider.includes;
  const openingHours =
    extras?.openingHours && extras.openingHours.length > 0
      ? extras.openingHours
      : DEFAULT_OPENING_HOURS;

  const style = getCategoryStyle(provider.category);
  const categorySlug = resolveCategorySlug(provider.category);
  const indoorLabel =
    provider.indoor_outdoor === "indoor"
      ? "Binnen"
      : provider.indoor_outdoor === "outdoor"
        ? "Buiten"
        : "Binnen & buiten";

  return (
    <>
      <Navbar />
      <BackButton />

      <main className="flex-1">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Ontdek", href: "/zoeken" },
            { label: provider.name },
          ]}
        />

        <div
          className="relative mt-2 flex h-[240px] items-end overflow-hidden px-6 pb-8"
          style={{ backgroundColor: style.color }}
        >
          <div className="pointer-events-none absolute right-8 top-8 opacity-[0.15]">
            <CategoryIcon slug={categorySlug} className="h-28 w-28" stroke="#fff" />
          </div>
          {provider.featured && (
            <span
              className="absolute right-0 top-0 bg-[#1D9E75] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ borderRadius: "0 0 0 12px" }}
            >
              PRO
            </span>
          )}
          <div className="relative mx-auto w-full max-w-6xl">
            <p className="text-sm text-white/85">{provider.city}</p>
            <h1 className="mt-1 text-3xl font-bold text-white sm:text-[40px]">
              {provider.name}
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <section>
                <h2 className="text-xl font-semibold text-gray-900">
                  Over deze activiteit
                </h2>
                <p className="mt-4 leading-relaxed text-gray-600">
                  {provider.description}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900">Details</h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Duur
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {formatDuration(provider.duration_minutes)}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Groepsgrootte
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {provider.min_persons}–{provider.max_persons} personen
                    </dd>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Locatie
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {indoorLabel}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900">
                  Wat is inbegrepen
                </h2>
                <ul className="mt-4 space-y-2">
                  {includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <svg
                        className="h-5 w-5 shrink-0 text-[#1D9E75]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900">
                  Openingsuren
                </h2>
                <ul className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-100">
                  {openingHours.map((row) => (
                    <li
                      key={row.day}
                      className="flex justify-between px-4 py-2.5 text-sm"
                    >
                      <span className="font-medium text-gray-700">{row.day}</span>
                      <span className="text-gray-500">
                        {row.closed
                          ? "Gesloten"
                          : `${row.open} – ${row.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900">Locatie</h2>
                <p className="mt-2 text-sm text-gray-500">
                  {provider.city}, {provider.region}
                </p>
                <div className="mt-4 h-64 overflow-hidden rounded-xl">
                  <MiniMap provider={provider} />
                </div>
              </section>
            </div>

            <div>
              <BookingCard provider={provider} />
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16 border-t border-gray-100 pt-12">
              <h2 className="text-2xl font-bold text-gray-900">
                Gerelateerde activiteiten
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <ListingCard key={p.id} provider={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
