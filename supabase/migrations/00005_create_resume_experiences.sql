-- Structured job experiences extracted from uploaded resumes
create table public.resume_experiences (
  id uuid default gen_random_uuid() primary key,
  resume_id uuid references public.resumes(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null,
  company text not null,
  dates text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz default now() not null
);

create index idx_resume_experiences_resume on public.resume_experiences(resume_id);
create index idx_resume_experiences_user on public.resume_experiences(user_id);

alter table public.resume_experiences enable row level security;

create policy "Users can view own experiences"
  on public.resume_experiences for select
  using (auth.uid() = user_id);

create policy "Users can insert own experiences"
  on public.resume_experiences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own experiences"
  on public.resume_experiences for update
  using (auth.uid() = user_id);

create policy "Users can delete own experiences"
  on public.resume_experiences for delete
  using (auth.uid() = user_id);
