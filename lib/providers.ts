import type { Provider } from "./types";
import { getProviderImageUrl } from "./constants";

function normalizeRegion(region: string): string {
  const map: Record<string, string> = {
    gent: "Gent",
    antwerpen: "Antwerpen",
    brussel: "Brussel",
    mechelen: "Mechelen",
    leuven: "Leuven",
    brugge: "Brugge",
    hasselt: "Hasselt",
    kortrijk: "Kortrijk",
  };
  const lower = region.toLowerCase();
  return map[lower] ?? region.charAt(0).toUpperCase() + region.slice(1);
}

function toProvider(
  raw: Omit<Provider, "price_per_person" | "email" | "rating" | "image_url"> & {
    price_per_person?: number;
    email?: string | null;
    rating?: number;
    image_url?: string | null;
  }
): Provider {
  return {
    ...raw,
    region: normalizeRegion(raw.region),
    price_per_person: true,
    email: raw.email ?? null,
    rating: raw.rating ?? 4.8,
    image_url:
      raw.image_url ??
      getProviderImageUrl(raw.category, raw.slug),
  };
}

export const MOCK_PROVIDERS: Provider[] = [
  toProvider({
    id: "1",
    slug: "dobber-kajakken-gent",
    name: "Dobber Kajakken",
    image_url: "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=600&q=80",
    category: "Kajakken",
    city: "Gent",
    region: "gent",
    short_description: "Kajakken en SUP op de Blaarmeersen in Gent",
    description:
      "Beleef een onvergetelijke dag op het water met Dobber. Kies uit kajaks of SUP-boards en ontdek samen een prachtige route op het water in Gent. Geschikt voor groepen van 10 tot 100 personen.",
    price_from: 25,
    min_persons: 10,
    max_persons: 100,
    duration_minutes: 180,
    indoor_outdoor: "outdoor",
    lat: 51.0543,
    lng: 3.6821,
    featured: true,
    active: true,
    website: "https://dobber.life",
    phone: "+32 9 123 45 67",
    includes: ["Kajak of SUP-board", "Peddel en zwemvest", "Waterdicht zakje", "Briefing"],
  }),
  toProvider({
    id: "2",
    slug: "escape-hunt-antwerpen",
    name: "Escape Hunt Antwerpen",
    image_url: "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=600&q=80",
    category: "Escape Room",
    city: "Antwerpen",
    region: "antwerpen",
    short_description: "Meeslepende escape rooms in het hart van Antwerpen",
    description:
      "Los puzzels op als team onder tijdsdruk in onze professioneel ingerichte escape rooms. Meerdere thema's beschikbaar voor groepen van 5 tot 40 personen.",
    price_from: 22,
    min_persons: 5,
    max_persons: 40,
    duration_minutes: 90,
    indoor_outdoor: "indoor",
    lat: 51.2194,
    lng: 4.4025,
    featured: true,
    active: true,
    website: "https://escapehunt.com",
    phone: "+32 3 123 45 67",
    includes: ["Spelbegeleiding", "Herhaling bij mislukking", "Foto na afloop"],
  }),
  toProvider({
    id: "3",
    slug: "volta-kookworkshop-gent",
    name: "Volta Kookworkshop",
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    category: "Kookworkshop",
    city: "Gent",
    region: "gent",
    short_description: "Kookworkshops in een prachtige industriële locatie",
    description:
      "Bereid samen een heerlijk driegangenmenu in de iconische Volta in Gent. Onze chef-koks begeleiden jullie door een culinaire ervaring die je niet snel vergeet.",
    price_from: 55,
    min_persons: 12,
    max_persons: 40,
    duration_minutes: 210,
    indoor_outdoor: "indoor",
    lat: 51.0612,
    lng: 3.7194,
    featured: false,
    active: true,
    website: "https://volta.be",
    phone: "+32 9 234 56 78",
    includes: ["Alle ingrediënten", "Kookschorten", "Driegangenmenu", "Wijn bij het eten"],
  }),
  toProvider({
    id: "4",
    slug: "lasergame-arena-brussel",
    name: "Lasergame Arena Brussel",
    image_url: "https://images.unsplash.com/photo-1552072805-516d4f2c3a64?w=600&q=80",
    category: "Lasergame",
    city: "Brussel",
    region: "brussel",
    short_description: "Spannende lasergame battles in een futuristisch decor",
    description:
      "Strijd in teams in onze state-of-the-art lasergame arena. Perfect voor teambuilding met een competitief element. Meerdere spelformats beschikbaar.",
    price_from: 18,
    min_persons: 8,
    max_persons: 50,
    duration_minutes: 120,
    indoor_outdoor: "indoor",
    lat: 50.8503,
    lng: 4.3517,
    featured: false,
    active: true,
    website: "https://lasergame.be",
    phone: "+32 2 345 67 89",
    includes: ["Lasergame uitrusting", "Speluitleg", "Meerdere rondes", "Scorebord"],
  }),
  toProvider({
    id: "5",
    slug: "de-wimpe-kanovaren-herenthout",
    name: "De Wimpe Kanovaren",
    image_url: "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=600&q=80",
    category: "Kajakken",
    city: "Herenthout",
    region: "antwerpen",
    short_description: "Kano- en kajaktochten op de Nete in de Kempen",
    description:
      "Vaar de Kleine of Grote Nete af per kano of kajak en geniet van de prachtige Kempische natuur. Combineerbaar met BBQ en GPS-avonturen.",
    price_from: 20,
    min_persons: 10,
    max_persons: 80,
    duration_minutes: 240,
    indoor_outdoor: "outdoor",
    lat: 51.1547,
    lng: 4.7523,
    featured: false,
    active: true,
    website: "https://dewimpe.be",
    phone: "+32 14 123 45 67",
    includes: ["Kajak of kano", "Zwemvest", "Waterdichte tas", "Route-informatie"],
  }),
  toProvider({
    id: "6",
    slug: "urban-escape-mechelen",
    name: "Urban Escape Mechelen",
    image_url: "https://images.unsplash.com/photo-1593773736752-e54fbf80f6cf?w=600&q=80",
    category: "Kajakken",
    city: "Mechelen",
    region: "mechelen",
    short_description: "Kanotochten op de Dijle door het centrum van Mechelen",
    description:
      "Ontdek Mechelen vanop het water. Vertrek vanuit de Kruidtuin voor een kanotocht op de Binnendijle. Uniek perspectief op de mooiste stad van België.",
    price_from: 18,
    min_persons: 6,
    max_persons: 40,
    duration_minutes: 120,
    indoor_outdoor: "outdoor",
    lat: 51.0259,
    lng: 4.4777,
    featured: false,
    active: true,
    website: "https://urbanescapemechelen.be",
    phone: "+32 15 123 45 67",
    includes: ["Kano", "Peddel en zwemvest", "Route op maat", "Optionele gids"],
  }),
  toProvider({
    id: "7",
    slug: "klimavontuur-leuven",
    name: "Klimavontuur Leuven",
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
    category: "Outdoor",
    city: "Leuven",
    region: "leuven",
    short_description: "Klimmen en outdoor avontuur in de omgeving van Leuven",
    description:
      "Daag jullie team uit met klimmen, touwbruggen en hoogteparcours. Onze instructeurs begeleiden jullie veilig door uitdagende outdoor activiteiten.",
    price_from: 30,
    min_persons: 8,
    max_persons: 30,
    duration_minutes: 180,
    indoor_outdoor: "outdoor",
    lat: 50.8798,
    lng: 4.7005,
    featured: false,
    active: true,
    website: "https://klimavontuur.be",
    phone: "+32 16 123 45 67",
    includes: ["Klimuitrusting", "Veiligheidsmateriaal", "Professionele begeleiding", "Verzekering"],
  }),
  toProvider({
    id: "8",
    slug: "wellness-retreat-brugge",
    name: "Wellness Retreat Brugge",
    image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    category: "Wellness",
    city: "Brugge",
    region: "brugge",
    short_description: "Ontspanning en verbinding in het romantische Brugge",
    description:
      "Geef jullie team een moment van rust en verbinding. Yoga, meditatie en wellness workshops in een prachtige omgeving in Brugge. Ideaal na een intensieve periode.",
    price_from: 45,
    min_persons: 8,
    max_persons: 25,
    duration_minutes: 180,
    indoor_outdoor: "both",
    lat: 51.2093,
    lng: 3.2247,
    featured: false,
    active: true,
    website: "https://wellnessbrugge.be",
    phone: "+32 50 123 45 67",
    includes: ["Yogamat", "Wellness workshop", "Gezonde lunch", "Rustpakket"],
  }),
  toProvider({
    id: "9",
    slug: "paintball-hasselt",
    name: "Paintball Arena Hasselt",
    image_url: "https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=600&q=80",
    category: "Outdoor",
    city: "Hasselt",
    region: "hasselt",
    short_description: "Spannende paintball battles in Hasselt",
    description:
      "Teamwork onder vuur. Onze professionele paintball arena biedt meerdere spelvelden en formats voor een onvergetelijke teambuilding dag.",
    price_from: 28,
    min_persons: 10,
    max_persons: 60,
    duration_minutes: 180,
    indoor_outdoor: "outdoor",
    lat: 50.9307,
    lng: 5.3378,
    featured: false,
    active: true,
    website: "https://paintballhasselt.be",
    phone: "+32 11 123 45 67",
    includes: ["Paintball marker", "Beschermende uitrusting", "200 paintballs", "Begeleiding"],
  }),
  toProvider({
    id: "10",
    slug: "wijnproeverij-kortrijk",
    name: "Wijnproeverij Kortrijk",
    image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
    category: "Kookworkshop",
    city: "Kortrijk",
    region: "kortrijk",
    short_description: "Professionele wijnproeverij met sommelier in Kortrijk",
    description:
      "Leer de kunst van het wijnproeven van een professionele sommelier. Een culturele en sociale teambuilding die perfect afsluit met een borrel.",
    price_from: 35,
    min_persons: 8,
    max_persons: 30,
    duration_minutes: 150,
    indoor_outdoor: "indoor",
    lat: 50.8281,
    lng: 3.265,
    featured: false,
    active: true,
    website: "https://wijnkortrijk.be",
    phone: "+32 56 123 45 67",
    includes: ["6 wijnen proeven", "Kaasplank", "Wijnboek", "Certificaat"],
  }),
  toProvider({
    id: "11",
    slug: "escape-room-gent",
    name: "Locked Escape Room Gent",
    image_url: "https://images.unsplash.com/photo-1525118354882-9c3a3501b6de?w=600&q=80",
    category: "Escape Room",
    city: "Gent",
    region: "gent",
    short_description: "Immersieve escape rooms in Gent met unieke verhaallijnen",
    description:
      "Wordt ondergedompeld in een spannend verhaal en werk als team om te ontsnappen. Meerdere thema's beschikbaar voor verschillende groepsgroottes.",
    price_from: 20,
    min_persons: 4,
    max_persons: 30,
    duration_minutes: 75,
    indoor_outdoor: "indoor",
    lat: 51.0543,
    lng: 3.7174,
    featured: false,
    active: true,
    website: "https://locked.be",
    phone: "+32 9 345 67 89",
    includes: ["Spelbegeleiding", "Foto na afloop", "Verfrissend drankje bij succes"],
  }),
  toProvider({
    id: "12",
    slug: "cooking-lab-antwerpen",
    name: "Cooking Lab Antwerpen",
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    category: "Kookworkshop",
    city: "Antwerpen",
    region: "antwerpen",
    short_description: "Interactieve kookworkshops voor teams in Antwerpen",
    description:
      "Teams strijden in een MasterChef-formaat in ons professionele kooklabo. Inclusief degustatie van jullie eigen creaties en een gezellige afsluiter.",
    price_from: 50,
    min_persons: 10,
    max_persons: 50,
    duration_minutes: 180,
    indoor_outdoor: "indoor",
    lat: 51.2194,
    lng: 4.3973,
    featured: true,
    active: true,
    website: "https://cookinglab.be",
    phone: "+32 3 456 78 90",
    includes: ["Alle ingrediënten", "Kookschorten", "Professionele begeleiding", "Degustatie"],
  }),
];

