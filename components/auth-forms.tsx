import { signInAction, signUpAction } from "@/lib/actions";

type AuthFormsProps = {
  error?: string;
  message?: string;
};

export function AuthForms({ error, message }: AuthFormsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="panel rounded-[28px] p-6">
        <h2 className="text-2xl font-semibold">登录</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          使用邮箱和密码登录，发表评论与提交植物。
        </p>
        <form action={signInAction} className="mt-6 space-y-4">
          <input className="field" name="email" type="email" placeholder="邮箱" required />
          <input className="field" name="password" type="password" placeholder="密码" required />
          <button className="btn btn-primary w-full" type="submit">
            登录
          </button>
        </form>
      </section>

      <section className="panel rounded-[28px] p-6">
        <h2 className="text-2xl font-semibold">注册</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          创建账户后即可分享你在世界各地发现的植物。
        </p>
        <form action={signUpAction} className="mt-6 space-y-4">
          <input className="field" name="username" type="text" placeholder="用户名" required />
          <input className="field" name="email" type="email" placeholder="邮箱" required />
          <input className="field" name="password" type="password" placeholder="密码" required />
          <button className="btn btn-primary w-full" type="submit">
            注册
          </button>
        </form>
      </section>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 lg:col-span-2">
          {message}
        </p>
      ) : null}
    </div>
  );
}
