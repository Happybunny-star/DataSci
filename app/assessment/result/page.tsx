import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AssessmentResultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: submission } = await supabase
    .from("assessment_submissions")
    .select("score, total, submitted_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!submission) {
    redirect("/assessment");
  }

  const pct = Math.round((submission.score / submission.total) * 100);
  const passed = pct >= 70; // adjust your passing bar here

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
        {passed ? "You passed" : "Thanks for completing it"}
      </p>
      <h1 className="mt-3 text-4xl font-semibold">
        {submission.score} / {submission.total}
      </h1>
      <p className="mt-2 text-zinc-500">That&apos;s {pct}% correct.</p>
      <div className="mt-10 flex flex-col gap-3">
        <Link
          href="/account"
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Go to my account
        </Link>
        <Link
          href="/blog/new"
          className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.06]"
        >
          Write a blog post
        </Link>
      </div>
    </div>
  );
}
