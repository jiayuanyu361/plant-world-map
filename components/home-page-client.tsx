"use client";

import { HomeHeroStage } from "@/components/home-hero-stage";
import { ExploreStage } from "@/components/explore-stage";
import type { Plant } from "@/lib/types";

type HomePageClientProps = {
  plants: Plant[];
};

export function HomePageClient({ plants }: HomePageClientProps) {
  return (
    <div className="home-stage relative left-1/2 w-screen -translate-x-1/2 overflow-hidden text-[#edf5ff]">
      <HomeHeroStage plants={plants} />
      <ExploreStage plants={plants} />
    </div>
  );
}
