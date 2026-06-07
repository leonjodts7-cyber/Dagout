import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoteSessionsClient from "@/components/VoteSessionsClient";

export const metadata = {
  title: "Mijn stemrondes",
  description: "Beheer je teambuilding stemrondes op Dagout.be",
};

export default function DashboardStemrondesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex-1 bg-gray-50">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="ai-loader" />
            </div>
          }
        >
          <VoteSessionsClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
