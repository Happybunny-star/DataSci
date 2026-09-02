import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const { data: submission } = await supabase
    .from("assessment_submissions")
    .select("score, total, submitted_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const fullName = (user.user_metadata?.full_name as string | undefined) || user.email;

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Welcome back, {fullName}</h1>
      <p className="mt-1 text-zinc-500">{user.email}</p>

      <div className="mt-10 rounded-xl border border-black/10 p-6 dark:border-white/15">
        <h2 className="text-lg font-semibold">Assessment status</h2>
        {submission ? (
          <>
            <p className="mt-2 text-zinc-500">
              You scored {submission.score} / {submission.total}, submitted{" "}
              {new Date(submission.submitted_at).toLocaleDateString()}.
            </p>
            <Link href="/assessment/result" className="mt-4 inline-block text-sm text-indigo-500">
              View result →
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-zinc-500">
              You haven&apos;t taken the qualifying assessment yet.
            </p>
            <Link
              href="/assessment"
              className="mt-4 inline-block rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Start assessment
            </Link>
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-black/10 p-6 dark:border-white/15">
        <h2 className="text-lg font-semibold">Share your story</h2>
        <p className="mt-2 text-zinc-500">
          Write a post for the blog — it&apos;s shown to everyone who visits the site.
        </p>
        <Link
          href="/blog/new"
          className="mt-4 inline-block rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.06]"
        >
          Write a post
        </Link>
      </div>
    </div>
  );
}
