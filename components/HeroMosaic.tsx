const KAYAK_IMAGE =
  "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=400&q=80";
const COOKING_IMAGE =
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80";
const ESCAPE_IMAGE =
  "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=300&q=80";

export default function HeroMosaic() {
  return (
    <div className="grid h-[380px] grid-cols-2 gap-3 overflow-hidden">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={KAYAK_IMAGE}
          alt="Kajakken teambuilding"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex-1 overflow-hidden rounded-2xl">
          <img
            src={COOKING_IMAGE}
            alt="Kookworkshop teambuilding"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="flex-1 overflow-hidden rounded-2xl">
          <img
            src={ESCAPE_IMAGE}
            alt="Escape room teambuilding"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
