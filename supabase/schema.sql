-- Run this once in your Supabase project's SQL editor:
-- Dashboard → SQL Editor → New query → paste this whole file → Run.
--
-- It creates every table, security policy, and function this site needs,
-- and seeds 5 SAMPLE assessment questions so you can try the flow end to
-- end. Replace the sample questions with your real ones afterwards, either
-- here in SQL or via Table Editor → assessment_questions.

-- ─────────────────────────────────────────────────────────────────────────
-- profiles: one row per user, auto-created on signup
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-insert a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- assessment_questions: the answer key. RLS is enabled with NO select
-- policy, so neither anon nor authenticated users can read this table
-- directly — only the service-role key (used server-side in
-- app/assessment/actions.ts) can. Public-facing reads go through the
-- get_assessment_questions() function below, which omits correct_index.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.assessment_questions (
  id serial primary key,
  order_index int not null,
  question_text text not null,
  options jsonb not null,        -- e.g. ["20", "30", "40", "50"]
  correct_index int not null     -- 0-based index into options
);

alter table public.assessment_questions enable row level security;
-- Intentionally no policies here — see comment above.

create or replace function public.get_assessment_questions()
returns table (id int, order_index int, question_text text, options jsonb)
language sql
security definer set search_path = public
as $$
  select id, order_index, question_text, options
  from public.assessment_questions
  order by order_index;
$$;

grant execute on function public.get_assessment_questions() to authenticated;

-- 5 SAMPLE questions — replace with your real assessment content.
insert into public.assessment_questions (order_index, question_text, options, correct_index)
values
  (1, 'A team completes 120 tasks in 4 days. What is the average number of tasks per day?',
      '["20", "30", "40", "50"]', 1),
  (2, 'Which sentence is grammatically correct?',
      '["Their going to the store.", "They''re going to the store.", "There going to the store.", "Theyre going to the store."]', 1),
  (3, 'You notice an entry in a dataset that seems inconsistent with the guidelines. What''s the best first step?',
      '["Ignore it and move on", "Delete the entry", "Re-check it against the guidelines before deciding", "Guess and submit"]', 2),
  (4, 'Which of these is the most reliable way to reduce errors in repetitive work?',
      '["Work faster to finish sooner", "Use a consistent checklist or process", "Skip steps that feel obvious", "Rely on memory alone"]', 1),
  (5, 'If instructions and an example conflict with each other, what should you generally do?',
      '["Follow the example, ignore the instructions", "Follow the instructions, and flag the conflicting example", "Pick whichever is faster", "Skip the task"]', 1)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- assessment_submissions: one row per user (remove the `unique` constraint
-- below if you want to allow retakes).
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  answers jsonb not null,   -- { "<question_id>": <chosen_option_index> }
  score int not null,
  total int not null,
  submitted_at timestamptz not null default now()
);

alter table public.assessment_submissions enable row level security;

create policy "Users can view their own submission"
  on public.assessment_submissions for select
  using (auth.uid() = user_id);

-- No insert policy for regular users — rows are written by
-- app/assessment/actions.ts using the service-role client, after it
-- computes the score server-side. This stops anyone from posting a fake
-- score directly to the table.

-- ─────────────────────────────────────────────────────────────────────────
-- blog_posts: authenticated users can publish; everyone can read published
-- posts. author_name is stored directly on the row for simplicity.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  title text not null,
  slug text not null unique,
  body text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Published posts are public"
  on public.blog_posts for select
  using (published = true);

create policy "Authors can view their own drafts"
  on public.blog_posts for select
  using (auth.uid() = author_id);

create policy "Authors can insert their own posts"
  on public.blog_posts for insert
  with check (auth.uid() = author_id);

create policy "Authors can update their own posts"
  on public.blog_posts for update
  using (auth.uid() = author_id);
