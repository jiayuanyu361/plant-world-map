import { signInAction, signUpAction } from "@/lib/actions";

type AuthFormsProps = {
  error?: string;
  message?: string;
};

export function AuthForms({ error, message }: AuthFormsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="panel rounded-[28px] p-6 md:p-7">
        <p className="eyebrow">Sign In</p>
        <h2 className="title-section mt-3">Continue your plant journey</h2>
        <p className="text-subtle mt-2">
          Use your email and password to comment, submit new discoveries, and stay part of the community.
        </p>
        <form action={signInAction} className="mt-6 space-y-4">
          <input className="field" name="email" type="email" placeholder="Email" required />
          <input className="field" name="password" type="password" placeholder="Password" required />
          <button className="btn btn-primary w-full" type="submit">
            Sign In
          </button>
        </form>
      </section>

      <section className="panel rounded-[28px] p-6 md:p-7">
        <p className="eyebrow">Create Account</p>
        <h2 className="title-section mt-3">Join the plant map community</h2>
        <p className="text-subtle mt-2">
          Create an account to share plants you have discovered and take part in the conversation.
        </p>
        <form action={signUpAction} className="mt-6 space-y-4">
          <input className="field" name="username" type="text" placeholder="Username" required />
          <input className="field" name="email" type="email" placeholder="Email" required />
          <input className="field" name="password" type="password" placeholder="Password" required />
          <button className="btn btn-primary w-full" type="submit">
            Register and Start Exploring
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
