import Link from "next/link";
import AdListingCard from "@/components/AdListingCard";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";
import type { HomeCardItem } from "@/lib/home-listings";

interface HomeFeaturedRowProps {
  items: HomeCardItem[];
}

export default function HomeFeaturedRow({ items }: HomeFeaturedRowProps) {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#f3f4f6] pb-3">
          <h2 className="text-xl font-bold text-[#111827]">
            Uitgelichte aanbieders
          </h2>
          <Link
            href="/zoeken"
            className="shrink-0 text-sm font-medium text-[#1D9E75] hover:text-[#178a66]"
          >
            Bekijk alle →
          </Link>
        </div>

        <HorizontalScrollRow>
          {items.map((item, index) => (
            <AdListingCard
              key={index}
              item={item}
              variant="teaser"
              className="w-[220px] shrink-0 snap-start"
            />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
