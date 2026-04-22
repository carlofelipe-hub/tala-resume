import type { ResumeData, PreviewSettings } from "@/types/preview";

const ACTION_VERBS = [
  "led", "managed", "built", "delivered", "designed", "developed",
  "improved", "reduced", "increased", "created", "launched", "scaled",
  "spearheaded", "optimized", "implemented", "engineered", "architected",
  "streamlined", "automated", "negotiated", "mentored", "revamped",
];

function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

function hasActionVerb(text: string): boolean {
  const lower = text.toLowerCase();
  return ACTION_VERBS.some((verb) => lower.includes(verb));
}

function countUniqueWords(bullets: string[]): number {
  const words = bullets
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  return new Set(words).size;
}

export function computeAtsScore(
  data: ResumeData,
  settings: PreviewSettings
): { score: number; insight: string } {
  let score = 0;

  // Contact completeness (10 pts)
  if (data.name.length > 0) score += 2.5;
  if (data.email.length > 0) score += 2.5;
  if (data.phone.length > 0) score += 2.5;
  if (data.location.length > 0) score += 2.5;

  // Summary (10 pts)
  if (data.summary.length > 20) score += 10;
  else if (data.summary.length > 0) score += 5;

  // Experience quality (30 pts)
  let expScore = 0;
  let hasMetrics = false;
  let hasActionVerbs = false;

  for (const job of data.experience) {
    if (job.bullets.length >= 3) expScore += 5;
    else if (job.bullets.length > 0) expScore += 3;

    for (const bullet of job.bullets) {
      if (hasNumber(bullet)) hasMetrics = true;
      if (hasActionVerb(bullet)) hasActionVerbs = true;
    }
  }
  expScore = Math.min(20, expScore);
  if (hasMetrics) expScore += 5;
  if (hasActionVerbs) expScore += 5;
  score += Math.min(30, expScore);

  // Education (10 pts)
  if (data.education.length > 0) score += 10;

  // Skills (10 pts)
  if (data.skills.length >= 5) score += 10;
  else if (data.skills.length > 0) score += 5;

  // Template friendliness (15 pts)
  const templateScores: Record<string, number> = {
    classic: 15,
    editorial: 12,
    minimal: 10,
    modern: 8,
  };
  score += templateScores[settings.template] ?? 12;

  // Keyword variety (15 pts)
  const allBullets = data.experience.flatMap((j) => j.bullets);
  const uniqueWords = countUniqueWords(allBullets);
  const keywordScore = Math.min(15, Math.round((uniqueWords / 30) * 15));
  score += keywordScore;

  score = Math.min(100, Math.round(score));

  let insight = "";
  if (score >= 90) insight = "Excellent ATS parse. Your résumé is well-optimized.";
  else if (score >= 75) insight = "Good parse. Add more metrics or keywords for a higher score.";
  else if (score >= 60) insight = "Fair parse. Consider adding a summary, more bullets, or switching to the Classic template.";
  else if (score >= 40) insight = "Weak parse. Fill in contact info, add experience bullets, and include skills.";
  else insight = "Poor parse. Your résumé needs more content before ATS submission.";

  return { score, insight };
}
