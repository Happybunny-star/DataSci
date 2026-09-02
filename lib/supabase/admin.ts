import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY. Uses the service-role key, which bypasses Row Level Security.
// Never import this file from a Client Component and never expose
// SUPABASE_SERVICE_ROLE_KEY as a NEXT_PUBLIC_ variable.
//
// Why this exists: assessment_questions.correct_index must never reach the
// browser (that would let anyone read the answer key from dev tools). Only
// this admin client — called from Server Actions — is allowed to read it,
// so it can grade a submission and store the score.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
