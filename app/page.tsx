import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import HeroMosaic from "@/components/HeroMosaic";
import FilterSearchBar from "@/components/FilterSearchBar";
import HomeCategoryGrid from "@/components/HomeCategoryGrid";
import HomeActivityCard from "@/components/HomeActivityCard";
import HowItWorks from "@/components/HowItWorks";
import ForProvidersCTA from "@/components/ForProvidersCTA";
import { MOCK_PROVIDERS } from "@/lib/providers";

export default function HomePage() {
  const activities = MOCK_PROVIDERS.filter((p) => p.active).slice(0, 6);

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white px-6 pb-10 pt-14">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14">
            <div>
              <h1 className="max-w-[640px] text-[32px] font-bold leading-[1.2] tracking-tight text-[#111827] sm:text-[42px]">
                Vind de perfecte teambuilding in Vlaanderen
              </h1>
              <p className="mt-3 max-w-[480px] text-[17px] leading-relaxed text-[#6b7280]">
                Beschrijf wat jullie zoeken. Onze AI vindt de perfecte match voor
                jouw team.
              </p>
              <div className="mt-8">
                <HeroSearch />
              </div>
            </div>
            <div className="hidden lg:block">
              <HeroMosaic />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-y border-[#e5e7eb] bg-[#f9fafb] px-6 py-4">
          <div className="mx-auto max-w-6xl">
            <FilterSearchBar variant="home" />
          </div>
        </section>

        {/* Categorieën */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-[28px] font-bold text-gray-900">
              Wat zoeken jullie?
            </h2>
            <div className="mt-8">
              <HomeCategoryGrid />
            </div>
          </div>
        </section>

        {/* Populaire activiteiten */}
        <section className="bg-[#f9fafb] px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-[28px] font-bold text-gray-900">
                Populaire activiteiten
              </h2>
              <Link
                href="/zoeken"
                className="text-sm font-semibold text-[#1D9E75] hover:text-[#178a66]"
              >
                Bekijk alles →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((provider) => (
                <HomeActivityCard key={provider.id} provider={provider} />
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />
        <ForProvidersCTA />
      </main>

      <Footer />
    </>
  );
}
