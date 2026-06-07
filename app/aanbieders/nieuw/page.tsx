import { Suspense } from "react";
import NewListingForm from "@/components/NewListingForm";

export default function NewListingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="ai-loader" /></div>}>
      <NewListingForm />
    </Suspense>
  );
}
