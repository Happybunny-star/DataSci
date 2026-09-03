"use client";

import Magnetic from "@/components/Magnetic";

/**
 * Manual light/dark switch. Both icons are always in the DOM — which one
 * shows is decided purely by CSS (the `dark:` variant keyed off the `.dark`
 * class layout.tsx's no-flash script puts on <html>), so there's no client
 * state to sync and nothing that can mismatch during hydration. The click
 * handler just flips that class directly and remembers the choice.
 */
export default function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private browsing, disabled cookies) — the
      // toggle still works for the rest of this visit, it just won't stick.
    }
  }

  return (
    <Magnetic strength={0.4} radius={30}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Toggle color theme"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-zinc-600 transition-colors hover:bg-black/[.03] dark:border-white/15 dark:text-zinc-300 dark:hover:bg-white/[.06]"
      >
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </button>
    </Magnetic>
  );
}

function SunIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

