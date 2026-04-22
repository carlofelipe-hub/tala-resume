"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TalaMeta } from "@/components/tala/tala-meta";
import { TalaRule } from "@/components/tala/tala-rule";
import { JobCard } from "./job-card";
import { CheckDot } from "./check-dot";
import type { InterviewJob } from "@/types/interview";

interface SectionItem {
  label: string;
  state: "complete" | "in-progress" | "pending";
}

interface InterviewSidebarProps {
  jobs: InterviewJob[];
  activeJobId: string;
  sections: SectionItem[];
  onJobSelect: (id: string) => void;
  onJobEdit: (id: string, updates: { role: string; company: string; dates: string }) => void;
  onJobDelete: (id: string) => void;
  onJobAdd: () => void;
  showSections?: boolean;
  className?: string;
}

export function InterviewSidebar({
  jobs,
  activeJobId,
  sections,
  onJobSelect,
  onJobEdit,
  onJobDelete,
  onJobAdd,
  showSections = true,
  className,
}: InterviewSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  function handleAdd() {
    onJobAdd();
    setAddingNew(true);
  }

  function handleEditSave(id: string, updates: { role: string; company: string; dates: string }) {
    onJobEdit(id, updates);
    setEditingId(null);
    setAddingNew(false);
  }

  function handleEditCancel(jobId: string) {
    if (addingNew) {
      onJobDelete(jobId);
      setAddingNew(false);
    }
    setEditingId(null);
  }

  const lastJob = jobs[jobs.length - 1];
  const newJobEditing = addingNew && lastJob;

  return (
    <div className={cn("lg:border-r border-tala-rule p-5 bg-tala-surface overflow-auto", className)}>
      <div className="flex items-center justify-between mb-3.5">
        <TalaMeta>Experience · {jobs.length}</TalaMeta>
        <button
          onClick={handleAdd}
          className="bg-transparent border-none text-tala-muted text-xs cursor-pointer flex items-center gap-1 hover:text-tala-ink transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M6 2v8M2 6h8" />
          </svg>
          Add
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {jobs.length === 0 ? (
          <div className="text-xs text-tala-faint italic py-4 text-center">
            Jobs will appear here as you share your experience with Tala.
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              active={job.id === activeJobId}
              editing={editingId === job.id || (newJobEditing && job.id === lastJob.id)}
              onClick={() => onJobSelect(job.id)}
              onEdit={(id, updates) => handleEditSave(id, updates)}
              onDelete={onJobDelete}
              onEditStart={(id) => setEditingId(id)}
              onEditCancel={() => handleEditCancel(job.id)}
            />
          ))
        )}
      </div>

      {showSections && (
        <div className="mt-7 pt-5">
          <TalaRule />
          <TalaMeta className="mb-3 mt-5 block">Other sections</TalaMeta>
          <div className="flex flex-col gap-1">
            {sections.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2.5 py-2 px-1 text-[13px]"
              >
                <CheckDot
                  state={
                    s.state === "complete"
                      ? "done"
                      : s.state === "in-progress"
                        ? "active"
                        : "pending"
                  }
                />
                <span
                  className={
                    s.state === "pending" ? "text-tala-muted" : "text-tala-ink"
                  }
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
