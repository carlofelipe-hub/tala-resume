import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InterviewClient } from "@/components/tala/interview/interview-client";
import type { ResumeAnalysis } from "@/types/resume";

export default async function InterviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, goal, experience_level, target_role, language, onboarding_complete")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete && !profile?.target_role) {
    redirect("/onboarding");
  }

  const { data: latestResume } = await supabase
    .from("resumes")
    .select("id, extracted_text, analysis, status")
    .eq("user_id", user.id)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const analysis = latestResume?.analysis as ResumeAnalysis | null;

  const experiences = (analysis?.experiences ?? []).map((exp, i) => ({
    id: `${latestResume?.id ?? "resume"}-exp-${i}`,
    role: exp.role,
    company: exp.company,
    dates: exp.dates,
    description: exp.description,
    sort_order: i,
  }));

  return (
    <InterviewClient
      userName={profile?.full_name ?? user.user_metadata?.full_name ?? ""}
      targetRole={profile?.target_role ?? ""}
      experienceLevel={profile?.experience_level ?? "entry"}
      goal={profile?.goal ?? "first_job"}
      languagePref={profile?.language ?? "en"}
      resumeText={latestResume?.extracted_text ?? null}
      resumeAnalysis={analysis}
      experiences={experiences}
    />
  );
}
