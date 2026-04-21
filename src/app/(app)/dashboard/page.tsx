import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TalaSectionHead } from "@/components/tala/tala-section-head";
import { TalaButton } from "@/components/tala/tala-button";
import { TalaRule } from "@/components/tala/tala-rule";
import { TalaMeta } from "@/components/tala/tala-meta";
import { ResumeCard } from "./resume-card";
import type { ResumeRecord } from "@/types/resume";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete) {
    redirect("/onboarding");
  }

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const displayName =
    profile.full_name || user.user_metadata?.full_name || user.email;

  const resumeList = (resumes ?? []) as ResumeRecord[];

  return (
    <div>
      <TalaSectionHead
        kicker="Dashboard"
        title={
          <>
            Kumusta, <em className="text-tala-accent-ink italic">{displayName}</em>
          </>
        }
        subtitle="Ready to build your next résumé?"
      />

      <div className="mt-10">
        <TalaRule className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* New resume CTA card */}
          <div className="rounded-[14px] border border-dashed border-tala-rule bg-tala-surface/50 p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
            <div className="w-12 h-12 rounded-full bg-tala-accent-wash flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-tala-accent-ink"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-tala-ink mb-1">
                Start a new r&eacute;sum&eacute;
              </p>
              <p className="text-xs text-tala-muted">
                Tala will interview you and build it from scratch.
              </p>
            </div>
            <TalaButton size="sm">Start the interview</TalaButton>
          </div>

          {/* Upload existing resume CTA */}
          <a
            href="/upload?new=true"
            className="rounded-[14px] border border-dashed border-tala-rule bg-tala-surface/50 p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[220px] hover:border-tala-muted transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-tala-accent-wash flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-tala-accent-ink"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-tala-ink mb-1">
                Upload existing r&eacute;sum&eacute;
              </p>
              <p className="text-xs text-tala-muted">
                Let Tala analyze and improve your current resume.
              </p>
            </div>
          </a>

          {/* Resume cards */}
          {resumeList.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}

          {/* Empty state — only show if no resumes */}
          {resumeList.length === 0 && (
            <div className="rounded-[14px] border border-tala-rule bg-tala-surface/30 p-8 flex flex-col items-center justify-center text-center min-h-[220px]">
              <TalaMeta className="mb-2">No r&eacute;sum&eacute; yet</TalaMeta>
              <p className="text-xs text-tala-faint">
                Your saved r&eacute;sum&eacute;s will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
