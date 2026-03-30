import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import { MapView } from "@/components/map-view";
import { TagList } from "@/components/tag-list";
import { getApprovedPlants } from "@/lib/data/plants";

export default async function HomePage() {
  const plants = await getApprovedPlants();
  const featured = plants.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel rounded-[32px] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
            Explore by location
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
            用一张互动地图，把全球植物发现连接起来。
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
            首页从 Supabase 读取 `status=approved` 的植物数据，在 Leaflet 世界地图上展示为 marker。
            地图底图使用 OpenStreetMap，点击任意植物 marker 即可进入详情页查看图片、描述、标签与评论。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/submit" className="btn btn-primary">
              立即提交植物
            </Link>
            <Link href="/auth" className="btn btn-secondary">
              登录后参与评论
            </Link>
          </div>
        </div>

        <div className="panel rounded-[32px] p-8">
          <div className="flex items-center gap-3 text-[var(--accent)]">
            <MapPinned className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.25em]">
              Latest Approved Plants
            </span>
          </div>
          <div className="mt-6 space-y-5">
            {featured.length ? (
              featured.map((plant) => (
                <Link
                  key={plant.id}
                  href={`/plants/${plant.id}`}
                  className="block rounded-[24px] border border-[var(--border)] bg-white/50 p-4 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">{plant.name}</h2>
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                        {plant.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
                  </div>
                  <TagList tags={plant.tags ?? []} className="mt-4" />
                </Link>
              ))
            ) : (
              <p className="rounded-[24px] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
                当前还没有已审核植物。你可以先去提交页面添加一条测试数据。
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="panel rounded-[36px] p-3">
        <MapView plants={plants} />
      </section>
    </div>
  );
}
