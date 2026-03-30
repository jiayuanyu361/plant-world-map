import Link from "next/link";
import { createCommentAction } from "@/lib/actions";

type CommentFormProps = {
  plantId: string;
  canComment: boolean;
};

export function CommentForm({ plantId, canComment }: CommentFormProps) {
  if (!canComment) {
    return (
      <div className="rounded-[24px] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
        登录后可以发表评论。
        <Link href="/auth" className="ml-2 font-semibold text-[var(--accent)]">
          去登录
        </Link>
      </div>
    );
  }

  return (
    <form action={createCommentAction} className="space-y-4 rounded-[24px] border border-[var(--border)] bg-white/60 p-5">
      <input type="hidden" name="plantId" value={plantId} />
      <textarea
        name="content"
        required
        rows={4}
        className="field"
        placeholder="写下你对这株植物的观察、种植经验或地点故事..."
      />
      <button className="btn btn-primary" type="submit">
        发布评论
      </button>
    </form>
  );
}
