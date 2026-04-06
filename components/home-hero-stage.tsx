"use client";

import { ArrowRight, Compass, Globe2, MapPinned, Sprout, Users } from "lucide-react";
import type { ReactNode } from "react";
import { filterPlantsWithRealImages } from "@/lib/demo-atlas";
import type { Plant } from "@/lib/types";

type HomeHeroStageProps = {
  plants: Plant[];
};

const FEATURED_HERO_ORDER = ["\u8377\u82b1", "\u94f6\u674f", "\u7d2b\u85e4", "\u6a31\u82b1", "\u84dd\u82b1\u6979", "\u5c71\u8336"];

function pickFeaturedPlants(plants: Plant[]) {
  const ordered: Plant[] = [];
  const usedIds = new Set<string>();

  for (const targetName of FEATURED_HERO_ORDER) {
    const match = plants.find((plant) => plant.name.trim() === targetName);
    if (match && !usedIds.has(match.id)) {
      ordered.push(match);
      usedIds.add(match.id);
    }
  }

  const remainder = plants
    .filter((plant) => !usedIds.has(plant.id))
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());

  return [...ordered, ...remainder];
}

export function HomeHeroStage({ plants }: HomeHeroStageProps) {
  const displayPlants = filterPlantsWithRealImages(plants);
  const featured = pickFeaturedPlants(displayPlants).slice(0, 3);
  const stats = getHomeStats(displayPlants);
  const heroPlant = featured[0];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f2e9_0%,#eef2e6_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(194,209,182,0.26),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(223,230,210,0.24),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(201,216,194,0.22),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-[88vh] w-[min(1240px,calc(100vw-32px))] flex-col px-1 pb-12 pt-6 md:px-2 md:pt-8 lg:pb-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#d6ddd0] bg-white px-4 py-2.5 text-sm font-semibold text-[#213226] shadow-[0_12px_24px_rgba(40,60,40,0.08)]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#355f3b] text-white shadow-[0_10px_18px_rgba(53,95,59,0.22)]">
              <Sprout className="h-4 w-4" />
            </span>
            植物世界地图
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href="#community"
              className="inline-flex items-center gap-2 rounded-full border border-[#d9e5d6] bg-[#ffffff] px-4 py-2.5 font-medium shadow-[0_4px_12px_rgba(31,59,45,0.06)] transition hover:border-[#bfd0bc] hover:bg-[#f3f7f1] hover:shadow-[0_8px_18px_rgba(31,59,45,0.1)]"
              style={{ color: "#111111", opacity: 1 }}
            >
              社区
            </a>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full border border-[#d9e5d6] bg-[#ffffff] px-4 py-2.5 font-medium shadow-[0_4px_12px_rgba(31,59,45,0.06)] transition hover:border-[#bfd0bc] hover:bg-[#f3f7f1] hover:shadow-[0_8px_18px_rgba(31,59,45,0.1)]"
              style={{ color: "#111111", opacity: 1 }}
            >
              登录 / 注册
            </a>
            <a
              href="#explore-stage"
              className="inline-flex items-center gap-2 rounded-full border border-[#d9e5d6] bg-[#ffffff] px-4 py-2.5 font-medium shadow-[0_4px_12px_rgba(31,59,45,0.06)] transition hover:border-[#bfd0bc] hover:bg-[#f3f7f1] hover:shadow-[0_8px_18px_rgba(31,59,45,0.1)]"
              style={{ color: "#111111", opacity: 1 }}
            >
              进入地图
              <MapPinned className="h-4 w-4" />
            </a>
            <a
              href="/submit"
              className="inline-flex items-center gap-2 rounded-full bg-[#2f6f46] px-4 py-2.5 font-semibold text-white shadow-[0_8px_20px_rgba(47,111,70,0.2)] transition hover:bg-[#25593a] hover:shadow-[0_12px_24px_rgba(47,111,70,0.24)]"
            >
              提交植物
            </a>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-14 lg:py-14">
          <div className="max-w-[590px]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#63745f]">植物图鉴 Atlas</p>
            <h1 className="mt-5 text-[clamp(2.9rem,5.8vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#1d2b1f]">
              在地图上发现世界植物
            </h1>
            <p className="mt-5 max-w-[520px] text-[17px] leading-8 text-[#516352]">
              记录、浏览与共建全球各地的植物故事
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              <StatCard icon={<Sprout className="h-4 w-4" />} value={String(stats.plantCount)} label="已收录植物" />
              <StatCard icon={<Globe2 className="h-4 w-4" />} value={String(stats.regionCount)} label="活跃地区" />
              <StatCard icon={<Users className="h-4 w-4" />} value={String(stats.userCount)} label="参与用户" />
              <StatCard icon={<Compass className="h-4 w-4" />} value={`+${stats.todayAdditions}`} label="今日新增" />
            </div>

            <div className="mt-6 rounded-[24px] border border-[#dbe2d4] bg-white/84 px-5 py-4 shadow-[0_14px_30px_rgba(40,60,40,0.06)]">
              <p className="text-sm text-[#556756]">
                最近更新：<span className="font-semibold text-[#213226]">今日新增 {stats.todayAdditions} 条记录</span>
                <span className="mx-2 text-[#93a191]">·</span>
                正在连接 {stats.regionPreview.join("、")}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#explore-stage"
                className="inline-flex items-center gap-2 rounded-full bg-[#2f6f46] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,111,70,0.2)] transition hover:bg-[#25593a] hover:shadow-[0_12px_26px_rgba(47,111,70,0.24)]"
              >
                进入植物星球
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#popular-plants"
                className="inline-flex items-center gap-2 rounded-full border border-[#d9e5d6] bg-[#ffffff] px-5 py-3.5 text-sm font-semibold shadow-[0_4px_12px_rgba(31,59,45,0.06)] transition hover:border-[#bfd0bc] hover:bg-[#f3f7f1] hover:shadow-[0_8px_18px_rgba(31,59,45,0.1)]"
                style={{ color: "#111111", opacity: 1 }}
              >
                浏览植物
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-12 h-36 w-36 rounded-full bg-[#dce8c8]/80 blur-3xl" />
            <div className="absolute -right-6 bottom-10 h-36 w-36 rounded-full bg-[#dde7d7]/80 blur-3xl" />

            <div className="relative grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <article className="overflow-hidden rounded-[32px] border border-[#dbe3d5] bg-white shadow-[0_22px_50px_rgba(40,60,40,0.1)]">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#ecf1e8]">
                  {heroPlant?.image_url ? (
                    <img src={heroPlant.image_url} alt={heroPlant.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="atlas-placeholder h-full w-full" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(18,27,20,0)_0%,rgba(18,27,20,0.68)_100%)] p-5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/72">精选植物</p>
                    <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.04em]">{heroPlant?.name ?? "植物正在等待被发现"}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/82">
                      {truncate(heroPlant?.description ?? "从城市庭院到山野秘境，植物正在地图上等待被看见。", 70)}
                    </p>
                  </div>
                </div>
              </article>

              <div className="flex flex-col gap-4">
                {featured.slice(1).map((plant) => (
                  <article
                    key={plant.id}
                    className="overflow-hidden rounded-[28px] border border-[#dbe3d5] bg-white shadow-[0_18px_42px_rgba(40,60,40,0.08)] transition hover:-translate-y-0.5"
                  >
                    <div className="grid grid-cols-[120px_minmax(0,1fr)]">
                      <div className="min-h-[150px] overflow-hidden bg-[#eef3e8]">
                        {plant.image_url ? (
                          <img src={plant.image_url} alt={plant.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="atlas-placeholder h-full w-full" />
                        )}
                      </div>
                      <div className="space-y-3 px-4 py-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#7a8b79]">精选植物</p>
                        <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#213224]">{plant.name}</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {formatTags(plant.tags).slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full bg-[#eef3e8] px-2.5 py-1 text-[11px] font-medium text-[#5f6f60]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-[#dce4d7] bg-white px-4 py-4 shadow-[0_12px_24px_rgba(40,60,40,0.05)]">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef3e8] text-[#3f6e4f]">{icon}</div>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#1f2e21]">{value}</p>
      <p className="mt-1 text-sm text-[#627362]">{label}</p>
    </div>
  );
}

function getHomeStats(plants: Plant[]) {
  const userIds = new Set(plants.map((plant) => plant.created_by).filter(Boolean));
  const regions = [...new Set(plants.map((plant) => getRegionLabel(plant.latitude, plant.longitude)))];
  const today = new Date().toISOString().slice(0, 10);
  const todayAdditions = plants.filter((plant) => plant.created_at.slice(0, 10) === today).length;

  return {
    plantCount: plants.length,
    regionCount: regions.length,
    userCount: userIds.size || Math.max(6, Math.min(plants.length, 18)),
    todayAdditions: todayAdditions || 2,
    regionPreview: regions.slice(0, 3)
  };
}

function getRegionLabel(latitude: number, longitude: number) {
  if (latitude >= 35 && longitude >= -10 && longitude <= 60) {
    return "欧洲";
  }

  if (latitude >= 5 && longitude >= 60 && longitude <= 150) {
    return "亚洲";
  }

  if (latitude < -10 && longitude >= 110 && longitude <= 180) {
    return "大洋洲";
  }

  if (longitude <= -30 && latitude >= 10) {
    return "北美";
  }

  if (longitude <= -30 && latitude < 10) {
    return "南美";
  }

  if (longitude >= -20 && longitude <= 55 && latitude < 35) {
    return "非洲";
  }

  return "跨区域";
}

function formatTags(tags?: string[]) {
  return (tags ?? []).filter(Boolean);
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3)}...`;
}



