import Link from "next/link";
import { Leaf, Shield, Sprout } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/data/plants";
import { signOutAction } from "@/lib/actions";

export async function Header() {
  const { user, profile } = await getCurrentUserProfile();

  return (
    <header className="shell pt-6">
      <div className="panel flex flex-col gap-4 rounded-[28px] px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              Plant World Map
            </Link>
            <p className="text-sm text-[var(--muted)]">
              用地图记录世界各地的植物故事
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="btn btn-secondary" href="/">
            地图首页
          </Link>
          <Link className="btn btn-secondary" href="/submit">
            <Sprout className="h-4 w-4" />
            提交植物
          </Link>
          {profile?.is_admin ? (
            <Link className="btn btn-secondary" href="/admin">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
          {user ? (
            <form action={signOutAction}>
              <button className="btn btn-primary" type="submit">
                退出登录
              </button>
            </form>
          ) : (
            <Link className="btn btn-primary" href="/auth">
              登录 / 注册
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
