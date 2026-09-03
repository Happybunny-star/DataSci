"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Magnetic from "@/components/Magnetic";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkInbox, setCheckInbox] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push("/assessment");
      router.refresh();
    } else {
      // Supabase project has "Confirm email" turned on — the user must
      // click the link we email them before they get a session.
      setCheckInbox(true);
    }
  }

  if (checkInbox) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="rounded-2xl border border-surface-border bg-surface p-8">
          <h1 className="text-2xl font-semibold">Check your inbox</h1>
          <p className="mt-3 text-zinc-500">
            We sent a confirmation link to <strong>{email}</strong>. Confirm your
            email, then log in to start your assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-24">
      <div className="rounded-2xl border border-surface-border bg-surface p-8">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-zinc-500">
          Register, then complete the qualifying assessment to get started.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-background px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-background px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border bg-background px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Magnetic>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </Magnetic>
        </form>

        <p className="mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
