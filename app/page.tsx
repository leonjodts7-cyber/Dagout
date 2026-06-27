import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import FilterSearchBar from "@/components/FilterSearchBar";
import HomeCategoryGrid from "@/components/HomeCategoryGrid";
import HomeActivityCard from "@/components/HomeActivityCard";
import HowItWorks from "@/components/HowItWorks";
import ForProvidersCTA from "@/components/ForProvidersCTA";
import { getProviderById } from "@/lib/providers";

const FEATURED_PROVIDER_IDS = ["1", "2", "3", "4", "7", "8"];

export default function HomePage() {
  const activities = FEATURED_PROVIDER_IDS.map((id) => getProviderById(id)).filter(
    (p): p is NonNullable<ReturnType<typeof getProviderById>> => Boolean(p)
  );

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white">
        {/* Hero — centered, no images */}
        <section className="px-6 pb-[60px] pt-20 text-center">
          <div className="mx-auto max-w-6xl">
            <h1 className="mx-auto max-w-[700px] text-[36px] font-extrabold leading-tight tracking-[-0.02em] text-[#111827] sm:text-[52px]">
              Vind de perfecte teambuilding in Vlaanderen
            </h1>
            <p className="mx-auto mt-4 max-w-[500px] text-lg text-[#6b7280]">
              Beschrijf wat jullie zoeken en onze AI vindt de perfecte activiteit.
            </p>
            <HeroSearch />
          </div>
        </section>

        {/* Filter balk */}
        <section className="border-y border-[#e5e7eb] bg-[#f9fafb] py-4">
          <div className="mx-auto max-w-6xl px-6">
            <FilterSearchBar variant="home" />
          </div>
        </section>

        {/* Categorieën */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-[30px] font-bold text-[#111827]">
              Wat zoeken jullie?
            </h2>
            <HomeCategoryGrid />
          </div>
        </section>

        {/* Populaire activiteiten */}
        <section className="bg-[#f9fafb] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-[30px] font-bold text-[#111827]">
                Populaire activiteiten
              </h2>
              <Link
                href="/zoeken"
                className="text-[15px] font-semibold text-[#1D9E75] hover:text-[#178a66]"
              >
                Bekijk alles →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
