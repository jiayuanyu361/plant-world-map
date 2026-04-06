import Link from "next/link";
import { createCommentAction } from "@/lib/actions";

type CommentFormProps = {
  plantId: string;
  canComment: boolean;
};

export function CommentForm({ plantId, canComment }: CommentFormProps) {
  if (!canComment) {
    return (
      <div className="rounded-[24px] border border-dashed border-[var(--border)] p-5 text-subtle">
        Sign in to leave a comment and share your observations, growing tips, or location stories.
        <Link href="/auth" className="ml-2 font-semibold text-[var(--accent)]">
          Sign in
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
        placeholder="Share what you noticed about this plant, how you care for it, or the story behind where it was found..."
      />
      <button className="btn btn-primary" type="submit">
        Post Comment
      </button>
    </form>
  );
}
