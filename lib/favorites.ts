"use client";

import type { Provider } from "@/lib/types";

const STORAGE_KEY = "dagout_favorites";

export interface FavoriteEntry {
  slug: string;
  name: string;
  city: string;
  category: string;
  price_from: number;
  image_url: string | null;
  added_at: string;
}

function readLocal(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteEntry[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(entries: FavoriteEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("dagout-favorites-changed"));
}

export function getLocalFavorites(): FavoriteEntry[] {
  return readLocal();
}

export function isFavorite(slug: string): boolean {
  return readLocal().some((f) => f.slug === slug);
}

export function toggleLocalFavorite(provider: Provider): boolean {
  const current = readLocal();
  const exists = current.find((f) => f.slug === provider.slug);

  if (exists) {
    writeLocal(current.filter((f) => f.slug !== provider.slug));
    return false;
  }

  writeLocal([
    {
      slug: provider.slug,
      name: provider.name,
      city: provider.city,
      category: provider.category,
      price_from: provider.price_from,
      image_url: provider.image_url,
      added_at: new Date().toISOString(),
    },
    ...current,
  ]);
  return true;
}

export function removeLocalFavorite(slug: string) {
  writeLocal(readLocal().filter((f) => f.slug !== slug));
}

export async function syncFavoriteToServer(
  provider: Provider,
  add: boolean,
  accessToken: string
) {
  try {
    await fetch("/api/favorites", {
      method: add ? "POST" : "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ slug: provider.slug, provider }),
    });
  } catch {
    // localStorage blijft bron van waarheid als API faalt
  }
}

export async function fetchServerFavorites(
  accessToken: string
): Promise<FavoriteEntry[]> {
  try {
    const res = await fetch("/api/favorites", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return getLocalFavorites();
    const data = await res.json();
    return data.favorites ?? getLocalFavorites();
  } catch {
    return getLocalFavorites();
  }
}
