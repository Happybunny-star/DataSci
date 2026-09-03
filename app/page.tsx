import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import { siteConfig } from "@/lib/site-config";

const STEPS = [
  {
    title: "Register",
    body: "Create a free account with your name and email. It takes under a minute.",
  },
  {
    title: "Take the assessment",
    body: "Complete a short qualifying test so we can see where you're a strong fit.",
  },
  {
    title: "Get to work",
    body: "Pass, and you're in — with a dashboard, a blog, and a community waiting.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">
            {siteConfig.name}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-500">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Magnetic>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Create your account
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/blog"
                className="rounded-full border border-black/10 px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.06]"
              >
                Read the blog
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-black/5 bg-black/[.02] py-24 dark:border-white/10 dark:bg-white/[.02]">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Ready to get started?</h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-500">
          Registration is free, and the assessment only takes a few minutes.
        </p>
        <Magnetic>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Get started
          </Link>
        </Magnetic>
      </section>
    </div>
  );
}
