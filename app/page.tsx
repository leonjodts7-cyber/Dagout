import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import FilterSearchBar from "@/components/FilterSearchBar";
import HomeCategoryGrid from "@/components/HomeCategoryGrid";
import HomeActivityCard from "@/components/HomeActivityCard";
import WhyDagout from "@/components/WhyDagout";
import ForProvidersCTA from "@/components/ForProvidersCTA";
import { MOCK_PROVIDERS } from "@/lib/providers";

export default function HomePage() {
  const activities = MOCK_PROVIDERS.filter((p) => p.active).slice(0, 6);

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="bg-[#0d2818] px-6 pb-0 pt-[100px] text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-tight text-white">
              Vind de perfecte teambuilding.
            </h1>
            <p className="mt-2 text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-tight text-[#4ade80]">
              AI zoekt. Jij kiest.
            </p>
            <p className="mx-auto mt-5 max-w-[560px] text-lg text-white/70">
              Beschrijf in gewone taal wat jullie zoeken. Onze AI vindt de beste
              activiteit in Vlaanderen.
            </p>
            <div className="mx-auto mt-10 flex justify-center pb-20">
              <HeroSearch />
            </div>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="mx-auto max-w-5xl">
            <FilterSearchBar variant="home" />
          </div>
        </section>

        <section className="bg-[#f9fafb] px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-[32px] font-bold text-gray-900">
              Wat zoeken jullie?
            </h2>
            <div className="mt-10">
              <HomeCategoryGrid />
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 flex items-center justify-between gap-4">
              <h2 className="text-[28px] font-bold text-gray-900">
                Ontdek activiteiten
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

        <WhyDagout />
        <ForProvidersCTA />
      </main>

      <Footer />
    </>
  );
}
