import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateVoteSessionForm from "@/components/CreateVoteSessionForm";
import { getActiveProviders } from "@/lib/providers-unified";

export const metadata = {
  title: "Team stemmen — Dagout.be",
  description: "Laat je team meestemmen over de perfecte teambuilding activiteit.",
};

interface StemmenNieuwPageProps {
  searchParams: Promise<{ preselect?: string }>;
}

export default async function StemmenNieuwPage({
  searchParams,
}: StemmenNieuwPageProps) {
  const params = await searchParams;
  const activities = await getActiveProviders();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <CreateVoteSessionForm
          preselectId={params.preselect}
          activities={activities}
        />
      </main>
      <Footer />
    </>
  );
}
