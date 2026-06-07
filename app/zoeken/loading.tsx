import { Skeleton } from "@/components/ui/Skeleton";

export default function ZoekenLoading() {
  return (
    <div className="px-6 py-8">
      <Skeleton className="h-12 w-full max-w-3xl" />
      <Skeleton className="mt-8 h-8 w-48" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
