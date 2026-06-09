import { REGIONS, CATEGORIES } from "@/lib/constants";

export const REGION_SLUGS: Record<string, string> = {
  gent: "Gent",
  antwerpen: "Antwerpen",
  brussel: "Brussel",
  mechelen: "Mechelen",
  leuven: "Leuven",
  brugge: "Brugge",
  hasselt: "Hasselt",
  kortrijk: "Kortrijk",
};

export const CATEGORY_SLUG_MAP: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.name])
);

export const REGION_SEO: Record<
  string,
  { title: string; description: string; intro: string; body: string }
> = {
  gent: {
    title: "Teambuilding Gent — Vind de beste activiteiten",
    description:
      "Ontdek teambuilding activiteiten in Gent. Kajakken, escape rooms, kookworkshops en meer voor teams in Oost-Vlaanderen.",
    intro: "Teambuilding in Gent",
    body: "Gent biedt een unieke mix van historische charme en moderne bedrijvigheid — ideaal voor teambuilding. Van kajaktochten door de grachten tot creatieve workshops in het centrum: teams vinden hier activiteiten voor elke groepsgrootte en elk budget. Dagout.be brengt de beste aanbieders in Gent samen op één platform.",
  },
  antwerpen: {
    title: "Teambuilding Antwerpen — Vind de beste activiteiten",
    description:
      "Plan de perfecte teambuilding in Antwerpen. Escape rooms, lasergame, kookworkshops en outdoor activiteiten.",
    intro: "Teambuilding in Antwerpen",
    body: "Antwerpen is dé hub voor dynamische teambuilding in Vlaanderen. Of je nu kiest voor een spannende escape room, een competitieve lasergame sessie of een gezamenlijke kookworkshop — de stad heeft voor elk team iets te bieden. Via Dagout.be vergelijk je eenvoudig aanbieders en stuur je direct een aanvraag.",
  },
  brussel: {
    title: "Teambuilding Brussel — Vind de beste activiteiten",
    description:
      "Teambuilding activiteiten in Brussel en omgeving. Vind en boek de beste ervaringen voor je team.",
    intro: "Teambuilding in Brussel",
    body: "Brussel combineert internationaliteit met een rijk aanbod aan teambuilding mogelijkheden. Perfect voor multinationale teams die op zoek zijn naar unieke ervaringen. Dagout.be helpt je snel de juiste activiteit te vinden op basis van groepsgrootte, budget en voorkeuren.",
  },
  mechelen: {
    title: "Teambuilding Mechelen — Vind de beste activiteiten",
    description:
      "Teambuilding in Mechelen: kookworkshops, outdoor avonturen en creatieve teamactiviteiten.",
    intro: "Teambuilding in Mechelen",
    body: "Mechelen ligt centraal in Vlaanderen en is een uitstekende locatie voor teambuilding dichtbij Antwerpen en Brussel. Teams genieten hier van gezellige kookworkshops, outdoor challenges en wellness activiteiten in een toegankelijke setting.",
  },
  leuven: {
    title: "Teambuilding Leuven — Vind de beste activiteiten",
    description:
      "Teambuilding activiteiten in Leuven. Lasergame, escape rooms en meer voor bedrijven.",
    intro: "Teambuilding in Leuven",
    body: "Leuven, de studentenstad met een bruisende bedrijfswereld, biedt diverse teambuilding opties. Van actieve lasergame sessies tot rustige wellness retreats — vind via Dagout.be de activiteit die past bij jullie teamcultuur.",
  },
  brugge: {
    title: "Teambuilding Brugge — Vind de beste activiteiten",
    description:
      "Teambuilding in Brugge en West-Vlaanderen. Outdoor, wellness en unieke teamervaringen.",
    intro: "Teambuilding in Brugge",
    body: "Brugge en omgeving zijn perfect voor teams die outdoor avontuur combineren met historische sfeer. Ontdek teambuilding in de natuur, op het water of in sfeervolle binnenlocaties. Dagout.be maakt het vergelijken en aanvragen eenvoudig.",
  },
  hasselt: {
    title: "Teambuilding Hasselt — Vind de beste activiteiten",
    description:
      "Teambuilding activiteiten in Hasselt en Limburg. Vind de beste aanbieders op Dagout.be.",
    intro: "Teambuilding in Hasselt",
    body: "Hasselt is het hart van Limburg en groeit uit als teambuilding bestemming. Teams vinden hier een warm onthaal en gevarieerd aanbod — van actieve outdoor programma's tot creatieve workshops. Plan jullie volgende uitstap via Dagout.be.",
  },
  kortrijk: {
    title: "Teambuilding Kortrijk — Vind de beste activiteiten",
    description:
      "Teambuilding in Kortrijk en West-Vlaanderen. Wellness, outdoor en teamactiviteiten.",
    intro: "Teambuilding in Kortrijk",
    body: "Kortrijk biedt teams in West-Vlaanderen een divers aanbod aan teambuilding activiteiten. Wellness retreats, outdoor challenges en creatieve sessies — allemaal te vinden en aan te vragen via Dagout.be.",
  },
};

export function getCategorySeo(slug: string) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;
  return {
    title: `${cat.name} teambuilding — Vind de beste activiteiten`,
    description: `${cat.description}. Boek ${cat.name.toLowerCase()} teambuilding activiteiten in Vlaanderen via Dagout.be.`,
    intro: `${cat.name} teambuilding`,
    body: `${cat.name} is een van de populairste teambuilding formats in België. ${cat.description}. Via Dagout.be vergelijk je eenvoudig aanbieders in heel Vlaanderen, bekijk je prijzen per persoon en stuur je een aanvraag naar de aanbieder van je keuze.`,
  };
}

export function isRegionSlug(slug: string): boolean {
  return slug in REGION_SLUGS;
}

export function isCategorySlug(slug: string): boolean {
  return slug in CATEGORY_SLUG_MAP;
}

export const ALL_SEO_SLUGS = [
  ...Object.keys(REGION_SLUGS),
  ...Object.keys(CATEGORY_SLUG_MAP),
];
