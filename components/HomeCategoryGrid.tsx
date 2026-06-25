import Link from "next/link";
import Image from "next/image";
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
            className="card-lift overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          >
            <div className="relative h-[180px] w-full">
              <Image
                src={image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <p className="px-4 py-3 text-[15px] font-semibold text-gray-900">
              {category.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
