"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Provider } from "@/lib/types";
import { getProviderImageUrl } from "@/lib/constants";

const greenIcon = L.divIcon({
  html: `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 9.941 14 24 16 24s16-14.059 16-24C32 7.163 24.837 0 16 0z" fill="#1D9E75"/>
    <circle cx="16" cy="16" r="6" fill="white"/>
  </svg>`,
  className: "",
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

function MapInvalidateSize() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [map]);

  return null;
}

function MapFlyTo({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.1, easeLinearity: 0.25 });
  }, [center, zoom, map]);

  return null;
}

function buildPopupHtml(provider: Provider, imageUrl: string): string {
  return `<div class="dagout-popup-card">
    <img src="${imageUrl}" alt="${provider.name.replace(/"/g, "&quot;")}" class="dagout-popup-image" loading="lazy" />
    <div class="dagout-popup-body">
      <div class="dagout-popup-title">${provider.name}</div>
      <div class="dagout-popup-city">${provider.city}</div>
      <div class="dagout-popup-price">€${provider.price_from}/pers</div>
      <a href="/activiteit/${provider.slug}" class="dagout-popup-button">Bekijk →</a>
    </div>
  </div>`;
}

interface MapProps {
  providers: Provider[];
  center?: [number, number];
  zoom?: number;
}

export default function Map({
  providers,
  center = [50.85, 4.35],
  zoom = 8,
}: MapProps) {
  const markerPositions = useMemo(
    () =>
      providers.map((provider) => {
        const imageUrl =
          provider.image_url ??
          getProviderImageUrl(provider.category, provider.slug);
        return {
          provider,
          popupHtml: buildPopupHtml(provider, imageUrl),
        };
      }),
    [providers]
  );

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      zoomAnimation
      fadeAnimation
      className="dagout-map z-0 h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains={["a", "b", "c", "d"]}
        maxZoom={20}
      />
      <MapInvalidateSize />
      <MapFlyTo center={center} zoom={zoom} />
      {markerPositions.map(({ provider, popupHtml }) => (
        <Marker
          key={provider.id}
          position={[provider.lat, provider.lng]}
          icon={greenIcon}
        >
          <Tooltip
            direction="top"
            offset={[0, -36]}
            opacity={0.95}
            className="dagout-map-tooltip"
          >
            {provider.name}
          </Tooltip>
          <Popup className="custom-popup" minWidth={220} maxWidth={220}>
            <div dangerouslySetInnerHTML={{ __html: popupHtml }} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
