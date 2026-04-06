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
        <p className="eyebrow">Sign In First</p>
        <h1 className="title-page mt-3">Please sign in before submitting a plant</h1>
        <p className="text-subtle mt-3 max-w-2xl">
          Sign in so your submission can be connected to your account and move smoothly through the review flow.
        </p>
        <Link href="/auth" className="btn btn-primary mt-6">
          Go to Sign In / Register
        </Link>
      </div>
    );
  }

  return <SubmitPlantForm error={error} message={message} />;
}
