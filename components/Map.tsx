"use client";

import { useEffect } from "react";
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

const PIN_SVG = `
<svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 1C9.82 1 4 6.82 4 14c0 9.625 13 27 13 27s13-17.375 13-27C30 6.82 24.18 1 17 1z" fill="#1D9E75" stroke="white" stroke-width="2"/>
  <circle cx="17" cy="14" r="5" fill="white"/>
</svg>`;

const markerIcon = L.divIcon({
  className: "dagout-map-marker",
  html: PIN_SVG,
  iconSize: [34, 42],
  iconAnchor: [17, 42],
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
      {providers.map((provider) => {
        const imageUrl =
          provider.image_url ?? CATEGORY_IMAGES[provider.category] ?? "";

        return (
          <Marker
            key={provider.id}
            position={[provider.lat, provider.lng]}
            icon={markerIcon}
          >
            <Tooltip
              direction="top"
              offset={[0, -36]}
              opacity={0.95}
              className="dagout-map-tooltip"
            >
              {provider.name}
            </Tooltip>
            <Popup className="dagout-map-popup" minWidth={240} maxWidth={280}>
              <div className="dagout-popup-card">
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={provider.name}
                    className="dagout-popup-image"
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
        );
      })}
    </MapContainer>
  );
}
