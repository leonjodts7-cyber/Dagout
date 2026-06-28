import Link from "next/link";
import { CATEGORIES, getCategoryStyle } from "@/lib/constants";
import CategoryIcon from "@/components/CategoryIcon";
import { getActiveCategoryCounts } from "@/lib/providers";

export default function HomeCategoryGrid() {
  const counts = getActiveCategoryCounts();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => {
        const style = getCategoryStyle(category.slug);
        const count = counts[category.name] ?? 0;
        const countLabel =
          count === 1 ? "1 activiteit" : `${count} activiteiten`;

        return (
          <Link
            key={category.slug}
            href={`/zoeken?categorie=${encodeURIComponent(category.name)}`}
            className="group relative flex h-[200px] cursor-pointer flex-col justify-end overflow-hidden rounded-[20px] p-6 transition-transform duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: style.color }}
          >
            <div className="pointer-events-none absolute right-4 top-4 opacity-90">
              <CategoryIcon slug={category.slug} className="h-8 w-8" />
            </div>
            <div className="relative">
              <p className="text-lg font-bold text-white">{category.name}</p>
              <p className="mt-1 text-xs text-white/70">{countLabel}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
