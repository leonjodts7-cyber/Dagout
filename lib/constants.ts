export const PRIMARY_COLOR = "#1D9E75";
export const HERO_BG = "#0a2a1f";

export const REGIONS = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Mechelen",
  "Leuven",
  "Brugge",
  "Hasselt",
  "Kortrijk",
] as const;

export const CATEGORIES = [
  {
    name: "Kajakken",
    slug: "kajakken",
    description: "Peddel samen over rivieren en kanalen",
  },
  {
    name: "Escape Room",
    slug: "escape-room",
    description: "Los puzzels op als team onder tijdsdruk",
  },
  {
    name: "Kookworkshop",
    slug: "kookworkshop",
    description: "Bereid samen een heerlijk menu",
  },
  {
    name: "Lasergame",
    slug: "lasergame",
    description: "Strijd in teams in een spannende arena",
  },
  {
    name: "Outdoor",
    slug: "outdoor",
    description: "Avontuur en teamspirit in de natuur",
  },
  {
    name: "Wellness",
    slug: "wellness",
    description: "Ontspan en verbind in rustige sfeer",
  },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const CATEGORY_STYLES: Record<string, { color: string }> = {
  kajakken: { color: "#0c4a6e" },
  "escape-room": { color: "#3b0764" },
  kookworkshop: { color: "#7c2d12" },
  lasergame: { color: "#7f1d1d" },
  outdoor: { color: "#14532d" },
  wellness: { color: "#831843" },
};

const CATEGORY_NAME_TO_SLUG: Record<string, string> = {
  Kajakken: "kajakken",
  "Escape Room": "escape-room",
  Kookworkshop: "kookworkshop",
  Lasergame: "lasergame",
  Outdoor: "outdoor",
  Wellness: "wellness",
};

export function getCategoryStyle(categoryOrSlug: string) {
  const slug =
    CATEGORY_NAME_TO_SLUG[categoryOrSlug] ??
    categoryOrSlug.toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_STYLES[slug] ?? CATEGORY_STYLES.outdoor;
}

export const CATEGORY_CARD_IMAGES: Record<string, string> = {
  kajakken:
    "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=400&q=80",
  "escape-room":
    "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=400&q=80",
  kookworkshop:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  lasergame:
    "https://images.unsplash.com/photo-1552072805-516d4f2c3a64?w=400&q=80",
  outdoor:
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80",
  wellness:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
};

export const PROVIDER_IMAGE_OVERRIDES: Record<string, string> = {
  "dobber-kajakken-gent":
    "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=600&q=80",
  "escape-hunt-antwerpen":
    "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=600&q=80",
  "volta-kookworkshop-gent":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "lasergame-arena-brussel":
    "https://images.unsplash.com/photo-1552072805-516d4f2c3a64?w=600&q=80",
  "de-wimpe-kanovaren-herenthout":
    "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=600&q=80",
  "urban-escape-mechelen":
    "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=600&q=80",
  "klimavontuur-leuven":
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
  "wellness-retreat-brugge":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  "paintball-hasselt":
    "https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=600&q=80",
  "wijnproeverij-kortrijk":
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
  "escape-room-gent":
    "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=600&q=80",
  "cooking-lab-antwerpen":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
};

export const CATEGORY_IMAGES: Record<string, string> = {
  Kajakken: PROVIDER_IMAGE_OVERRIDES["dobber-kajakken-gent"],
  "Escape Room": PROVIDER_IMAGE_OVERRIDES["escape-hunt-antwerpen"],
  Kookworkshop: PROVIDER_IMAGE_OVERRIDES["volta-kookworkshop-gent"],
  Lasergame: PROVIDER_IMAGE_OVERRIDES["lasergame-arena-brussel"],
  Outdoor: PROVIDER_IMAGE_OVERRIDES["klimavontuur-leuven"],
  Wellness: PROVIDER_IMAGE_OVERRIDES["wellness-retreat-brugge"],
  Klimmen: PROVIDER_IMAGE_OVERRIDES["klimavontuur-leuven"],
  Paintball: PROVIDER_IMAGE_OVERRIDES["paintball-hasselt"],
  Wijnproeverij: PROVIDER_IMAGE_OVERRIDES["wijnproeverij-kortrijk"],
};

export function getProviderImageUrl(
  category: string,
  slug?: string
): string {
  if (slug && PROVIDER_IMAGE_OVERRIDES[slug]) {
    return PROVIDER_IMAGE_OVERRIDES[slug];
  }
  if (slug?.includes("paintball")) return CATEGORY_IMAGES.Paintball;
  if (slug?.includes("wijn")) return CATEGORY_IMAGES.Wijnproeverij;
  if (slug?.includes("klim")) return CATEGORY_IMAGES.Klimmen;
  return (
    CATEGORY_IMAGES[category] ??
    CATEGORY_IMAGES.Outdoor ??
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80"
  );
}

export const SEARCH_SUGGESTIONS = [
  {
    label: "Actieve dag voor 20 mensen in Gent 🌊",
    query:
      "Wij zijn met 20 mensen en zoeken een actieve outdoor activiteit in Gent, budget rond €30 per persoon",
  },
  {
    label: "Escape room teambuilding Antwerpen 🔐",
    query: "Escape room teambuilding voor 15 personen in Antwerpen",
  },
  {
    label: "Kookworkshop met lunch Brussel 👨‍🍳",
    query: "Kookworkshop met lunch voor ons team van 25 personen in Brussel",
  },
  {
    label: "Wellness dag voor ons team 🧘",
    query: "Wellness en ontspanning teambuilding voor 12 personen, rustige sfeer",
  },
] as const;
