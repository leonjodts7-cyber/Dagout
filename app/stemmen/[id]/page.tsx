import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VotePageClient from "@/components/VotePageClient";
import { getVoteSessionServer } from "@/lib/voting-server";

interface StemmenPageProps {
  params: Promise<{ id: string }>;
}

export default async function StemmenPage({ params }: StemmenPageProps) {
  const { id } = await params;
  const session = await getVoteSessionServer(id);

  if (!session) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <VotePageClient session={session} />
      </main>
      <Footer />
    </>
  );
}
