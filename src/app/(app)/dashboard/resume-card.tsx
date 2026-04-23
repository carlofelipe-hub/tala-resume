"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TalaChip } from "@/components/tala/tala-chip";
import { TalaMeta } from "@/components/tala/tala-meta";
import { deleteResume } from "../upload/actions";
import type { ResumeRecord } from "@/types/resume";

const statusConfig: Record<
  ResumeRecord["status"],
  { label: string; variant: "accent" | "default" | "ghost" | "filled" }
> = {
  uploaded: { label: "Uploaded", variant: "ghost" },
  extracting: { label: "Extracting", variant: "default" },
  analyzing: { label: "Analyzing", variant: "default" },
  complete: { label: "Analyzed", variant: "accent" },
  error: { label: "Error", variant: "ghost" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResumeCard({ resume }: { resume: ResumeRecord }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const { label, variant } = statusConfig[resume.status];

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("I-delete ba itong résumé? / Delete this résumé?")) return;
    setDeleting(true);
    const result = await deleteResume(resume.id);
    if (result.error) {
      alert(result.error);
      setDeleting(false);
      return;
    }
    router.refresh();
  }

  return (
    <a
      href={`/upload?id=${resume.id}`}
      className={`rounded-[14px] border border-tala-rule bg-tala-surface p-6 flex flex-col gap-3 min-h-[220px] hover:border-tala-muted transition-all group ${deleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-[10px] bg-tala-accent-wash flex items-center justify-center shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-tala-accent-ink"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <TalaChip variant={variant}>{label}</TalaChip>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
            title="Delete résumé"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-tala-faint hover:text-red-500 transition-colors"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <p className="text-sm font-medium text-tala-ink truncate group-hover:text-tala-accent-ink transition-colors">
          {resume.file_name}
        </p>
        <TalaMeta>{formatDate(resume.created_at)}</TalaMeta>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-tala-rule/50">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-tala-faint font-mono">
            {formatFileSize(resume.file_size)}
          </span>
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = "/preview";
            }}
            className="text-xs font-medium text-tala-accent hover:underline cursor-pointer"
          >
            Preview résumé
          </span>
        </div>
        {resume.status === "complete" && resume.analysis && (
          <div className="flex items-center gap-2 text-[11px] font-mono">
            {resume.analysis.major_issues.length > 0 && (
              <span className="text-red-500">
                {resume.analysis.major_issues.length} major
              </span>
            )}
            {resume.analysis.minor_issues.length > 0 && (
              <span className="text-amber-500">
                {resume.analysis.minor_issues.length} minor
              </span>
            )}
            {resume.analysis.positives.length > 0 && (
              <span className="text-emerald-500">
                {resume.analysis.positives.length} good
              </span>
            )}
          </div>
        )}
        {resume.status === "error" && (
          <span className="text-[11px] text-red-500 font-mono">Failed</span>
        )}
      </div>
    </a>
  );
}
