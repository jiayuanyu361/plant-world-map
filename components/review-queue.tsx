import { reviewPlantAction } from "@/lib/actions";
import type { Plant } from "@/lib/types";
import { TagList } from "@/components/tag-list";

type ReviewQueueProps = {
  plants: Plant[];
};

export function ReviewQueue({ plants }: ReviewQueueProps) {
  if (!plants.length) {
    return (
      <div className="panel rounded-[28px] p-6 text-[var(--muted)]">
        当前没有待审核植物。
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {plants.map((plant) => (
        <article key={plant.id} className="panel rounded-[28px] p-5 md:p-6">
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <div className="aspect-[4/3] overflow-hidden rounded-[24px] bg-stone-200">
              {plant.image_url ? (
                <img src={plant.image_url} alt={plant.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
                  无图片
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{plant.name}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    坐标：{plant.latitude}, {plant.longitude}
                  </p>
                </div>
                <div className="flex gap-3">
                  <form action={reviewPlantAction}>
                    <input type="hidden" name="plantId" value={plant.id} />
                    <input type="hidden" name="status" value="approved" />
                    <button className="btn btn-primary" type="submit">
                      Approve
                    </button>
                  </form>
                  <form action={reviewPlantAction}>
                    <input type="hidden" name="plantId" value={plant.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button className="btn btn-secondary" type="submit">
                      Reject
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-4 leading-7 text-[var(--foreground)]/85">{plant.description}</p>
              <TagList tags={plant.tags ?? []} className="mt-4" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
