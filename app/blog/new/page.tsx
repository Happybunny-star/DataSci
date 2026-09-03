import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "@/app/blog/actions";
import Magnetic from "@/components/Magnetic";

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/blog/new");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Write a post</h1>
      <p className="mt-2 text-zinc-500">
        This publishes immediately and shows up on the public blog.
      </p>

      <form action={createPost} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 outline-none focus:border-indigo-500 dark:border-white/15"
          />
        </div>
        <div>
          <label htmlFor="body" className="text-sm font-medium">
            Your post
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={10}
            className="mt-1 w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 outline-none focus:border-indigo-500 dark:border-white/15"
          />
        </div>
        <Magnetic>
          <button
            type="submit"
            className="mt-2 self-start rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Publish
          </button>
        </Magnetic>
      </form>
    </div>
  );
}
