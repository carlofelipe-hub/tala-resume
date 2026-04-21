import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TalaSectionHead } from "@/components/tala/tala-section-head";
import { UploadForm } from "./upload-form";
import { AnalysisResults } from "./analysis-results";
import type { ResumeRecord } from "@/types/resume";

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; id?: string }>;
}) {
  const params = await searchParams;
  const forceNew = params.new === "true";
  const resumeId = params.id;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let typedResume: ResumeRecord | null = null;

  if (!forceNew) {
    if (resumeId) {
      const { data: resume } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", resumeId)
        .eq("user_id", user.id)
        .single();
      typedResume = resume as ResumeRecord | null;
    } else {
      const { data: resume } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      typedResume = resume as ResumeRecord | null;
    }
  }

  return (
    <div>
      <TalaSectionHead
        kicker="Upload"
        title="I-upload ang resume mo"
        subtitle="Upload your existing résumé and let Tala analyze it for you."
      />

      <div className="mt-10 max-w-2xl">
        {typedResume?.status === "complete" ? (
          <AnalysisResults resume={typedResume} />
        ) : (
          <UploadForm existingResume={forceNew ? null : typedResume} />
        )}
      </div>
    </div>
  );
}
