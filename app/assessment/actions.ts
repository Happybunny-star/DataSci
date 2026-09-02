"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Server Action — runs only on the server, never shipped to the browser.
// This is the ONLY place the answer key (correct_index) is read, and it's
// read with the service-role client so it never touches client JS.
export async function submitAssessment(answers: Record<number, number>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/assessment");
  }

  const admin = createAdminClient();

  const { data: questions, error: questionsError } = await admin
    .from("assessment_questions")
    .select("id, correct_index");

  if (questionsError || !questions || questions.length === 0) {
    throw new Error(
      "Could not load the assessment questions. Make sure supabase/schema.sql has been run.",
    );
  }

  let score = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correct_index) score += 1;
  }

  const { error: insertError } = await admin.from("assessment_submissions").insert({
    user_id: user.id,
    answers,
    score,
    total: questions.length,
  });

  // 23505 = unique_violation — this user already has a submission on file
  // (assessment_submissions.user_id is UNIQUE, one attempt per person by
  // default). Treat a resubmit as "go see your existing result" instead of
  // an error.
  if (insertError && insertError.code !== "23505") {
    throw new Error(insertError.message);
  }

  redirect("/assessment/result");
}
