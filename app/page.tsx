import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import FilterSearchBar from "@/components/FilterSearchBar";
import CategoryIcon from "@/components/CategoryIcon";
import PopularActivityCard from "@/components/PopularActivityCard";
import ForProvidersCTA from "@/components/ForProvidersCTA";
import ToolsSection from "@/components/ToolsSection";
import { CATEGORIES } from "@/lib/constants";
import { getPopularProviders } from "@/lib/providers";

export default function HomePage() {
  const popularProviders = getPopularProviders();

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Sectie A — AI zoeken */}
        <section className="relative overflow-hidden bg-[#0a2a1f] px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#1D9E75]/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Beschrijf jullie perfecte dag.
            </h1>
            <p className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight text-[#1D9E75] sm:text-5xl lg:text-6xl">
              Onze AI regelt de rest.
            </p>
            <div className="mx-auto mt-12 w-full max-w-3xl">
              <HeroSearch />
            </div>
          </div>
        </section>

        {/* Sectie B — Filter zoeken */}
        <section className="border-b border-gray-100 bg-white px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              Of zoek op filters
            </h2>
            <div className="mt-8">
              <FilterSearchBar />
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-gray-500">
              Gebruik filters voor een snelle selectie, of beschrijf jullie dag
              hierboven voor AI-aanbevelingen
            </p>
          </div>
        </section>

        {/* Categorieën */}
        <section className="bg-[#f8f9fa] px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Wat zoeken jullie?
            </h2>
            <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/zoeken?categorie=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col items-center rounded-2xl border border-gray-200/60 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:border-[#1D9E75] hover:bg-[#1D9E75] hover:shadow-lg sm:p-10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1D9E75]/10 transition-all duration-300 group-hover:bg-white/20">
                    <CategoryIcon
                      slug={category.slug}
                      className="h-10 w-10 text-[#1D9E75] transition-colors duration-300 group-hover:text-white"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-white sm:text-xl">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Populaire activiteiten */}
        <section className="bg-white px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Ontdek wat mogelijk is
              </h2>
              <Link
                href="/zoeken"
                className="text-sm font-semibold text-[#1D9E75] transition-colors hover:text-[#178a66]"
              >
                Bekijk alles &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {popularProviders.map((provider) => (
                <PopularActivityCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </section>

        <ToolsSection />
        <ForProvidersCTA />
      </main>

      <Footer />
    </>
  );
}
