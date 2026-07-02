import Link from "next/link";
import ListingCard from "@/components/ListingCard";
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
            <ListingCard
              key={index}
              item={item}
              className="w-[min(85vw,280px)] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-60px)/4)]"
            />
          ))}
        </HorizontalScrollRow>
      </div>
    </section>
  );
}
