import Link from "next/link";
import { CATEGORIES, CATEGORY_CARD_IMAGES } from "@/lib/constants";

export default function HomeCategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => {
        const image =
          CATEGORY_CARD_IMAGES[category.slug] ?? CATEGORY_CARD_IMAGES.outdoor;
        return (
          <Link
            key={category.slug}
            href={`/zoeken?categorie=${encodeURIComponent(category.name)}`}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
          >
            <img
              src={image}
              alt={category.name}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
            <p className="px-4 py-4 text-base font-semibold text-[#111827]">
              {category.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
