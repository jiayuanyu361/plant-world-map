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

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="panel overflow-hidden rounded-[32px]">
        <div className="aspect-[16/10] bg-stone-200">
          {plant.image_url ? (
            <img src={plant.image_url} alt={plant.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
              暂无图片
            </div>
          )}
        </div>
        <div className="p-7">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">Plant Detail</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">{plant.name}</h1>
          <p className="mt-5 leading-8 text-[var(--foreground)]/85">{plant.description}</p>
          <TagList tags={plant.tags ?? []} className="mt-6" />
          <div className="mt-6 text-sm text-[var(--muted)]">
            坐标：{plant.latitude}, {plant.longitude}
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="panel rounded-[32px] p-6">
          <h2 className="text-2xl font-semibold">评论</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            登录用户可以发表评论，分享观察、养护经验或发现过程。
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

        <section className="panel rounded-[32px] p-6">
          <div className="space-y-4">
            {comments.length ? (
              comments.map((comment) => (
                <article key={comment.id} className="rounded-[24px] border border-[var(--border)] bg-white/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">
                      {comment.user_profiles?.username || "匿名用户"}
                    </p>
                    <span className="text-xs text-[var(--muted)]">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]/85">
                    {comment.content}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-[24px] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
                暂时还没有评论，来留下第一条吧。
              </p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
