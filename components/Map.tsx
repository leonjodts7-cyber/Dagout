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

function createGreenPin() {
  return L.divIcon({
    html: `<div style="width:32px;height:40px;position:relative">
      <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10.41 14.5 23.5 16 24 1.5-.5 16-13.59 16-24C32 7.163 24.837 0 16 0z" fill="#1D9E75" stroke="white" stroke-width="1.5"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    </div>`,
    className: "",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

const greenIcon = createGreenPin();

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
  return `<div>
    <img src="${imageUrl}" alt="${provider.name.replace(/"/g, "&quot;")}" style="width:200px;height:110px;object-fit:cover" loading="lazy" />
    <div style="padding:10px">
      <div style="font-weight:600;font-size:13px;margin-bottom:2px">${provider.name}</div>
      <div style="font-size:12px;color:#666;margin-bottom:6px">${provider.city}</div>
      <div style="font-size:13px;font-weight:600;color:#1D9E75;margin-bottom:8px">€${provider.price_from}/pers</div>
      <a href="/activiteit/${provider.slug}" style="display:block;background:#1D9E75;color:white;text-align:center;padding:6px;border-radius:6px;font-size:12px;font-weight:500;text-decoration:none">Bekijk →</a>
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
  center = [51.0, 3.7],
  zoom = 8,
}: MapProps) {
  const markerPositions = useMemo(
    () =>
      providers.map((provider) => ({
        provider,
        imageUrl:
          provider.image_url ??
          getProviderImageUrl(provider.category, provider.slug),
        popupHtml: buildPopupHtml(
          provider,
          provider.image_url ??
            getProviderImageUrl(provider.category, provider.slug)
        ),
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
        attribution="© OpenStreetMap contributors © CARTO"
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
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
          <Popup className="dagout-popup" minWidth={200} maxWidth={220}>
            <div dangerouslySetInnerHTML={{ __html: popupHtml }} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
