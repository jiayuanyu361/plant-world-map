"use client";

import { useEffect, useRef } from "react";
import { getPlantMarkerEmoji } from "@/lib/demo-atlas";
import { cn } from "@/lib/utils";
import type { Plant } from "@/lib/types";

type MapViewClientProps = {
  plants: Plant[];
  className?: string;
  activePlantId?: string | null;
  onPlantSelect?: (plant: Plant | null) => void;
};

type MarkerHandle = {
  id: string;
  getElement: () => HTMLElement | null;
};

export function MapViewClient({ plants, className, activePlantId, onPlantSelect }: MapViewClientProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<MarkerHandle[]>([]);

  useEffect(() => {
    let mapInstance: { remove: () => void; on: (event: string, handler: () => void) => void } | null = null;
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
        center: [18, 0],
        zoom: 2,
        worldCopyJump: true,
        minZoom: 2,
        zoomControl: true
      });

      mapInstance = map;
      markersRef.current = [];

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      map.on("click", () => {
        onPlantSelect?.(null);
      });

      const bounds = L.latLngBounds([]);

      plants.forEach((plant) => {
        const marker = L.marker([plant.latitude, plant.longitude], {
          icon: L.divIcon({
            className: "atlas-marker",
            html: buildAtlasMarker(plant),
            iconSize: [54, 54],
            iconAnchor: [27, 27]
          }),
          title: plant.name
        })
          .addTo(map)
          .bindTooltip(plant.name, {
            direction: "top",
            offset: [0, -16]
          });

        marker.on("click", () => {
          onPlantSelect?.(plant);
        });

        markersRef.current.push({
          id: plant.id,
          getElement: () => marker.getElement() ?? null
        });

        bounds.extend(marker.getLatLng());
      });

      if (plants.length > 0) {
        map.fitBounds(bounds.pad(0.28), {
          maxZoom: 4
        });
      }
    }

    void initMap();

    return () => {
      cancelled = true;
      markersRef.current = [];
      mapInstance?.remove();
    };
  }, [plants, onPlantSelect]);

  useEffect(() => {
    markersRef.current.forEach(({ id, getElement }) => {
      getElement()?.classList.toggle("is-active", activePlantId === id);
    });
  }, [activePlantId, plants]);

  return <div ref={mapRef} className={cn("min-h-[560px] w-full overflow-hidden rounded-none", className)} />;
}

function buildAtlasMarker(plant: Plant) {
  return `
    <div class="atlas-marker__node">
      <span class="atlas-marker__shadow"></span>
      <span class="atlas-marker__halo atlas-marker__halo--outer"></span>
      <span class="atlas-marker__halo atlas-marker__halo--inner"></span>
      <span class="atlas-marker__pin">
        <span class="atlas-marker__emoji">${escapeHtml(getPlantMarkerEmoji(plant))}</span>
      </span>
    </div>
  `;
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
