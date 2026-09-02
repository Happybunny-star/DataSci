# Company site starter

Next.js 16 + Tailwind CSS + Supabase. Includes:

- **Landing page** at `/` — what the company is for, with a CTA to register.
- **Register / log in** (`/register`, `/login`) — Supabase Auth (email + password).
- **Qualifying assessment** at `/assessment` — signed-in users answer a set of
  questions; the answer key is never sent to the browser (see
  `app/assessment/actions.ts`); results land in Postgres.
- **Account dashboard** at `/account` — shows assessment status, links to write
  a blog post.
- **Blog** at `/blog` — signed-in users can publish posts (`/blog/new`);
  everyone can read them.

Rebrand the whole site by editing `lib/site-config.ts` — the name, tagline,
and description all flow from that one file.

See `DEPLOYMENT.md` for the full, step-by-step path to a live URL.

## Local development

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev
```

Open http://localhost:3000.

You'll also need to run `supabase/schema.sql` once in your Supabase
project's SQL editor before register/login/assessment/blog will work — see
`DEPLOYMENT.md` step 2.
