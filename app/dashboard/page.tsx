import { Suspense } from "react";
import DashboardClient from "@/components/DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="ai-loader" />
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
