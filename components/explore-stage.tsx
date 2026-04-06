"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, MapPin, Search, SlidersHorizontal, Sparkles, Users, X } from "lucide-react";
import { filterPlantsWithRealImages, getPlantInsights } from "@/lib/demo-atlas";
import { cn } from "@/lib/utils";
import { MapView } from "@/components/map-view";
import type { Plant } from "@/lib/types";

type ExploreStageProps = {
  plants: Plant[];
};

type SeasonFilter = "全部" | "春季" | "夏季" | "秋季" | "冬季";

const MAX_FILTER_TAGS = 8;
const DESKTOP_STAGE_HEIGHT = "xl:h-[720px]";
const SEASON_OPTIONS: SeasonFilter[] = ["全部", "春季", "夏季", "秋季", "冬季"];
const SEASON_TAGS = new Set<SeasonFilter>(["春季", "夏季", "秋季", "冬季"]);
const SEASON_OVERLAYS: Record<SeasonFilter, string> = {
  全部: "bg-[radial-gradient(circle_at_24%_18%,rgba(220,231,210,0.14),transparent_28%),radial-gradient(circle_at_76%_22%,rgba(201,221,212,0.12),transparent_24%),linear-gradient(180deg,rgba(244,241,234,0.1)_0%,rgba(240,236,228,0.04)_100%)]",
  春季: "bg-[radial-gradient(circle_at_20%_16%,rgba(246,212,224,0.22),transparent_26%),radial-gradient(circle_at_78%_24%,rgba(232,239,215,0.18),transparent_20%),linear-gradient(180deg,rgba(255,244,248,0.06)_0%,rgba(245,240,234,0.02)_100%)]",
  夏季: "bg-[radial-gradient(circle_at_22%_20%,rgba(206,233,199,0.2),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(198,224,207,0.16),transparent_22%),linear-gradient(180deg,rgba(241,248,238,0.05)_0%,rgba(237,244,232,0.02)_100%)]",
  秋季: "bg-[radial-gradient(circle_at_22%_18%,rgba(243,224,180,0.22),transparent_26%),radial-gradient(circle_at_80%_22%,rgba(231,210,166,0.16),transparent_22%),linear-gradient(180deg,rgba(252,246,235,0.05)_0%,rgba(245,238,225,0.02)_100%)]",
  冬季: "bg-[radial-gradient(circle_at_24%_16%,rgba(216,226,240,0.24),transparent_28%),radial-gradient(circle_at_76%_22%,rgba(205,219,236,0.16),transparent_24%),linear-gradient(180deg,rgba(244,247,252,0.05)_0%,rgba(238,242,248,0.02)_100%)]"
};

