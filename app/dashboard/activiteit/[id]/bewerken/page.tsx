import { Suspense } from "react";
import NewListingForm from "@/components/NewListingForm";

interface BewerkenPageProps {
  params: Promise<{ id: string }>;
}

export default async function BewerkenPage({ params }: BewerkenPageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="ai-loader" />
        </div>
      }
    >
      <NewListingForm listingId={id} />
    </Suspense>
  );
}
