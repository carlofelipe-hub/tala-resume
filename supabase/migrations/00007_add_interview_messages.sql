-- Remove messages column from sessions (was storing full chat as JSONB)
alter table public.interview_sessions drop column if exists messages;

-- Append-only message log
create table public.interview_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.interview_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null,
  content text not null,
  created_at timestamptz default now() not null
);

create index idx_interview_messages_session on public.interview_messages(session_id, created_at);

alter table public.interview_messages enable row level security;

create policy "Users can view own messages"
  on public.interview_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.interview_messages for insert
  with check (auth.uid() = user_id);
