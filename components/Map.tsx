"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
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
import { CATEGORY_IMAGES } from "@/lib/constants";

const greenIcon = L.divIcon({
  html: `<svg width="32" height="40" viewBox="0 0 32 40" fill="none">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 9.941 14 24 16 24s16-14.059 16-24C32 7.163 24.837 0 16 0z" fill="#1D9E75"/>
    <circle cx="16" cy="16" r="6" fill="white"/>
  </svg>`,
  className: "",
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

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

interface MapProps {
  providers: Provider[];
  center?: [number, number];
  zoom?: number;
}

export default function Map({
  providers,
  center = [51.0, 3.7],
  zoom = 8,
}: MapProps) {
  const markerPositions = useMemo(
    () =>
      providers.map((provider) => ({
        provider,
        imageUrl:
          provider.image_url ?? CATEGORY_IMAGES[provider.category] ?? "",
      })),
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
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <MapFlyTo center={center} zoom={zoom} />
      {markerPositions.map(({ provider, imageUrl }) => (
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
          <Popup className="custom-popup" minWidth={220} maxWidth={240}>
            <div className="dagout-popup-card">
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={provider.name}
                  className="dagout-popup-image"
                  loading="lazy"
                />
              )}
              <div className="dagout-popup-body">
                <strong className="dagout-popup-title">{provider.name}</strong>
                <p className="dagout-popup-city">{provider.city}</p>
                <p className="dagout-popup-price">
                  Vanaf &euro;{provider.price_from}/pers
                </p>
                <Link
                  href={`/activiteit/${provider.slug}`}
                  className="dagout-popup-button"
                >
                  Bekijk
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
