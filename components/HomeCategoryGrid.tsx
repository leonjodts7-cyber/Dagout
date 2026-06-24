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
            className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <p className="px-4 py-3.5 text-base font-semibold text-gray-900">
              {category.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
