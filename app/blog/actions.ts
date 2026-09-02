"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/blog/new");
  }

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!title || !body) {
    throw new Error("Title and post are both required.");
  }

  const authorName =
    (user.user_metadata?.full_name as string | undefined) || user.email || "Anonymous";

  const baseSlug = slugify(title) || "post";
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("blog_posts").insert({
    author_id: user.id,
    author_name: authorName,
    title,
    slug,
    body,
    published: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/blog/${slug}`);
}
