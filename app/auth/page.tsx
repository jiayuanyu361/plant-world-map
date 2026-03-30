import { AuthForms } from "@/components/auth-forms";

type AuthPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const message = typeof params.message === "string" ? params.message : undefined;

  return (
    <div className="space-y-6">
      <section className="panel rounded-[32px] p-8">
        <h1 className="text-4xl font-bold tracking-tight">登录与注册</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
          用户系统基于 Supabase Auth。注册后会自动在 `user_profiles` 建立资料，
          登录用户可以发表评论，也可以提交新的植物记录。
        </p>
      </section>
      <AuthForms error={error} message={message} />
    </div>
  );
}
