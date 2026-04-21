-- Allow users to delete their own resumes
create policy "Users can delete own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

-- Allow users to delete their own files from storage
create policy "Users delete own resumes"
  on storage.objects for delete
  using (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
