import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoteResultsClient from "@/components/VoteResultsClient";
import { getProvidersByIds } from "@/lib/providers-unified";
import { getVoteSessionServer } from "@/lib/voting-server";

interface ResultatenPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultatenPage({ params }: ResultatenPageProps) {
  const { id } = await params;
  const session = await getVoteSessionServer(id);

  if (!session) notFound();

  const sessionProviders = await getProvidersByIds(session.provider_ids);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <VoteResultsClient
          session={session}
          sessionProviders={sessionProviders}
        />
      </main>
      <Footer />
    </>
  );
}
