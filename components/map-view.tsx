import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { Plant } from "@/lib/types";

type MapViewProps = {
  plants: Plant[];
  className?: string;
  activePlantId?: string | null;
  onPlantSelect?: (plant: Plant | null) => void;
};

const MapViewClient = dynamic(
  () => import("@/components/map-view-client").then((mod) => mod.MapViewClient),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[560px] flex-col items-center justify-center rounded-none bg-[linear-gradient(180deg,#eef3e8,#f7f4ee)] px-6 text-center text-[#6a7a69]">
        <p className="text-lg font-semibold text-[#243326]">植物地图正在展开...</p>
        <p className="mt-2 max-w-md text-sm leading-7 text-[#728273]">
          正在加载地图底图、植物条目与探索界面，很快就能开始浏览。
        </p>
      </div>
    )
  }
);

export function MapView({ plants, className, activePlantId, onPlantSelect }: MapViewProps) {
  return (
    <MapViewClient
      plants={plants}
      className={className}
      activePlantId={activePlantId}
      onPlantSelect={onPlantSelect}
    />
  );
}
