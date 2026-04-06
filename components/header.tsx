import Link from "next/link";
import { Leaf, Shield, Sprout } from "lucide-react";
import { getCurrentUserProfile } from "@/lib/data/plants";
import { signOutAction } from "@/lib/actions";

export async function Header() {
  const { user, profile } = await getCurrentUserProfile();

  return (
    <header className="shell pt-6">
      <div className="panel flex flex-col gap-4 rounded-[28px] px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-[0_14px_30px_rgba(30,64,37,0.18)]">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <Link href="/" className="text-[1.15rem] font-bold tracking-tight text-[var(--accent-strong)]">
              Plant World Map
            </Link>
            <p className="text-note mt-1">A living atlas for global plant discoveries and community stories</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="btn btn-secondary" href="/">
            Explore Map
          </Link>
          <Link className="btn btn-secondary" href="/submit">
            <Sprout className="h-4 w-4" />
            Submit Plant
          </Link>
          {profile?.is_admin ? (
            <Link className="btn btn-secondary" href="/admin">
              <Shield className="h-4 w-4" />
              Review Dashboard
            </Link>
          ) : null}
          {user ? (
            <form action={signOutAction}>
              <button className="btn btn-primary" type="submit">
                Sign Out
              </button>
            </form>
          ) : (
            <Link className="btn btn-primary" href="/auth">
              Sign In / Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
