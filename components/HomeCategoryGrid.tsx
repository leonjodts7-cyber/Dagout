import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CATEGORY_CARD_IMAGES } from "@/lib/constants";

export default function HomeCategoryGrid() {
  return (
    <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
      {CATEGORIES.map((category) => {
        const image =
          CATEGORY_CARD_IMAGES[category.slug] ?? CATEGORY_CARD_IMAGES.outdoor;
        return (
          <Link
            key={category.slug}
            href={`/zoeken?categorie=${encodeURIComponent(category.name)}`}
            className="w-[200px] shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md lg:w-auto"
          >
            <div className="relative h-40 w-full">
              <Image
                src={image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <p className="px-4 py-3 text-base font-semibold text-gray-900">
              {category.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
