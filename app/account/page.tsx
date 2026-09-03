import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";

function Pill({ tone, children }: { tone: "done" | "todo" | "neutral"; children: ReactNode }) {
  const toneClasses =
    tone === "done"
      ? "bg-emerald-500/10 text-emerald-500"
      : tone === "todo"
        ? "bg-indigo-500/10 text-indigo-500"
        : "bg-black/[.04] text-zinc-500 dark:bg-white/[.06]";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses}`}>
      {children}
    </span>
  );
}

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

  const fullName = (user.user_metadata?.full_name as string | undefined) || user.email || "";

  return (
    <div className="w-full max-w-2xl px-2 py-4 sm:px-0 sm:py-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
          {fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {fullName}</h1>
          <p className="mt-0.5 text-sm text-zinc-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card-hover flex flex-col rounded-2xl border border-surface-border bg-surface p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold">Assessment</h2>
            {submission ? <Pill tone="done">Completed</Pill> : <Pill tone="todo">Not started</Pill>}
          </div>
          {submission ? (
            <>
              <p className="mt-2 flex-1 text-sm text-zinc-500">
                Scored {submission.score} / {submission.total} · submitted{" "}
                {new Date(submission.submitted_at).toLocaleDateString()}.
              </p>
              <Link
                href="/assessment/result"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-500 hover:text-indigo-400"
              >
                View result <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <>
              <p className="mt-2 flex-1 text-sm text-zinc-500">
                Take the qualifying assessment to unlock the next step.
              </p>
              <Link
                href="/assessment"
                className="mt-4 inline-flex w-fit items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Start assessment
              </Link>
            </>
          )}
        </div>

        <div className="card-hover flex flex-col rounded-2xl border border-surface-border bg-surface p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold">Blog</h2>
            <Pill tone="neutral">Optional</Pill>
          </div>
          <p className="mt-2 flex-1 text-sm text-zinc-500">
            Write a post for the blog — it&apos;s shown to everyone who visits the site.
          </p>
          <Link
            href="/blog/new"
            className="mt-4 inline-flex w-fit items-center rounded-full border border-surface-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-black/[.03] dark:hover:bg-white/[.06]"
          >
            Write a post
          </Link>
        </div>
      </div>
    </div>
  );
}
