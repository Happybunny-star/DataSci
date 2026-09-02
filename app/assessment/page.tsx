import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AssessmentForm, { type Question } from "@/components/AssessmentForm";

export default async function AssessmentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/assessment");
  }

  // Already submitted? Send them to their result instead of a second attempt.
  const { data: existing } = await supabase
    .from("assessment_submissions")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    redirect("/assessment/result");
  }

  // Calls the get_assessment_questions() SQL function (see supabase/schema.sql),
  // which returns everything except correct_index — the answer key never
  // reaches this request's response.
  const { data: questions, error } = await supabase.rpc("get_assessment_questions");

  if (error || !questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Assessment not set up yet</h1>
        <p className="mt-3 text-zinc-500">
          No questions were found. Run <code>supabase/schema.sql</code> in your
          Supabase project&apos;s SQL editor to create and seed the assessment
          questions.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Qualifying assessment</h1>
      <p className="mt-2 text-zinc-500">
        Answer every question, then submit. You can only take this once, so
        take your time.
      </p>
      <div className="mt-10">
        <AssessmentForm questions={questions as Question[]} />
      </div>
    </div>
  );
}
