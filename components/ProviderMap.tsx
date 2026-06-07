"use client";

import dynamic from "next/dynamic";
import type { Provider } from "@/lib/types";
import { getMapViewForRegion } from "@/lib/geocoding";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-500">
      Kaart laden...
    </div>
  ),
});

interface ProviderMapProps {
  providers: Provider[];
  region?: string;
}

export default function ProviderMap({ providers, region }: ProviderMapProps) {
  const { center, zoom } = getMapViewForRegion(region);
  return <Map providers={providers} center={center} zoom={zoom} />;
}
