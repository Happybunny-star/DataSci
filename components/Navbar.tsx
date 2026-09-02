import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import { siteConfig } from "@/lib/site-config";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/80 backdrop-blur dark:border-white/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteConfig.name}
          <span className="text-indigo-500">.</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/blog" className="hover:text-indigo-500 transition-colors">
            Blog
          </Link>
          {user ? (
            <>
              <Link href="/account" className="hover:text-indigo-500 transition-colors">
                My account
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-500 transition-colors">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
