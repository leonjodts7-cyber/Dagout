import { Skeleton } from "@/components/ui/Skeleton";

export default function ZoekenLoading() {
  return (
    <div className="flex flex-1 flex-col-reverse lg:flex-row">
      <div className="lg:w-1/2 px-6 py-8">
        <Skeleton className="h-12 w-full max-w-3xl rounded-xl" />
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-8 h-8 w-48" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="h-72 lg:h-[calc(100vh-8.5rem)] lg:w-1/2">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
    </div>
  );
}
