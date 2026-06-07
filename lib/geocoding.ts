/** Coördinaten voor kaartweergave (Vlaanderen + steden) */
export const REGION_CENTERS: Record<string, [number, number]> = {
  Antwerpen: [51.2194, 4.4025],
  Gent: [51.0543, 3.7174],
  Brussel: [50.8503, 4.3517],
  Mechelen: [51.0259, 4.4777],
  Leuven: [50.8798, 4.7005],
  Brugge: [51.2093, 3.2247],
  Hasselt: [50.9307, 5.3325],
  Kortrijk: [50.827, 3.2648],
};

export const FLANDERS_CENTER: [number, number] = [51.0, 3.7];
export const FLANDERS_ZOOM = 8;
export const REGION_ZOOM = 11;

const CITY_COORDS: Record<string, [number, number]> = {
  ...REGION_CENTERS,
  antwerpen: [51.2194, 4.4025],
  gent: [51.0543, 3.7174],
  brussel: [50.8503, 4.3517],
  mechelen: [51.0259, 4.4777],
  leuven: [50.8798, 4.7005],
  brugge: [51.2093, 3.2247],
  hasselt: [50.9307, 5.3325],
  kortrijk: [50.827, 3.2648],
};

export function getCoordsForCity(cityOrRegion: string): [number, number] {
  const key = cityOrRegion.trim();
  if (REGION_CENTERS[key]) return REGION_CENTERS[key];
  const lower = key.toLowerCase();
  if (CITY_COORDS[lower]) return CITY_COORDS[lower];
  return FLANDERS_CENTER;
}

export function getMapViewForRegion(region?: string): {
  center: [number, number];
  zoom: number;
} {
  if (region) {
    const normalized =
      region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
    const center = REGION_CENTERS[normalized] ?? REGION_CENTERS[region];
    if (center) return { center, zoom: REGION_ZOOM };
  }
  return { center: FLANDERS_CENTER, zoom: FLANDERS_ZOOM };
}
