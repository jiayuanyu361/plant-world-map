import Link from "next/link";
import { Leaf, LogOut, Shield, Sprout, UserCircle2 } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/data/plants";
import { signOutAction } from "@/lib/actions";

function buildDisplayName(username: string | null | undefined, email: string | null | undefined) {
  if (username && username.trim()) {
    return username.trim();
  }

  if (email) {
    return email.split("@")[0];
  }

  return "植物旅人";
}

function buildAvatarLabel(name: string) {
  return name.trim().charAt(0).toUpperCase() || "P";
}

export async function Header() {
  const { user, profile } = await getCurrentUserProfile();
  const displayName = buildDisplayName(profile?.username, user?.email ?? null);
  const avatarLabel = buildAvatarLabel(displayName);

  return (
    <header className="shell pt-6">
      <div className="panel flex flex-col gap-4 rounded-[28px] px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-[0_14px_30px_rgba(30,64,37,0.18)]">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <Link href="/" className="text-[1.15rem] font-bold tracking-tight text-[var(--accent-strong)]">
              植物世界地图
            </Link>
            <p className="text-note mt-1">记录全球植物发现与社区故事的活地图</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-end gap-3 text-sm">
          <Link className="btn btn-secondary" href="/">
            探索地图
          </Link>
          <Link className="btn btn-secondary" href="/submit">
            <Sprout className="h-4 w-4" />
            提交植物
          </Link>
          {profile?.is_admin ? (
            <Link className="btn btn-secondary" href="/admin">
              <Shield className="h-4 w-4" />
              审核后台
            </Link>
          ) : null}
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-white/88 px-3 py-2 shadow-[0_10px_24px_rgba(31,51,29,0.08)]">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent-strong)]">
                    {avatarLabel}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium tracking-[0.08em] text-[var(--muted)]">欢迎回来</p>
                  <p className="truncate text-sm font-semibold text-[var(--accent-strong)]">{displayName}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                </div>
              </div>
              <form action={signOutAction}>
                <button className="btn btn-primary" type="submit">
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </form>
            </>
          ) : (
            <Link className="btn btn-primary" href="/auth">
              <UserCircle2 className="h-4 w-4" />
              登录 / 注册
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

