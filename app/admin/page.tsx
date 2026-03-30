import { ReviewQueue } from "@/components/review-queue";
import { getPendingPlants, requireAdmin } from "@/lib/data/plants";

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();
  const plants = await getPendingPlants();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <div className="space-y-6">
      <section className="panel rounded-[32px] p-8">
        <h1 className="text-4xl font-bold tracking-tight">Admin Review Queue</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
          这里展示所有 `pending` 状态的植物。管理员可以执行 approve / reject，
          审核通过后该植物会出现在地图首页。
        </p>
        {error ? (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </section>
      <ReviewQueue plants={plants} />
    </div>
  );
}
