import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCard from "@/components/BookingCard";
import MiniMap from "@/components/MiniMap";
import PageHeader from "@/components/PageHeader";
import ActivityCard from "@/components/ActivityCard";
import CategoryIcon, { resolveCategorySlug } from "@/components/CategoryIcon";
import { getCategoryStyle } from "@/lib/constants";
import {
  DEFAULT_OPENING_HOURS,
  getProviderBySlug,
  getRelatedProviders,
} from "@/lib/providers";

interface ActiviteitPageProps {
  params: Promise<{ slug: string }>;
}

function categoryHeroGradient(color: string): string {
  return `radial-gradient(at 30% 25%, ${color} 0%, ${color}dd 45%, #0f172a 100%)`;
}

export default async function ActiviteitPage({ params }: ActiviteitPageProps) {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);

  if (!provider) notFound();

  const related = getRelatedProviders(provider, 3);
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

      <main className="flex-1">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Ontdek", href: "/zoeken" },
            { label: provider.name },
          ]}
        />

        <div
          className="relative flex h-[320px] items-end overflow-hidden px-6 pb-8"
          style={{ background: categoryHeroGradient(style.color) }}
        >
          <div className="pointer-events-none absolute right-8 top-8 opacity-[0.12]">
            <CategoryIcon slug={categorySlug} className="h-32 w-32" />
          </div>
          {provider.featured && (
            <span
              className="absolute right-0 top-0 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{
                borderRadius: "0 0 0 12px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
              }}
            >
              Uitgelicht
            </span>
          )}
          <div className="relative mx-auto w-full max-w-6xl">
            <p className="text-sm text-white/80">
              {provider.city} · {provider.category}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-[40px]">
              {provider.name}
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#1D9E75]/10 px-3 py-1 text-sm font-medium text-[#1D9E75]">
                    {provider.category}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    {indoorLabel}
                  </span>
                </div>
                <p className="mt-4 text-lg text-gray-500">
                  {provider.city}, {provider.region}
                </p>
              </div>

              <section>
                <h2 className="text-xl font-semibold text-gray-900">
                  Over deze activiteit
                </h2>
                <p className="mt-4 leading-relaxed text-gray-600">
                  {provider.description}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900">
                  Wat is inbegrepen
                </h2>
                <ul className="mt-4 space-y-2">
                  {provider.includes.map((item) => (
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                  {DEFAULT_OPENING_HOURS.map((row) => (
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
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ActivityCard key={p.id} provider={p} showFavorite />
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
