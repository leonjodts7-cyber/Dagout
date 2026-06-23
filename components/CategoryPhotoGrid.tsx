import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CATEGORY_CARD_IMAGES } from "@/lib/constants";

export default function CategoryPhotoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => {
        const image =
          CATEGORY_CARD_IMAGES[category.slug] ??
          CATEGORY_CARD_IMAGES.outdoor;
        return (
          <Link
            key={category.slug}
            href={`/zoeken?categorie=${encodeURIComponent(category.name)}`}
            className="card-hover group relative h-[200px] overflow-hidden rounded-2xl"
          >
            <Image
              src={image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10 transition-colors duration-300 group-hover:from-black/65 group-hover:via-black/25" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="text-lg font-bold text-white">{category.name}</h3>
              <p className="mt-1 text-sm text-white/80">{category.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
