"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TalaButton } from "@/components/tala/tala-button";
import { TalaChip } from "@/components/tala/tala-chip";
import { TalaMeta } from "@/components/tala/tala-meta";
import { deleteResume } from "./actions";
import type { ResumeRecord, ResumeFinding } from "@/types/resume";
import Link from "next/link";

interface AnalysisResultsProps {
  resume: ResumeRecord;
}

function FindingCard({
  finding,
  accent,
}: {
  finding: ResumeFinding;
  accent: "red" | "amber" | "green";
}) {
  const borderColor = {
    red: "border-l-red-400",
    amber: "border-l-amber-400",
    green: "border-l-green-500",
  }[accent];

  return (
    <div
      className={`rounded-[14px] border border-tala-rule bg-tala-surface p-5 border-l-[3px] ${borderColor}`}
    >
      <p className="text-sm font-medium text-tala-ink">{finding.title}</p>
      <p className="text-sm text-tala-muted mt-1.5">{finding.explanation}</p>
      {finding.suggestion && (
        <p className="text-sm text-tala-accent-ink mt-2 italic">
          {finding.suggestion}
        </p>
      )}
    </div>
  );
}

function FindingSection({
  title,
  findings,
  accent,
  emptyText,
}: {
  title: string;
  findings: ResumeFinding[];
  accent: "red" | "amber" | "green";
  emptyText: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-tala-ink">{title}</h3>
        <TalaChip variant="filled">{findings.length}</TalaChip>
      </div>
      {findings.length > 0 ? (
        <div className="space-y-3">
          {findings.map((f, i) => (
            <FindingCard key={i} finding={f} accent={accent} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-tala-faint">{emptyText}</p>
      )}
    </div>
  );
}

export function AnalysisResults({ resume }: AnalysisResultsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const analysis = resume.analysis;
  if (!analysis) return null;

  async function handleDelete() {
    if (!confirm("I-delete ba itong résumé? / Delete this résumé?")) return;
    setDeleting(true);
    const result = await deleteResume(resume.id);
    if (result.error) {
      alert(result.error);
      setDeleting(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="rounded-[14px] border border-tala-rule bg-tala-surface p-6">
        <TalaMeta className="mb-2">Tala&rsquo;s Assessment</TalaMeta>
        <p className="text-base text-tala-ink leading-relaxed">
          {analysis.summary}
        </p>
        <div className="flex items-center justify-between mt-3">
          <TalaMeta>{resume.file_name}</TalaMeta>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-tala-faint hover:text-red-500 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Findings */}
      <FindingSection
        title="Mga Malaking Issue"
        findings={analysis.major_issues}
        accent="red"
        emptyText="Walang major issues — maganda!"
      />

      <FindingSection
        title="Mga Minor na Bagay"
        findings={analysis.minor_issues}
        accent="amber"
        emptyText="No minor issues found."
      />

      <FindingSection
        title="Mga Maganda"
        findings={analysis.positives}
        accent="green"
        emptyText="No specific strengths identified."
      />

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <Link href="/upload?new=true">
          <TalaButton variant="secondary">Upload iba</TalaButton>
        </Link>
        <Link href="/interview">
          <TalaButton variant="accent">Start the interview</TalaButton>
        </Link>
      </div>
    </div>
  );
}
