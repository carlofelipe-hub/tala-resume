-- Create resumes table for tracking uploaded resumes and analysis
create table public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  file_name text not null,
  file_path text not null,
  file_size integer not null,
  extracted_text text,
  analysis jsonb,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'extracting', 'analyzing', 'complete', 'error')),
  error_message text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.resumes enable row level security;

-- Users can view their own resumes
create policy "Users can view own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

-- Users can insert their own resumes
create policy "Users can insert own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

-- Users can update their own resumes
create policy "Users can update own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);
