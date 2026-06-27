import Link from "next/link";
import { CATEGORIES, getCategoryStyle } from "@/lib/constants";
import CategoryIcon from "@/components/CategoryIcon";

export default function HomeCategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => {
        const style = getCategoryStyle(category.slug);
        return (
          <Link
            key={category.slug}
            href={`/zoeken?categorie=${encodeURIComponent(category.name)}`}
            className="group relative flex h-[200px] cursor-pointer flex-col justify-end overflow-hidden rounded-[20px] p-6 transition-transform duration-200 hover:scale-[1.02]"
            style={{ backgroundColor: style.color }}
          >
            <div className="pointer-events-none absolute bottom-4 right-4 opacity-[0.15]">
              <CategoryIcon slug={category.slug} className="h-20 w-20" />
            </div>
            <div className="relative">
              <p className="text-xl font-bold text-white">{category.name}</p>
              <p className="mt-1 text-[13px] text-white/70 transition-colors group-hover:text-white/90">
                Bekijk activiteiten →
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
