import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import FilterSearchBar from "@/components/FilterSearchBar";
import CategoryPhotoGrid from "@/components/CategoryPhotoGrid";
import PopularActivityCard from "@/components/PopularActivityCard";
import WhyDagout from "@/components/WhyDagout";
import ToolsSection from "@/components/ToolsSection";
import ForProvidersCTA from "@/components/ForProvidersCTA";
import Testimonials from "@/components/Testimonials";
import { getPopularProviders } from "@/lib/providers";

export default function HomePage() {
  const popularProviders = getPopularProviders();

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="hero-premium relative overflow-hidden px-6 pb-0 pt-16 sm:pt-24">
          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="hero-title text-white">
              Beschrijf jullie perfecte dag.
            </h1>
            <p className="hero-title mt-2 text-[#4ade80]">
              Onze AI regelt de rest.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Het slimste teambuilding platform van België — beschrijf wat jullie
              zoeken en onze AI vindt de perfecte match.
            </p>
            <div className="mx-auto mt-10 w-full max-w-3xl">
              <HeroSearch />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-[#f0fdf4] px-6 py-8">
          <div className="mx-auto max-w-5xl">
            <FilterSearchBar variant="home" />
          </div>
        </section>

        {/* Categorieën */}
        <section className="bg-white px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Wat past bij jullie team?
            </h2>
            <div className="mt-12">
              <CategoryPhotoGrid />
            </div>
          </div>
        </section>

        {/* Populaire activiteiten */}
        <section className="bg-[#fafafa] px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Ontdek wat mogelijk is
              </h2>
              <Link
                href="/zoeken"
                className="text-sm font-semibold text-[#1D9E75] transition-colors hover:text-[#178a66]"
              >
                Bekijk alles →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {popularProviders.map((provider) => (
                <PopularActivityCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </section>

        <WhyDagout />
        <ToolsSection />
        <ForProvidersCTA />
        <Testimonials />
      </main>

      <Footer />
    </>
  );
}
