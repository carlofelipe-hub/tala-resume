-- Create private storage bucket for resume PDFs
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false);

-- Users can upload to their own folder: {user_id}/{file}
create policy "Users upload own resumes"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own files
create policy "Users read own resumes"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
