-- Add job_id to interview_messages so each job experience can have its own chat thread
alter table public.interview_messages add column job_id text;

-- Index for fast per-job message lookups
create index idx_interview_messages_job on public.interview_messages(session_id, job_id, created_at);
