import { cn } from "@/lib/utils";

type TagListProps = {
  tags: string[];
  className?: string;
};

export function TagList({ tags, className }: TagListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-emerald-200/80 bg-[linear-gradient(180deg,rgba(233,243,216,0.92),rgba(220,232,204,0.9))] px-3.5 py-1.5 text-[13px] font-semibold tracking-tight text-[var(--accent-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
