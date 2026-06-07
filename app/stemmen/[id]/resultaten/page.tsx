import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoteResultsClient from "@/components/VoteResultsClient";
import { getVoteSessionServer } from "@/lib/voting-server";

interface ResultatenPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultatenPage({ params }: ResultatenPageProps) {
  const { id } = await params;
  const session = await getVoteSessionServer(id);

  if (!session) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <VoteResultsClient session={session} />
      </main>
      <Footer />
    </>
  );
}
