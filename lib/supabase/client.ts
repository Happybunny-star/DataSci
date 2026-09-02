import { createBrowserClient } from "@supabase/ssr";

// Used from Client Components. Safe to call anywhere in the browser —
// only the public URL + anon key are used, both meant to be public.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
