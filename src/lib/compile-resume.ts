import type { ResumeData, ResumeExperienceEntry, ResumeEducationEntry } from "@/types/preview";
import type { InterviewJob, BulletDraft } from "@/types/interview";
import type { ResumeAnalysis, ResumeExperienceItem } from "@/types/resume";

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  target_role: string | null;
}

interface InterviewSession {
  jobs: InterviewJob[];
  bullets: Record<string, BulletDraft[]>;
}

export function compileResume(
  profile: Profile,
  session: InterviewSession | null,
  analysis: ResumeAnalysis | null
): ResumeData {
  const jobs = session?.jobs ?? [];
  const bullets = session?.bullets ?? {};

  const experience: ResumeExperienceEntry[] = jobs.map((job) => {
    const jobBullets = bullets[job.id] ?? [];
    const bulletTexts = jobBullets.map((b) => b.text);

    // Fallback to analysis description if no bullets
    if (bulletTexts.length === 0 && analysis) {
      const analysisExp = analysis.experiences.find(
        (e) => e.role === job.role && e.company === job.company
      );
      if (analysisExp?.description) {
        bulletTexts.push(analysisExp.description);
      }
    }

    return {
      role: job.role,
      company: job.company,
      location: "", // InterviewJob doesn't have location yet
      dates: job.dates,
      bullets: bulletTexts,
    };
  });

  // Fallback: add experiences from analysis that aren't in jobs
  const analysisExps: ResumeExperienceEntry[] =
    analysis?.experiences
      .filter(
        (ae) =>
          !jobs.some((j) => j.role === ae.role && j.company === ae.company)
      )
      .map((ae) => ({
        role: ae.role,
        company: ae.company,
        dates: ae.dates ?? "",
        bullets: ae.description ? [ae.description] : [],
      })) ?? [];

  const allExperience = [...experience, ...analysisExps];

  const education: ResumeEducationEntry[] =
    analysis?.experiences && Array.isArray((analysis as any).education)
      ? (analysis as any).education
      : [];

  const skills: string[] =
    analysis?.experiences && Array.isArray((analysis as any).skills)
      ? (analysis as any).skills
      : [];

  const firstJob = allExperience[0];

  return {
    name: profile.full_name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    linkedin: profile.linkedin ?? undefined,
    title: profile.target_role ?? firstJob?.role ?? "",
    summary: analysis?.summary ?? "",
    experience: allExperience,
    education,
    skills,
  };
}
