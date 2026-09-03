import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function BlogIndexPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, author_name, created_at, body")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <p className="mt-2 text-zinc-500">In our users&apos; own words.</p>

      {!posts || posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-surface-border bg-surface p-10 text-center text-zinc-500">
          No posts yet — be the first to write one.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-hover group flex flex-col rounded-2xl border border-surface-border bg-surface p-6"
            >
              <h2 className="text-base font-semibold group-hover:text-indigo-500">{post.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-zinc-500">{post.body}</p>
              <p className="mt-4 text-xs text-zinc-500">
                {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
