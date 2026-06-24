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

export const CATEGORY_CARD_IMAGES: Record<string, string> = {
  kajakken:
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
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
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
  "escape-hunt-antwerpen":
    "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=600&q=80",
  "volta-kookworkshop-gent":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "lasergame-arena-brussel":
    "https://images.unsplash.com/photo-1552072805-516d4f2c3a64?w=600&q=80",
  "de-wimpe-kanovaren-herenthout":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
  "urban-escape-mechelen":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
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

export const TESTIMONIALS = [
  {
    quote:
      "Via Dagout vonden we binnen vijf minuten de perfecte teambuilding voor ons sales team. De AI-zoekfunctie begrijpt echt wat je bedoelt.",
    name: "Sophie Vermeulen",
    role: "HR Manager",
    company: "Belfius",
    initials: "SV",
  },
  {
    quote:
      "Eindelijk een platform dat teambuilding in Vlaanderen overzichtelijk maakt. Wij gebruiken Dagout nu voor elke bedrijfsuitstap.",
    name: "Thomas De Smet",
    role: "Office Manager",
    company: "Colruyt Group",
    initials: "TD",
  },
  {
    quote:
      "De AI-zoekfunctie bespaart ons uren zoekwerk. Onze medewerkers waren enthousiast over de escape room in Antwerpen.",
    name: "Lien Janssens",
    role: "Teambuilding Coördinator",
    company: "Umicore",
    initials: "LJ",
  },
] as const;

export const PROVIDER_REVIEWS = [
  {
    author: "Marie-Claire Dubois",
    role: "Teamlead Marketing",
    company: "Proximus",
    rating: 5,
    text: "Fantastische ervaring! Het team vond de activiteit geweldig en alles was professioneel georganiseerd.",
    date: "februari 2026",
  },
  {
    author: "Pieter Wouters",
    role: "CEO",
    company: "Scale-up Gent",
    rating: 5,
    text: "Perfecte match voor ons team van 15 personen. De communicatie met de aanbieder verliep vlot via Dagout.",
    date: "januari 2026",
  },
  {
    author: "Anouk Peeters",
    role: "People & Culture",
    company: "Deloitte Belgium",
    rating: 4,
    text: "Goede prijs-kwaliteitverhouding en een unieke ervaring. We komen zeker terug voor onze volgende uitstap.",
    date: "december 2025",
  },
] as const;
