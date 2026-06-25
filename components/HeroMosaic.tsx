import Image from "next/image";

const MOSAIC_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&q=80",
    alt: "Kajakken",
    className: "row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=300&q=80",
    alt: "Escape room",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80",
    alt: "Kookworkshop",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&q=80",
    alt: "Outdoor",
    className: "col-span-2",
  },
];

export default function HeroMosaic() {
  return (
    <div className="grid h-[340px] grid-cols-2 grid-rows-[1fr_1fr_auto] gap-3">
      {MOSAIC_IMAGES.map((img) => (
        <div
          key={img.src}
          className={`relative min-h-[100px] overflow-hidden rounded-xl ${img.className}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 0vw, 300px"
            priority
          />
        </div>
      ))}
    </div>
  );
}
