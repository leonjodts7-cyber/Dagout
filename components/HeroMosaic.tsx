import Image from "next/image";

const KAYAK_IMAGE =
  "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=400&q=80";
const COOKING_IMAGE =
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80";
const ESCAPE_IMAGE =
  "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=300&q=80";

export default function HeroMosaic() {
  return (
    <div className="grid h-[380px] grid-cols-2 gap-3 overflow-hidden">
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={KAYAK_IMAGE}
          alt="Kajakken teambuilding"
          fill
          className="object-cover"
          sizes="240px"
          priority
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <Image
            src={COOKING_IMAGE}
            alt="Kookworkshop teambuilding"
            fill
            className="object-cover"
            sizes="200px"
            priority
          />
        </div>
        <div className="relative flex-1 overflow-hidden rounded-2xl">
          <Image
            src={ESCAPE_IMAGE}
            alt="Escape room teambuilding"
            fill
            className="object-cover"
            sizes="200px"
            priority
          />
        </div>
      </div>
    </div>
  );
}
