"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import AppSidebar from "@/components/AppSidebar";

// Routes that get the dashboard treatment (left nav rail + narrower
// content column) instead of the plain full-width marketing layout. All of
// these already redirect signed-out visitors to /login server-side, so by
// the time the sidebar is visible the visitor is authenticated.
const APP_ROUTES = ["/account", "/assessment", "/blog/new"];

function isAppRoute(pathname: string) {
  return APP_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (!isAppRoute(pathname)) {
    return <main className="flex flex-1 flex-col">{children}</main>;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-start gap-6 px-4 py-8 sm:px-6">
      <AppSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
