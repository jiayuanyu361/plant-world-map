import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { TagList } from "@/components/tag-list";
import { getCurrentUserProfile, getPlantById, getPlantComments } from "@/lib/data/plants";
import { formatDate } from "@/lib/utils";

type PlantDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlantDetailPage({
  params,
  searchParams
}: PlantDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const plant = await getPlantById(id);
  const comments = await getPlantComments(id);
  const { user } = await getCurrentUserProfile();

  if (!plant) {
    notFound();
  }

  const error = typeof query.error === "string" ? query.error : undefined;
  const atlas = plant.atlas ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="panel overflow-hidden rounded-[32px]">
        <div className="aspect-[16/10] bg-stone-200">
          {plant.image_url ? (
            <img src={plant.image_url} alt={plant.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
              暂无植物图片
            </div>
          )}
        </div>
        <div className="p-7 md:p-8">
          <p className="eyebrow">植物详情</p>
          <h1 className="title-page mt-3">{plant.name}</h1>
          {atlas?.scientific_name ? (
            <p className="mt-2 text-sm italic text-[var(--muted)]">{atlas.scientific_name}</p>
          ) : null}
          <p className="text-body mt-5">{plant.description}</p>
          <TagList tags={plant.tags ?? []} className="mt-6" />

          {atlas ? (
            <div className="mt-6 grid gap-3 rounded-[24px] border border-[var(--border)] bg-white/60 p-5 text-sm text-[var(--foreground)]/82 md:grid-cols-2">
              {atlas.viewing_season ? <InfoRow label="最佳观赏" value={atlas.viewing_season} /> : null}
              {atlas.region_focus ? <InfoRow label="适生地区" value={atlas.region_focus} /> : null}
              {atlas.habitat ? <InfoRow label="生长环境" value={atlas.habitat} /> : null}
              {atlas.flower_meaning ? <InfoRow label="花语" value={atlas.flower_meaning} /> : null}
            </div>
          ) : null}

          <div className="text-note mt-6">坐标：{plant.latitude}, {plant.longitude}</div>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="panel rounded-[32px] p-6 md:p-7">
          <h2 className="title-section">评论</h2>
          <p className="text-subtle mt-2">
            登录后可以分享你的观察、养护经验，或补充这株植物与地点之间的故事。
          </p>
          {error ? (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <div className="mt-5">
            <CommentForm plantId={plant.id} canComment={Boolean(user)} />
          </div>
        </section>

        <section className="panel rounded-[32px] p-6 md:p-7">
          <div className="space-y-4">
            {comments.length ? (
              comments.map((comment) => (
                <article key={comment.id} className="rounded-[24px] border border-[var(--border)] bg-white/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{comment.user_profiles?.username || "匿名用户"}</p>
                    <span className="text-note">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]/85">
                    {comment.content}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-[24px] border border-dashed border-[var(--border)] p-5 text-subtle">
                还没有评论，来留下第一条观察吧。
              </p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{label}</span>
      <span className="leading-6 text-[var(--foreground)]">{value}</span>
    </div>
  );
}
