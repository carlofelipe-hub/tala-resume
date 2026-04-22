import { createClient } from "@/lib/supabase/server";
import { compileResume } from "@/lib/compile-resume";
import { PreviewClient } from "@/components/tala/preview/preview-client";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionId } = await searchParams;
  const supabase = await createClient();

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null; // layout handles redirect
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, location, linkedin, target_role")
    .eq("id", user.id)
    .single();

  // Get session
  let session = null;
  if (sessionId) {
    const { data: s } = await supabase
      .from("interview_sessions")
      .select("id, jobs, bullets, resume_id")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();
    session = s;
  } else {
    const { data: s } = await supabase
      .from("interview_sessions")
      .select("id, jobs, bullets, resume_id")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    session = s;
  }

  // Get resume analysis
  let analysis = null;
  if (session?.resume_id) {
    const { data: resume } = await supabase
      .from("resumes")
      .select("analysis")
      .eq("id", session.resume_id)
      .eq("user_id", user.id)
      .single();
    if (resume?.analysis) {
      analysis = resume.analysis;
    }
  }

  // Empty state
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <h1 className="text-xl font-semibold text-tala-ink mb-2">
          You haven&apos;t started an interview yet
        </h1>
        <p className="text-sm text-tala-muted mb-6">
          Complete an interview to generate your résumé preview.
        </p>
        <a
          href="/interview"
          className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-4 py-2 text-sm font-medium text-tala-surface hover:opacity-90 transition-opacity"
        >
          Start an interview
        </a>
      </div>
    );
  }

  const resumeData = compileResume(
    profile ?? {
      full_name: null,
      email: null,
      phone: null,
      location: null,
      linkedin: null,
      target_role: null,
    },
    session,
    analysis
  );

  return <PreviewClient data={resumeData} />;
}
