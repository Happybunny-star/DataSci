import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, author_name, created_at, body")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-500">
        {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="prose prose-zinc mt-8 whitespace-pre-wrap dark:prose-invert">
        {post.body}
      </div>
    </article>
  );
}