export function ExploreStage({ plants }: ExploreStageProps) {
  const displayPlants = useMemo(() => filterPlantsWithRealImages(plants), [plants]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeSeason, setActiveSeason] = useState<SeasonFilter>("全部");
  const [activePlant, setActivePlant] = useState<Plant | null>(null);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const approvedCount = displayPlants.length;
  const availableTags = getTopTags(displayPlants).slice(0, MAX_FILTER_TAGS);
  const seasonScopedPlants = activeSeason === "全部" ? displayPlants : displayPlants.filter((plant) => (plant.tags ?? []).includes(activeSeason));
  const filteredPlants = seasonScopedPlants.filter((plant) => matchesPlant(plant, normalizedQuery, activeTag));
  const visiblePlants = filteredPlants;
  const recentPlants = (filteredPlants.length ? filteredPlants : seasonScopedPlants).slice(0, 6);
  const community = useMemo(() => getCommunitySummary(seasonScopedPlants), [seasonScopedPlants]);
  const seasonCopy = getSeasonCopy(activeSeason);

  useEffect(() => {
    if (activePlant && !filteredPlants.some((plant) => plant.id === activePlant.id)) {
      setActivePlant(null);
    }
  }, [activePlant, filteredPlants]);

  return (
    <section id="explore-stage" className="bg-[linear-gradient(180deg,#f6f2ea_0%,#edf2e6_100%)] py-12 md:py-16">
      <div className="mx-auto w-[min(1260px,calc(100vw-32px))] space-y-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#697b67]">探索地图</p>
            <h2 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-[#223226]">让植物随季节在地图上生长</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#5d6e5f] md:text-base">
              {seasonCopy.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#566757]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8dfd2] bg-white px-4 py-2 shadow-[0_10px_22px_rgba(44,58,38,0.05)]">
              <Sparkles className="h-4 w-4 text-[#416f47]" />
              当前季节 {activeSeason === "全部" ? "全年" : activeSeason}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8dfd2] bg-white px-4 py-2 shadow-[0_10px_22px_rgba(44,58,38,0.05)]">
              <Clock3 className="h-4 w-4 text-[#416f47]" />
              今日新增 {community.todayAdditions} 条
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-stretch">
          <div className={cn("relative overflow-hidden rounded-[32px] bg-[#eef3ea] shadow-[0_22px_54px_rgba(42,58,38,0.1)] ring-1 ring-[#dde5d8] h-[560px] md:h-[640px]", DESKTOP_STAGE_HEIGHT)}>
            <MapView
              plants={filteredPlants}
              className="h-full min-h-0 rounded-[32px]"
              activePlantId={activePlant?.id ?? null}
              onPlantSelect={setActivePlant}
            />

            <div className={cn("pointer-events-none absolute inset-0 z-[260]", SEASON_OVERLAYS[activeSeason])} />

            <div className="pointer-events-none absolute left-4 right-4 top-4 z-[760] md:left-6 md:right-auto md:w-[min(720px,calc(100%-48px))]">
              <div className="pointer-events-auto flex items-center gap-2 overflow-hidden rounded-full border border-[#d8dfd2] bg-[rgba(255,255,255,0.9)] px-2 py-2 shadow-[0_16px_32px_rgba(49,64,42,0.08)] backdrop-blur">
                <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full bg-[#f4f7f1] px-3 py-2.5">
                  <Search className="h-4 w-4 shrink-0 text-[#78907b]" />
                  <input
                    className="w-full bg-transparent text-[13px] text-[#203025] outline-none placeholder:text-[#839684]"
                    placeholder="搜索植物、地区或标签"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {query || activeTag || activeSeason !== "全部" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setActiveTag(null);
                        setActiveSeason("全部");
                      }}
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#78907b] transition hover:bg-[#e8eee3] hover:text-[#203025]"
                      aria-label="清除搜索"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {SEASON_OPTIONS.map((season) => {
                    const isActive = activeSeason === season;
                    return (
                      <button
                        key={season}
                        type="button"
                        onClick={() => setActiveSeason(season)}
                        className={cn(
                          "shrink-0 rounded-full px-3.5 py-2.5 text-[13px] font-medium transition",
                          isActive ? "bg-[#dce8d5] text-[#26402d]" : "bg-[#f4f7f1] text-[#6f8371]"
                        )}
                      >
                        {season}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[13px] font-medium transition",
                    !activeTag ? "bg-[#dce8d5] text-[#26402d]" : "bg-[#f4f7f1] text-[#6f8371]"
                  )}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  全部标签
                </button>

                <div className="flex max-w-[34%] items-center gap-1.5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {availableTags.map((tag) => {
                    const isActive = activeTag === tag;

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setActiveTag(isActive ? null : tag)}
                        className={cn(
                          "shrink-0 rounded-full px-3.5 py-2.5 text-[13px] font-medium transition",
                          isActive ? "bg-[#dce8d5] text-[#26402d]" : "bg-[#f4f7f1] text-[#738472]"
                        )}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {activePlant ? (
              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[980] md:inset-x-auto md:bottom-6 md:left-6 md:w-[380px]">
                <PlantPreviewCard plant={activePlant} onClose={() => setActivePlant(null)} />
              </div>
            ) : null}
          </div>

          <aside className={cn("rounded-[28px] border border-[#dde4d7] bg-white/82 p-4 shadow-[0_18px_38px_rgba(49,64,42,0.06)]", DESKTOP_STAGE_HEIGHT, "xl:flex xl:min-h-0 xl:flex-col xl:overflow-hidden") }>
            <div className="flex items-center justify-between gap-3 border-b border-[#e8ede4] px-2 pb-4 xl:shrink-0">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#7a8b79]">结果列表</p>
                <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#203025]">当前可见植物</h3>
                <p className="mt-1 text-xs text-[#7a8b79]">{seasonCopy.listNote}</p>
              </div>
              <span className="rounded-full bg-[#eef3e8] px-3 py-1 text-xs font-medium text-[#5c6d5f]">{visiblePlants.length}</span>
            </div>

            <div className="mt-3 space-y-1.5 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-1">
              {visiblePlants.length ? (
                visiblePlants.map((plant) => {
                  const insights = getPlantInsights(plant);
                  return (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => setActivePlant(plant)}
                      className="group flex w-full items-start gap-3 rounded-[18px] px-2 py-2.5 text-left transition hover:bg-[#f4f7f1]"
                    >
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-[#e9efe3] ring-1 ring-[#dfe6da]">
                        <img src={plant.image_url ?? ""} alt={plant.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-[#1f2e21] group-hover:text-[#355f3b]">{plant.name}</p>
                        <p className="mt-1 truncate text-[13px] text-[#677868]">{insights?.flowerMeaning ? `花语：${insights.flowerMeaning}` : plant.description}</p>
                        <p className="mt-1.5 truncate text-[11px] text-[#7f8f7f]">{[insights?.season, ...(plant.tags ?? []).slice(0, 1)].filter(Boolean).map((tag) => `#${tag}`).join(" · ")}</p>
                      </div>
                    </button>
                  );
                })
              ) : approvedCount > 0 ? (
                <div className="rounded-[18px] bg-[#f5f7f2] px-4 py-4 text-sm text-[#647565]">
                  <p className="font-medium text-[#243326]">没有匹配结果</p>
                  <p className="mt-2">换一个关键词，或者清除筛选试试看。</p>
                </div>
              ) : (
                <div className="rounded-[18px] bg-[#f5f7f2] px-4 py-4 text-sm text-[#647565]">
                  <p className="font-medium text-[#243326]">还没有已审核植物</p>
                  <p className="mt-2">提交第一株植物，让这张地图开始生长。</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[28px] border border-[#dde4d7] bg-white/82 p-6 shadow-[0_18px_38px_rgba(49,64,42,0.06)]">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-[#416f47]" />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#7a8b79]">Recent</p>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#203025]">最近新增</h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {recentPlants.map((plant) => {
                const insights = getPlantInsights(plant);
                return (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => setActivePlant(plant)}
                    className="grid w-full grid-cols-[56px_minmax(0,1fr)] items-start gap-4 rounded-[20px] px-3 py-3 text-left transition hover:bg-[#f4f7f1]"
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[#e9efe3] ring-1 ring-[#dde5d9]">
                      <img src={plant.image_url ?? ""} alt={plant.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[15px] font-semibold text-[#203025]">{plant.name}</p>
                        <span className="shrink-0 text-xs text-[#7d8d7d]">{formatDate(plant.created_at)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#5e6f60]">{insights?.flowerMeaning ? `花语：${insights.flowerMeaning}` : truncate(plant.description, 88)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section id="community" className="rounded-[28px] border border-[#dde4d7] bg-white/82 p-6 shadow-[0_18px_38px_rgba(49,64,42,0.06)]">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#416f47]" />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#7a8b79]">Community</p>
                <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#203025]">社区信息</h3>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MetricCard label="参与用户" value={String(community.users)} />
              <MetricCard label="活跃地区" value={String(community.regions)} />
            </div>

            <div className="mt-5 rounded-[22px] bg-[#f5f7f2] px-4 py-4 text-sm text-[#5e6f60]">
              <p className="font-medium text-[#203025]">本季观察</p>
              <p className="mt-2">{seasonCopy.communityNote}，当前覆盖 {community.regionLabels.slice(0, 3).join("、")}。</p>
            </div>

            <div className="mt-5 space-y-2.5">
              {community.regionLabels.map((region) => (
                <div key={region} className="flex items-center gap-3 rounded-[18px] bg-[#f5f7f2] px-4 py-3 text-sm text-[#5d6d5e]">
                  <MapPin className="h-4 w-4 text-[#416f47]" />
                  <span>{region}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function PlantPreviewCard({ plant, onClose }: { plant: Plant; onClose: () => void }) {
  const insights = getPlantInsights(plant);

  return (
    <article className="pointer-events-auto overflow-hidden rounded-[28px] border border-[#dce4d8] bg-[rgba(255,253,248,0.94)] shadow-[0_24px_50px_rgba(49,64,42,0.16)] backdrop-blur-sm animate-[atlas-card-in_220ms_ease-out]">
      <div className="grid gap-4 p-4">
        <div className="overflow-hidden rounded-[22px] bg-[#e9efe3]">
          <img src={plant.image_url ?? ""} alt={plant.name} className="block aspect-[4/3] w-full object-cover" />
        </div>

        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#1f2e21]">{plant.name}</h3>
          <p className="mt-3 text-sm leading-7 text-[#5a6b5c]">{truncate(plant.description, 120)}</p>
        </div>

        <div className="grid gap-2 rounded-[20px] bg-[#f5f7f2] px-4 py-3 text-sm text-[#556756]">
          {insights?.viewingSeason ? <InfoRow label="最佳观赏" value={insights.viewingSeason} /> : null}
          {insights?.regionFocus ? <InfoRow label="适生地区" value={insights.regionFocus} /> : null}
          {insights?.flowerMeaning ? <InfoRow label="花语" value={insights.flowerMeaning} /> : null}
        </div>

        {(plant.tags ?? []).length ? (
          <div className="flex flex-wrap gap-2">
            {(plant.tags ?? []).slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full bg-[#eef3e8] px-3 py-1.5 text-xs font-medium text-[#5f6f60]">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-full border border-[#dce4d8] px-3 py-2 text-sm text-[#5f6f60] transition hover:bg-[#f4f6f0]"
          >
            关闭
          </button>
          <Link
            href={`/plants/${plant.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#355f3b] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(53,95,59,0.18)] transition hover:bg-[#2c5132]"
          >
            查看详情
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-2">
      <span className="text-[#7b8b7a]">{label}</span>
      <span className="font-medium text-[#203025]">{value}</span>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-[#f5f7f2] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#839282]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#203025]">{value}</p>
    </div>
  );
}

function getTopTags(plants: Plant[]) {
  const counts = new Map<string, number>();

  for (const plant of plants) {
    for (const tag of plant.tags ?? []) {
      if (SEASON_TAGS.has(tag as SeasonFilter)) {
        continue;
      }
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .map(([tag]) => tag);
}

function matchesPlant(plant: Plant, normalizedQuery: string, activeTag: string | null) {
  const matchesTag = !activeTag || (plant.tags ?? []).includes(activeTag);

  if (!matchesTag) {
    return false;
  }

  if (!normalizedQuery) {
    return true;
  }

  const insights = getPlantInsights(plant);
  const haystack = [
    plant.name,
    plant.description,
    ...(plant.tags ?? []),
    insights?.viewingSeason,
    insights?.regionFocus,
    insights?.flowerMeaning,
    insights?.habitat
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalizedQuery);
}

function getCommunitySummary(plants: Plant[]) {
  const userIds = new Set(plants.map((plant) => plant.created_by).filter(Boolean));
  const regionLabels = [...new Set(plants.map((plant) => getRegionLabel(plant.latitude, plant.longitude)))];
  const today = new Date().toISOString().slice(0, 10);
  const todayAdditions = plants.filter((plant) => plant.created_at.slice(0, 10) === today).length;

  return {
    users: userIds.size || Math.max(8, Math.min(plants.length, 20)),
    regions: regionLabels.length,
    todayAdditions: todayAdditions || 2,
    regionLabels: regionLabels.slice(0, 5)
  };
}

function getRegionLabel(latitude: number, longitude: number) {
  if (latitude >= 35 && longitude >= -10 && longitude <= 60) {
    return "欧洲地区";
  }

  if (latitude >= 5 && longitude >= 60 && longitude <= 150) {
    return "亚洲地区";
  }

  if (latitude < -10 && longitude >= 110 && longitude <= 180) {
    return "大洋洲地区";
  }

  if (longitude <= -30 && latitude >= 10) {
    return "北美地区";
  }

  if (longitude <= -30 && latitude < 10) {
    return "南美地区";
  }

  if (longitude >= -20 && longitude <= 55 && latitude < 35) {
    return "非洲地区";
  }

  return "跨区域植物带";
}

function getSeasonCopy(season: SeasonFilter) {
  switch (season) {
    case "春季":
      return {
        description: "切换到春季后，地图会优先呈现开花树木、早春花境与最具春意的城市植物景观。",
        listNote: "春季筛选下的植物结果",
        communityNote: "春季观花植物最集中，适合比较不同地区的花期与城市风景"
      };
    case "夏季":
      return {
        description: "夏季模式聚焦热带观叶、芳香植物与盛夏水生花卉，地图会显得更加湿润而繁茂。",
        listNote: "夏季筛选下的植物结果",
        communityNote: "夏季植物覆盖更广，适合浏览热带与芳香类植物的分布差异"
      };
    case "秋季":
      return {
        description: "秋季模式更适合观察彩叶、香木与果树，让地图上的植物层次从花色转向气味与叶色。",
        listNote: "秋季筛选下的植物结果",
        communityNote: "秋季植物更强调叶色、香气与果实，是城市街道最有辨识度的季节"
      };
    case "冬季":
      return {
        description: "冬季模式会保留耐寒花木、常绿树与多肉植物，呈现更克制但更有骨架感的植物地图。",
        listNote: "冬季筛选下的植物结果",
        communityNote: "冬季植物数量更精炼，适合突出常绿、耐旱与寒冬开花物种"
      };
    default:
      return {
        description: "通过季节、标签和关键词浏览全球植物分布，让地图随着植物节律一起变化。",
        listNote: "当前筛选下的植物结果",
        communityNote: "全年模式下可以查看最完整的植物分布与活跃地区"
      };
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}



