export const SEARCH_FILTER_CATEGORIES = [
  "Alle",
  "Kajakken",
  "Escape Room",
  "Kookworkshop",
  "Lasergame",
  "Outdoor",
  "Wellness",
  "Paintball",
  "Wijnproeverij",
] as const;

export const DEFAULT_OPENING_HOURS = [
  { day: "Maandag – Vrijdag", open: "09:00", close: "18:00", closed: false },
  { day: "Zaterdag", open: "10:00", close: "16:00", closed: false },
  { day: "Zondag", open: "", close: "", closed: true },
];

export {
  sortProviders,
  type SortOption,
} from "@/lib/providers-unified";
