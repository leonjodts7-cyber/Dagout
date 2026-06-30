import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ZoekenFilterBar from "@/components/ZoekenFilterBar";
import ZoekenPageClient from "@/components/ZoekenPageClient";
import {
  getActiveProviders,
  searchAllProviders,
} from "@/lib/providers-unified";

interface ZoekenPageProps {
  searchParams: Promise<{
    q?: string;
    regio?: string;
    categorie?: string;
    personen?: string;
    omgeving?: string;
    ai?: string;
  }>;
}

export default async function ZoekenPage({ searchParams }: ZoekenPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const region = params.regio ?? "";
  const category = params.categorie ?? "";
  const personen = params.personen ?? "";
  const omgeving = params.omgeving ?? "";
  const aiMode = params.ai === "true";

  const [providers, allActive] = await Promise.all([
    searchAllProviders(query, region, category, personen, omgeving),
    getActiveProviders(),
  ]);

  const isLaunchEmpty = allActive.length === 0;

  return (
    <>
      <Navbar />

      <main className="flex min-h-[calc(100vh-65px)] flex-col">
        <div className="sticky top-[65px] z-30 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <ZoekenFilterBar
              defaultQuery={query}
              defaultRegion={region}
              defaultCategory={category}
              defaultPersonen={personen}
              defaultOmgeving={omgeving}
              defaultAi={aiMode}
            />
          </div>
        </div>

        <ZoekenPageClient
          providers={providers}
          isLaunchEmpty={isLaunchEmpty}
          query={query}
          region={region}
          category={category}
          personen={personen}
          omgeving={omgeving}
          aiMode={aiMode}
        />
      </main>

      <Footer />
    </>
  );
}
