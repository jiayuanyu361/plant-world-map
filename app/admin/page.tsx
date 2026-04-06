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
        <p className="eyebrow">Review Dashboard</p>
        <h1 className="title-page mt-3">Pending plant submissions</h1>
        <p className="text-subtle mt-4 max-w-2xl">
          Review plants that are waiting for approval. Once approved, they become visible on the homepage map.
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
