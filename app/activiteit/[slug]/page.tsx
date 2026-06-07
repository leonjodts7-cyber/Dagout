import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCard from "@/components/BookingCard";
import MiniMap from "@/components/MiniMap";
import PageHeader from "@/components/PageHeader";
import ActivityCard from "@/components/ActivityCard";
import {
  DEFAULT_OPENING_HOURS,
  getProviderBySlug,
  getRelatedProviders,
} from "@/lib/providers";

interface ActiviteitPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ActiviteitPage({ params }: ActiviteitPageProps) {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);

  if (!provider) notFound();

  const related = getRelatedProviders(provider, 3);
  const imageUrl = provider.image_url;
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

        {imageUrl && (
          <div className="relative h-72 w-full sm:h-[28rem]">
            <Image
              src={imageUrl}
              alt={provider.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mt-4 grid gap-10 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#1D9E75]/10 px-3 py-1 text-sm font-medium text-[#1D9E75]">
                    {provider.category}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    {indoorLabel}
                  </span>
                  <span className="text-sm text-amber-500">
                    {provider.rating} ★
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {provider.name}
                </h1>
                <p className="mt-2 text-lg text-gray-500">
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

              <section>
                <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
                <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    Wees de eerste om te reviewen
                  </p>
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
