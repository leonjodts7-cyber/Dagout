export interface Provider {
  id: string;
  listing_id?: string;
  name: string;
  slug: string;
  category: string;
  region: string;
  city: string;
  description: string;
  short_description: string;
  price_from: number;
  price_per_person: boolean;
  min_persons: number;
  max_persons: number;
  duration_minutes: number;
  indoor_outdoor: "indoor" | "outdoor" | "both";
  lat: number;
  lng: number;
  website: string | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  rating: number;
  includes: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
}

export interface Plan {
  id: string;
  user_id: string;
  name: string;
  date: string;
  provider_ids: string[];
  notes: string | null;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  date: string;
}
