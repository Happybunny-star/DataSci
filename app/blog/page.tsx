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
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Blog</h1>
      <p className="mt-2 text-zinc-500">In our users&apos; own words.</p>

      <div className="mt-10 flex flex-col divide-y divide-black/5 dark:divide-white/10">
        {!posts || posts.length === 0 ? (
          <p className="py-10 text-zinc-500">No posts yet — be the first to write one.</p>
        ) : (
          posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group py-6">
              <h2 className="text-lg font-semibold group-hover:text-indigo-500">
                {post.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{post.body}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
