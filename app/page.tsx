import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import HomeFeaturedRow from "@/components/HomeFeaturedRow";
import HomeAdSection from "@/components/HomeAdSection";
import {
  getHomeCategoryCards,
  getHomeFeaturedCards,
  getHomeMultiCategoryCards,
} from "@/lib/home-listings";

export default async function HomePage() {
  const [
    featured,
    kajakken,
    escapeRooms,
    kookworkshops,
    outdoor,
    wellness,
  ] = await Promise.all([
    getHomeFeaturedCards(6),
    getHomeCategoryCards("Kajakken", 8),
    getHomeCategoryCards("Escape Room", 8),
    getHomeCategoryCards("Kookworkshop", 8),
    getHomeMultiCategoryCards(["Outdoor", "Lasergame"], 8),
    getHomeCategoryCards("Wellness", 4),
  ]);

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white">
        <section className="px-6 pb-8 pt-[60px] text-center">
          <div className="mx-auto max-w-6xl">
            <h1 className="mx-auto max-w-[640px] text-[32px] font-extrabold leading-tight text-[#111827] md:text-[44px]">
              Vind de perfecte teambuilding in Vlaanderen
            </h1>
            <p className="mx-auto mt-3 max-w-[480px] text-[17px] text-[#6b7280]">
              Beschrijf wat jullie zoeken. Onze AI vindt de beste activiteit voor
              jouw team.
            </p>
            <HeroSearch />
          </div>
        </section>

        <HomeFeaturedRow items={featured} />

        <HomeAdSection
          title="Kajakken & Watersport"
          viewAllHref="/zoeken?categorie=Kajakken"
          items={kajakken}
        />

        <HomeAdSection
          title="Escape Rooms"
          viewAllHref="/zoeken?categorie=Escape%20Room"
          items={escapeRooms}
        />

        <HomeAdSection
          title="Kookworkshops & Culinair"
          viewAllHref="/zoeken?categorie=Kookworkshop"
          items={kookworkshops}
        />

        <HomeAdSection
          title="Outdoor & Avontuur"
          viewAllHref="/zoeken?categorie=Outdoor"
          items={outdoor}
        />

        <HomeAdSection
          title="Wellness & Ontspanning"
          viewAllHref="/zoeken?categorie=Wellness"
          items={wellness}
          rows={1}
        />
      </main>

      <Footer />
    </>
  );
}
