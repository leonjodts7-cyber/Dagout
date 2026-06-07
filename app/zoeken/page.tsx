import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ZoekenFilterBar from "@/components/ZoekenFilterBar";
import ZoekenPageClient from "@/components/ZoekenPageClient";
import PageHeader from "@/components/PageHeader";

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

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen flex-col">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Ontdek" },
          ]}
        />

        <div className="sticky top-[65px] z-30 border-b border-gray-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6">
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
