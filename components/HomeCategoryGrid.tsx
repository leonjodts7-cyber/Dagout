import Link from "next/link";
import { CATEGORIES, getCategoryAccentTheme } from "@/lib/constants";
import CategoryIcon from "@/components/CategoryIcon";

export default function HomeCategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => {
        const theme = getCategoryAccentTheme(category.slug);

        return (
          <Link
            key={category.slug}
            href={`/zoeken?categorie=${encodeURIComponent(category.name)}`}
            className="group relative flex h-[160px] cursor-pointer flex-col justify-between rounded-[14px] border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >
            <CategoryIcon
              slug={category.slug}
              className="h-7 w-7"
              stroke={theme.accent}
            />
            <div className="flex items-end justify-between gap-2">
              <p className="text-lg font-bold text-[#111827]">{category.name}</p>
              <span
                className="text-base font-semibold transition-transform group-hover:translate-x-0.5"
                style={{ color: theme.accent }}
                aria-hidden
              >
                →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
