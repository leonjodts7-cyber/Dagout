import { Skeleton } from "@/components/ui/Skeleton";

export default function PageLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16">
      <div className="ai-loader" aria-hidden="true" />
      <p className="mt-4 text-sm text-gray-500">Pagina laden...</p>
      <div className="mt-8 w-full max-w-2xl space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-6 h-40 w-full rounded-2xl" />
      </div>
    </div>
  );
}
