"use client";

import dynamic from "next/dynamic";
import { memo, useEffect } from "react";
import type { Provider } from "@/lib/types";
import { getMapViewForRegion } from "@/lib/geocoding";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-400">
      <span className="ai-loader" aria-hidden="true" />
      <span className="sr-only">Kaart laden...</span>
    </div>
  ),
});

interface ProviderMapProps {
  providers: Provider[];
  region?: string;
  onReady?: () => void;
}

function ProviderMapInner({ providers, region, onReady }: ProviderMapProps) {
  const { center, zoom } = getMapViewForRegion(region);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <div className="h-full min-h-[288px] w-full">
      <Map providers={providers} center={center} zoom={zoom} />
    </div>
  );
}

export default memo(ProviderMapInner);
