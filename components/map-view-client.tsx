"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Plant } from "@/lib/types";

type MapViewClientProps = {
  plants: Plant[];
};

export function MapViewClient({ plants }: MapViewClientProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mapInstance: { remove: () => void } | null = null;
    let cancelled = false;

    async function initMap() {
      if (!mapRef.current) {
        return;
      }

      const leaflet = await import("leaflet");

      if (cancelled || !mapRef.current) {
        return;
      }

      const L = leaflet.default;
      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        worldCopyJump: true,
        minZoom: 2
      });

      mapInstance = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Use a custom div icon so Next.js does not need Leaflet's default marker image assets.
      const markerIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            width: 40px;
            height: 40px;
            border-radius: 999px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #355f3b;
            color: white;
            border: 2px solid rgba(255,255,255,0.75);
            box-shadow: 0 10px 24px rgba(31,51,29,0.22);
            font-size: 18px;
          ">🌿</div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const bounds = L.latLngBounds([]);

      plants.forEach((plant) => {
        const marker = L.marker([plant.latitude, plant.longitude], {
          icon: markerIcon,
          title: plant.name
        })
          .addTo(map)
          .bindTooltip(plant.name, {
            direction: "top",
            offset: [0, -12]
          })
          .on("click", () => {
            router.push(`/plants/${plant.id}`);
          });

        bounds.extend(marker.getLatLng());
      });

      if (plants.length > 0) {
        map.fitBounds(bounds.pad(0.35), {
          maxZoom: 4
        });
      }
    }

    void initMap();

    return () => {
      cancelled = true;
      mapInstance?.remove();
    };
  }, [plants, router]);

  return <div ref={mapRef} className="min-h-[560px] w-full overflow-hidden rounded-[32px]" />;
}
