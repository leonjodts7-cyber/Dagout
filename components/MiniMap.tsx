"use client";

import dynamic from "next/dynamic";
import type { Provider } from "@/lib/types";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center rounded-xl text-sm text-gray-400">
      <span className="ai-loader" aria-hidden="true" />
    </div>
  ),
});

interface MiniMapProps {
  provider: Provider;
}

export default function MiniMap({ provider }: MiniMapProps) {
  return (
    <div className="h-48 overflow-hidden rounded-xl">
      <Map
        providers={[provider]}
        center={[provider.lat, provider.lng]}
        zoom={13}
      />
    </div>
  );
}
