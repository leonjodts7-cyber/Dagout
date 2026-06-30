import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import DagassistentClient from "@/components/DagassistentClient";
import { getActiveProviders } from "@/lib/providers-unified";

export const metadata = {
  title: "AI Dagassistent — Dagout.be",
  description: "Plan een volledige teambuilding dag met onze AI-assistent.",
};

export default async function DagassistentPage() {
  const providers = await getActiveProviders();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "AI Dagassistent" },
          ]}
        />
        <DagassistentClient providers={providers} />
      </main>
      <Footer />
    </>
  );
}
