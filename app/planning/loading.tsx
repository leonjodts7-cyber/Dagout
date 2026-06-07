import { Skeleton } from "@/components/ui/Skeleton";

export default function PlanningLoading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
      <Skeleton className="mt-4 h-48 w-full rounded-2xl" />
    </div>
  );
}
