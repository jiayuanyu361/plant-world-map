import Link from "next/link";
import { SubmitPlantForm } from "@/components/submit-plant-form";
import { getCurrentUserProfile } from "@/lib/data/plants";

type SubmitPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const message = typeof params.message === "string" ? params.message : undefined;
  const { user } = await getCurrentUserProfile();

  if (!user) {
    return (
      <div className="panel rounded-[32px] p-8">
        <h1 className="text-3xl font-semibold">提交植物前请先登录</h1>
        <p className="mt-3 text-[var(--muted)]">
          登录后才能提交新的植物记录，并自动关联到你的账号。
        </p>
        <Link href="/auth" className="btn btn-primary mt-6">
          去登录
        </Link>
      </div>
    );
  }

  return <SubmitPlantForm error={error} message={message} />;
}
