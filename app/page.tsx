import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
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

      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="px-6 pb-16">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[55fr_45fr] lg:gap-12">
            <div className="pt-16 lg:pt-20">
              <span className="inline-block rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-medium text-[#1D9E75]">
                ✦ AI-gestuurd platform
              </span>
              <h1 className="mt-5 max-w-[540px] text-[36px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#111827] sm:text-[44px]">
                Vind de perfecte teambuilding in Vlaanderen
              </h1>
              <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-[#6b7280]">
                Beschrijf in gewone taal wat jullie zoeken. Onze AI vindt de
                perfecte activiteit voor jouw team.
              </p>
              <div className="mt-8">
                <HeroSearch />
              </div>
            </div>

            <div className="hidden pt-12 lg:block lg:pt-[60px]">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  maxHeight: "420px",
                }}
              >
                <div
                  style={{
                    gridRow: "span 2",
                    borderRadius: "16px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=500&q=80"
                    alt="Kajakken teambuilding"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "16px",
                    }}
                  />
                </div>
                <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80"
                    alt="Kookworkshop teambuilding"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "16px",
                    }}
                  />
                </div>
                <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <img
                    src="https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=300&q=80"
                    alt="Escape room teambuilding"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "16px",
                    }}
                  />
                </div>
              </div>
            </div>
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
            <h2 className="mb-8 text-[28px] font-bold text-[#111827]">
              Wat zoeken jullie?
            </h2>
            <HomeCategoryGrid />
          </div>
        </section>

        {/* Populaire activiteiten */}
        <section className="bg-[#f9fafb] py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-[28px] font-bold text-[#111827]">
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
