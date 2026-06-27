import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import SpotlightProviders from "@/components/SpotlightProviders";
import PremiumProviders from "@/components/PremiumProviders";
import HomeCategoryGrid from "@/components/HomeCategoryGrid";
import HowItWorks from "@/components/HowItWorks";
import ForProvidersCTA from "@/components/ForProvidersCTA";
import { getProviderById } from "@/lib/providers";

const SPOTLIGHT_IDS = ["1", "2", "3"];
const PREMIUM_IDS = ["4", "7", "8", "12"];

export default function HomePage() {
  const spotlight = SPOTLIGHT_IDS.map((id) => getProviderById(id)).filter(
    (p): p is NonNullable<ReturnType<typeof getProviderById>> => Boolean(p)
  );

  const premium = PREMIUM_IDS.map((id) => getProviderById(id)).filter(
    (p): p is NonNullable<ReturnType<typeof getProviderById>> => Boolean(p)
  );

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="px-6 pb-10 pt-[60px] text-center">
          <div className="mx-auto max-w-6xl">
            <h1 className="mx-auto max-w-[640px] text-[36px] font-extrabold leading-tight text-[#111827] sm:text-[44px]">
              Vind de perfecte teambuilding in Vlaanderen
            </h1>
            <p className="mx-auto mt-3 max-w-[480px] text-[17px] text-[#6b7280]">
              Beschrijf wat jullie zoeken. Onze AI vindt de beste activiteit voor
              jouw team.
            </p>
            <HeroSearch />
          </div>
        </section>

        <SpotlightProviders providers={spotlight} />
        <PremiumProviders providers={premium} />

        {/* Categorieën */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-6 text-2xl font-bold text-[#111827]">
              Wat zoeken jullie?
            </h2>
            <HomeCategoryGrid />
          </div>
        </section>

        <HowItWorks />
        <ForProvidersCTA />
      </main>

      <Footer />
    </>
  );
}
