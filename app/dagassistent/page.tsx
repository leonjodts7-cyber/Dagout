import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import DagassistentClient from "@/components/DagassistentClient";

export const metadata = {
  title: "AI Dagassistent — Dagout.be",
  description: "Plan een volledige teambuilding dag met onze AI-assistent.",
};

export default function DagassistentPage() {
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
        <DagassistentClient />
      </main>
      <Footer />
    </>
  );
}
