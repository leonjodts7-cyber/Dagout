"use client";

import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Provider } from "@/lib/types";
import { CATEGORY_IMAGES } from "@/lib/constants";

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="background-color:#1D9E75;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);cursor:pointer;"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -11],
});

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
      scrollWheelZoom={true}
      className="z-0 h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {providers.map((provider) => {
        const imageUrl =
          provider.image_url ?? CATEGORY_IMAGES[provider.category] ?? "";

        return (
          <Marker
            key={provider.id}
            position={[provider.lat, provider.lng]}
            icon={markerIcon}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              {provider.name}
            </Tooltip>
            <Popup className="dagout-popup" minWidth={220}>
              <div className="p-1">
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={provider.name}
                    className="mb-3 h-28 w-full rounded-lg object-cover"
                  />
                )}
                <strong className="text-sm text-gray-900">{provider.name}</strong>
                <p className="mt-1 text-xs text-gray-500">{provider.city}</p>
                <p className="mt-2 text-base font-bold text-[#1D9E75]">
                  Vanaf &euro;{provider.price_from}/pers
                </p>
                <Link
                  href={`/activiteit/${provider.slug}`}
                  className="mt-3 block rounded-lg bg-[#1D9E75] py-2 text-center text-sm font-medium text-white no-underline hover:bg-[#178a66]"
                >
                  Bekijk
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
