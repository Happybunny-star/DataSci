"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

const NAV_ITEMS = [
  { href: "/account", label: "Dashboard", icon: HomeIcon, isActive: (p: string) => p === "/account" },
  { href: "/assessment", label: "Assessment", icon: ClipboardIcon, isActive: (p: string) => p === "/assessment" || p.startsWith("/assessment/") },
  { href: "/blog", label: "Blog", icon: BookIcon, isActive: (p: string) => p === "/blog" || (p.startsWith("/blog/") && p !== "/blog/new") },
  { href: "/blog/new", label: "Write post", icon: PencilIcon, isActive: (p: string) => p === "/blog/new" },
];

/**
 * Left nav rail shown alongside the dashboard-style pages (see
 * components/Shell.tsx for which routes get it). A slimmed-down take on a
 * standard app sidebar: logo, a few labeled icon links with an active-state
 * highlight, sign out pinned at the bottom.
 */
export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-24 hidden w-56 shrink-0 self-start rounded-2xl border border-surface-border bg-surface p-3 sm:block">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, isActive }) => {
          const active = isActive(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-500/10 text-indigo-500"
                  : "text-zinc-500 hover:bg-black/[.03] hover:text-foreground dark:hover:bg-white/[.06]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 flex items-center gap-3 border-t border-surface-border px-3 pt-4 text-sm">
        <LogOutIcon className="h-4 w-4 shrink-0 text-zinc-500" />
        <SignOutButton />
      </div>
    </aside>
  );
}

function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function ClipboardIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11l2 2 4-4" />
    </svg>
  );
}

function BookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function PencilIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function LogOutIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