export default MOCK_PROVIDERS;

/** @deprecated gebruik MOCK_PROVIDERS */
export const SAMPLE_PROVIDERS = MOCK_PROVIDERS;

function regionMatches(providerRegion: string, filterRegion: string): boolean {
  return providerRegion.toLowerCase() === filterRegion.toLowerCase();
}

function matchesPersonen(provider: Provider, personen?: string): boolean {
  if (!personen) return true;
  switch (personen) {
    case "1-10":
      return provider.max_persons >= 1 && provider.min_persons <= 10;
    case "10-25":
      return provider.max_persons >= 10 && provider.min_persons <= 25;
    case "25-50":
      return provider.max_persons >= 25 && provider.min_persons <= 50;
    case "50+":
      return provider.max_persons >= 50;
    default:
      return true;
  }
}

function matchesOmgeving(provider: Provider, omgeving?: string): boolean {
  if (!omgeving) return true;
  if (omgeving === "both") return provider.indoor_outdoor === "both";
  return (
    provider.indoor_outdoor === omgeving || provider.indoor_outdoor === "both"
  );
}

export function getProviderBySlug(slug: string): Provider | undefined {
  return MOCK_PROVIDERS.find((p) => p.slug === slug);
}

export function getProviderById(id: string): Provider | undefined {
  return MOCK_PROVIDERS.find((p) => p.id === id);
}

