import { cn } from "@/lib/utils";

type TagListProps = {
  tags: string[];
  className?: string;
};

export function TagList({ tags, className }: TagListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium text-[var(--accent-strong)]"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}
