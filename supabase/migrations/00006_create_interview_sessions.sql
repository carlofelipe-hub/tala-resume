create table public.interview_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  resume_id uuid references public.resumes(id) on delete set null,
  phase text not null default 'warmup',
  jobs jsonb not null default '[]'::jsonb,
  messages jsonb not null default '[]'::jsonb,
  bullets jsonb not null default '{}'::jsonb,
  completeness integer not null default 0,
  active_job_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_interview_sessions_user on public.interview_sessions(user_id);

alter table public.interview_sessions enable row level security;

create policy "Users can view own sessions"
  on public.interview_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.interview_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.interview_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on public.interview_sessions for delete
  using (auth.uid() = user_id);
