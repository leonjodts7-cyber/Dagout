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
            <div className="pointer-events-none absolute right-4 top-4 opacity-90">
              <CategoryIcon slug={category.slug} className="h-8 w-8" />
            </div>
            <p className="relative text-lg font-bold text-white">
              {category.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
