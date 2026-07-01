import Link from "next/link";
import AdListingCard from "@/components/AdListingCard";
import type { HomeCardItem } from "@/lib/home-listings";

interface HomeAdSectionProps {
  title: string;
  viewAllHref: string;
  items: HomeCardItem[];
  columns?: 4;
  rows?: number;
}

export default function HomeAdSection({
  title,
  viewAllHref,
  items,
  columns = 4,
  rows = 2,
}: HomeAdSectionProps) {
  const targetCount = columns * rows;
  const displayItems = items.slice(0, targetCount);

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#f3f4f6] pb-3">
          <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-medium text-[#1D9E75] hover:text-[#178a66]"
          >
            Bekijk alle →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {displayItems.map((item, index) => (
            <AdListingCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
