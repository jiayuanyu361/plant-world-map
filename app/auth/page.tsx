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
        <p className="eyebrow">Account Access</p>
        <h1 className="title-page mt-3">Sign in or create an account to join the map</h1>
        <p className="text-subtle mt-4 max-w-2xl">
          Authentication is powered by Supabase Auth. Once signed in, you can comment, submit new plants,
          and help grow this shared map with the community.
        </p>
      </section>
      <AuthForms error={error} message={message} />
    </div>
  );
}
