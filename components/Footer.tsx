import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 py-10 text-sm text-zinc-500 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link href="/blog" className="hover:text-indigo-500">
            Blog
          </Link>
          <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-indigo-500">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
