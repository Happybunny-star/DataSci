# Deploying your company site

This gets you from this codebase to a live, public URL. Everything here is
free — Vercel (hosting) and Supabase (auth + database) both have generous
free tiers that easily cover a new company site. The one thing that
typically costs money is a custom domain name (roughly $10–15/year from a
registrar) — you can skip that step and launch on a free `*.vercel.app`
address instead, and add your own domain later.

Total time: 30–45 minutes the first time.

---

## 1. Create your Supabase project (auth + database)

1. Go to [supabase.com](https://supabase.com) → sign up (free) → **New project**.
2. Pick a name, a strong database password (save it somewhere), and a region
   close to your users.
3. Once the project finishes provisioning, go to **Project settings → API**.
   You'll need three values from this page in step 4:
   - **Project URL**
   - **anon / public** key
   - **service_role** key (click "Reveal" — keep this one secret, never put
     it in frontend code or commit it to git)

## 2. Set up the database

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this project, copy the whole file, paste
   it into the editor, and click **Run**.
3. This creates every table (`profiles`, `assessment_questions`,
   `assessment_submissions`, `blog_posts`), locks them down with Row Level
   Security, and seeds 5 **sample** assessment questions so you can test the
   flow end to end.
4. Replace the sample questions with your real ones: **Table Editor →
   assessment_questions** — edit rows directly, or delete them and insert
   your own (each row needs `question_text`, an `options` JSON array of
   strings, and `correct_index`, the 0-based index of the right answer).

Optional but recommended: **Authentication → Providers → Email** — decide
whether you want "Confirm email" on (safer, users must click a link before
they can log in) or off (faster signup, fine for an internal/testing phase).
It's on by default.

## 3. Push the code to GitHub

```bash
cd company-site
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

(Create the empty repo on [github.com/new](https://github.com/new) first if
you haven't already. Don't check "Initialize with a README" — this project
already has one.)

## 4. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → sign up (free, you can use your
   GitHub account) → **Add New → Project**.
2. Import the GitHub repo you just pushed.
3. Before clicking Deploy, open **Environment Variables** and add the three
   values from step 1:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | your Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon/public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | your service_role key |
4. Click **Deploy**. In about a minute you'll get a live URL like
   `your-project.vercel.app`.
5. Visit it, register an account, take the sample assessment, and write a
   test blog post to confirm everything is wired up end to end.

From now on, every `git push` to `main` automatically redeploys the site —
there's no separate "deploy" step once this is connected.

## 5. Add your own domain (optional)

1. Buy a domain from any registrar (Namecheap, Cloudflare, Google Domains,
   etc.) if you don't have one — roughly $10–15/year for a `.com`.
2. In Vercel: your project → **Settings → Domains → Add**, type your domain.
3. Vercel shows you one or two DNS records to add (usually an `A` record for
   the bare domain and a `CNAME` for `www`). Add those in your registrar's
   DNS settings.
4. DNS changes can take a few minutes to a few hours to propagate. Vercel's
   dashboard shows a green check once it's verified and HTTPS is issued
   automatically.

## After launch

- **Rebrand**: edit `lib/site-config.ts` (name, tagline, description) —
  everything else pulls from there.
- **Replace the sample assessment questions** if you haven't yet (step 2).
- **Passing bar**: `app/assessment/result/page.tsx` currently marks 70%+ as
  a pass — change the `pct >= 70` line to whatever threshold you want.
- **Retakes**: by default each user can only submit the assessment once
  (`assessment_submissions.user_id` is `UNIQUE` in the schema). Drop that
  constraint in Supabase if you want to allow multiple attempts.
- **Moderation**: blog posts publish immediately on submit. If you'd rather
  review posts before they go live, change `published: true` to `false` in
  `app/blog/actions.ts` and add a simple admin view that flips it to `true`.