export function resolveProvider(ref: string): Provider | undefined {
  return getProviderBySlug(ref) ?? getProviderById(ref);
}

export function getPopularProviders(): Provider[] {
  return MOCK_PROVIDERS.filter((p) => p.active && p.featured);
}

export function getRelatedProviders(provider: Provider, limit = 3): Provider[] {
  return MOCK_PROVIDERS.filter(
    (p) => p.active && p.category === provider.category && p.slug !== provider.slug
  ).slice(0, limit);
}

export function searchProviders(
  query?: string,
  region?: string,
  category?: string,
  personen?: string,
  omgeving?: string
): Provider[] {
  let results = MOCK_PROVIDERS.filter((p) => p.active);

  if (region) {
    results = results.filter((p) => regionMatches(p.region, region));
  }

  if (category) {
    results = results.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (query?.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q)
    );
  }

  results = results.filter(
    (p) => matchesPersonen(p, personen) && matchesOmgeving(p, omgeving)
  );

  return results;
}

export type SortOption = "relevant" | "price-asc" | "price-desc" | "rating";

/** Pro (featured) listings first, then free tier, then by rating. */
function comparePlanVisibility(a: Provider, b: Provider): number {
  const rank = (p: Provider) => (p.featured ? 2 : 1);
  const diff = rank(b) - rank(a);
  if (diff !== 0) return diff;
  return b.rating - a.rating;
}

