import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel rounded-[32px] p-8">
      <h1 className="text-3xl font-semibold">页面不存在</h1>
      <p className="mt-3 text-[var(--muted)]">你访问的植物记录不存在，或者已经被移除。</p>
      <Link href="/" className="btn btn-primary mt-6">
        返回首页
      </Link>
    </div>
  );
}
