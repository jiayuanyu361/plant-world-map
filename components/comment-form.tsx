import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
import { createCommentAction } from "@/lib/actions";

type CommentFormProps = {
  plantId: string;
  canComment: boolean;
};

export function CommentForm({ plantId, canComment }: CommentFormProps) {
  if (!canComment) {
    return (
      <div className="rounded-[24px] border border-dashed border-[var(--border)] bg-white/50 p-5 text-sm leading-7 text-[var(--muted)]">
        登录后可以发布观察、养护心得和与这株植物有关的故事。
        <Link href="/auth" className="ml-2 font-semibold text-[var(--accent)]">
          去登录
        </Link>
      </div>
    );
  }

  return (
    <form action={createCommentAction} className="space-y-4 rounded-[24px] border border-[var(--border)] bg-white/72 p-5 shadow-[0_12px_24px_rgba(31,51,29,0.06)]">
      <input type="hidden" name="plantId" value={plantId} />
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-[var(--accent-strong)]">留下你的观察</span>
        <textarea
          name="content"
          required
          rows={5}
          className="min-h-[148px] w-full resize-y rounded-[22px] border border-[var(--border)] bg-white px-5 py-4 text-base leading-8 text-[var(--foreground)] outline-none transition focus:border-[rgba(53,95,59,0.5)] focus:ring-4 focus:ring-[rgba(53,95,59,0.12)]"
          placeholder="比如：花期、香气、叶片变化、你看到它时的季节，或者这株植物和地点之间的小故事。"
        />
      </label>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs leading-6 text-[var(--muted)]">评论会公开展示在这株植物下，建议补充真实观察和地点感受。</p>
        <button className="btn btn-primary shrink-0" type="submit">
          <MessageCircleMore className="h-4 w-4" />
          发布评论
        </button>
      </div>
    </form>
  );
}