export function sortProviders(
  providers: Provider[],
  sort: SortOption
): Provider[] {
  const copy = [...providers];
  switch (sort) {
    case "price-asc":
      return copy.sort(
        (a, b) => comparePlanVisibility(a, b) || a.price_from - b.price_from
      );
    case "price-desc":
      return copy.sort(
        (a, b) => comparePlanVisibility(a, b) || b.price_from - a.price_from
      );
    case "rating":
      return copy.sort(
        (a, b) => comparePlanVisibility(a, b) || b.rating - a.rating
      );
    default:
      return copy.sort(comparePlanVisibility);
  }
}

export const SEARCH_FILTER_CATEGORIES = [
  "Alle",
  "Kajakken",
  "Escape Room",
  "Kookworkshop",
  "Lasergame",
  "Outdoor",
  "Wellness",
] as const;

export function getActiveCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const provider of MOCK_PROVIDERS) {
    if (!provider.active) continue;
    counts[provider.category] = (counts[provider.category] ?? 0) + 1;
  }
  return counts;
}

export function getCategoryCounts(
  query?: string,
  region?: string,
  personen?: string,
  omgeving?: string
): Record<string, number> {
  const base = searchProviders(query, region, undefined, personen, omgeving);
  const counts: Record<string, number> = { Alle: base.length };
  for (const cat of SEARCH_FILTER_CATEGORIES) {
    if (cat === "Alle") continue;
    counts[cat] = base.filter(
      (p) => p.category.toLowerCase() === cat.toLowerCase()
    ).length;
  }
  return counts;
}

export function getProvidersForAi() {
  return MOCK_PROVIDERS.filter((p) => p.active).map((p) => ({
    id: p.slug,
    slug: p.slug,
    name: p.name,
    category: p.category,
    region: p.region,
    city: p.city,
    short_description: p.short_description,
    price_from: p.price_from,
    min_persons: p.min_persons,
    max_persons: p.max_persons,
    duration_minutes: p.duration_minutes,
    indoor_outdoor: p.indoor_outdoor,
    rating: p.rating,
  }));
}

export const DEFAULT_OPENING_HOURS = [
  { day: "Maandag – Vrijdag", open: "09:00", close: "18:00", closed: false },
  { day: "Zaterdag", open: "10:00", close: "16:00", closed: false },
  { day: "Zondag", open: "", close: "", closed: true },
];
