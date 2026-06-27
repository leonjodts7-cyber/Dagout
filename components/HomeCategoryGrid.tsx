import Link from "next/link";
import { CATEGORIES, getCategoryStyle } from "@/lib/constants";

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
            style={{ background: style.gradient }}
          >
            <span
              className="pointer-events-none absolute right-4 top-4 select-none text-[80px] leading-none opacity-30"
              aria-hidden
            >
              {style.emoji}
            </span>
            <p className="relative text-xl font-bold text-white">{category.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
