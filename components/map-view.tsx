"use client";

import dynamic from "next/dynamic";
import type { Plant } from "@/lib/types";

type MapViewProps = {
  plants: Plant[];
};

const MapViewClient = dynamic(
  () => import("@/components/map-view-client").then((mod) => mod.MapViewClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[560px] items-center justify-center rounded-[32px] bg-white/40 text-sm text-[var(--muted)]">
        地图加载中...
      </div>
    )
  }
);

export function MapView({ plants }: MapViewProps) {
  return <MapViewClient plants={plants} />;
}
