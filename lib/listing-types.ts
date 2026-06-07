export const LISTING_CATEGORIES = [
  "Kajakken",
  "Escape Room",
  "Kookworkshop",
  "Lasergame",
  "Outdoor",
  "Wellness",
  "Paintball",
  "Klimmen",
  "Wijnproeverij",
  "Creatief",
  "Andere",
] as const;

export const LISTING_REGIONS = [
  "Antwerpen",
  "Gent",
  "Brussel",
  "Mechelen",
  "Leuven",
  "Brugge",
  "Hasselt",
  "Kortrijk",
  "Andere",
] as const;

export const DURATION_OPTIONS = [
  "1u",
  "1.5u",
  "2u",
  "2.5u",
  "3u",
  "4u",
  "Volledige dag",
  "Meerdere dagen",
] as const;

export const WEEKDAYS = [
  { index: 1, label: "Maandag" },
  { index: 2, label: "Dinsdag" },
  { index: 3, label: "Woensdag" },
  { index: 4, label: "Donderdag" },
  { index: 5, label: "Vrijdag" },
  { index: 6, label: "Zaterdag" },
  { index: 0, label: "Zondag" },
] as const;

export const FORM_STEPS = [
  "Basisinfo",
  "Locatie",
  "Details",
  "Openingsuren",
  "Inbegrepen",
  "Media",
  "Extra",
] as const;

export interface OpeningHourRow {
  dayOfWeek: number;
  label: string;
  isClosed: boolean;
  timeFrom: string;
  timeTo: string;
}

export interface ListingFormData {
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  indoorOutdoor: "indoor" | "outdoor" | "both";
  companyName: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  region: string;
  website: string;
  phone: string;
  contactEmail: string;
  minPersons: number;
  maxPersons: number;
  duration: string;
  priceFrom: string;
  priceOnRequest: boolean;
  openingHours: OpeningHourRow[];
  includes: string[];
  tags: string[];
  languages: string[];
  certificates: string;
  videoUrl: string;
}

export function defaultOpeningHours(): OpeningHourRow[] {
  return WEEKDAYS.map((d) => ({
    dayOfWeek: d.index,
    label: d.label,
    isClosed: d.index === 0,
    timeFrom: "09:00",
    timeTo: "17:00",
  }));
}

export function defaultFormData(): ListingFormData {
  return {
    name: "",
    category: "",
    shortDescription: "",
    fullDescription: "",
    indoorOutdoor: "outdoor",
    companyName: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    region: "",
    website: "",
    phone: "",
    contactEmail: "",
    minPersons: 6,
    maxPersons: 20,
    duration: "2u",
    priceFrom: "",
    priceOnRequest: false,
    openingHours: defaultOpeningHours(),
    includes: ["Materiaal", "Begeleiding"],
    tags: [],
    languages: ["Nederlands"],
    certificates: "",
    videoUrl: "",
  };
}

export interface DbListing {
  id: string;
  user_id: string;
  name: string;
  category: string;
  short_description: string;
  status: "pending" | "active" | "inactive" | "rejected";
  created_at: string;
  min_persons: number | null;
  max_persons: number | null;
  price_from: number | null;
  website: string | null;
}

export interface DbInquiry {
  id: string;
  listing_id: string;
  company_name: string | null;
  contact_name: string | null;
  email: string;
  phone: string | null;
  group_size: number | null;
  preferred_date: string | null;
  message: string | null;
  status: "new" | "handled" | null;
  created_at: string;
  listings?: { name: string };
}

export interface DbProfile {
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  phone: string | null;
  website: string | null;
  is_provider: boolean | null;
  is_pro: boolean | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}
