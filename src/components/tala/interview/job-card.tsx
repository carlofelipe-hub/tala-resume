"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TalaMeta } from "@/components/tala/tala-meta";
import type { InterviewJob } from "@/types/interview";

interface JobCardProps {
  job: InterviewJob;
  active: boolean;
  editing?: boolean;
  onClick?: () => void;
  onEdit?: (id: string, updates: { role: string; company: string; dates: string }) => void;
  onDelete?: (id: string) => void;
  onEditStart?: (id: string) => void;
  onEditCancel?: () => void;
  className?: string;
}

function LevelDotsMenu({
  level,
  onEdit,
  onDelete,
}: {
  level: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="bg-transparent border-none cursor-pointer p-1 -m-1 rounded flex gap-[2px] hover:opacity-70 transition-opacity"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "w-[5px] h-[5px] rounded-full",
              i < level ? "bg-tala-accent" : "bg-tala-rule"
            )}
          />
        ))}
      </button>
      {open && (
        <div className="absolute right-0 top-6 z-50 bg-white border border-tala-rule rounded-lg shadow-sm py-1 min-w-[100px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-tala-ink hover:bg-tala-bg cursor-pointer bg-transparent border-none transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 cursor-pointer bg-transparent border-none transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function JobCardEditForm({
  job,
  onSave,
  onCancel,
}: {
  job: InterviewJob;
  onSave: (updates: { role: string; company: string; dates: string }) => void;
  onCancel: () => void;
}) {
  const [role, setRole] = useState(job.role);
  const [company, setCompany] = useState(job.company);
  const [dates, setDates] = useState(job.dates);
  const roleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    roleRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role.trim()) return;
    onSave({ role: role.trim(), company: company.trim(), dates: dates.trim() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="w-full text-left p-3 rounded-xl border border-tala-accent bg-tala-bg"
    >
      <TalaMeta className="text-tala-accent-ink mb-2 block">Editing</TalaMeta>
      <div className="flex flex-col gap-2">
        <input
          ref={roleRef}
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role / Position"
          className="w-full text-[13px] font-semibold text-tala-ink bg-white border border-tala-rule rounded-lg px-2.5 py-1.5 outline-none focus:border-tala-accent transition-colors"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company name"
          className="w-full text-xs text-tala-muted bg-white border border-tala-rule rounded-lg px-2.5 py-1.5 outline-none focus:border-tala-accent transition-colors"
        />
        <input
          type="text"
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          placeholder="e.g. Jan 2023 - Present"
          className="w-full text-[10px] text-tala-muted font-mono bg-white border border-tala-rule rounded-lg px-2.5 py-1.5 outline-none focus:border-tala-accent transition-colors"
        />
      </div>
      <div className="flex gap-2 mt-2.5">
        <button
          type="submit"
          className="flex-1 text-[11px] font-medium bg-tala-ink text-white rounded-full py-1.5 cursor-pointer border-none hover:opacity-90 transition-opacity"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 text-[11px] font-medium bg-transparent text-tala-muted border border-tala-rule rounded-full py-1.5 cursor-pointer hover:text-tala-ink transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function JobCard({
  job,
  active,
  editing,
  onClick,
  onEdit,
  onDelete,
  onEditStart,
  onEditCancel,
  className,
}: JobCardProps) {
  if (editing) {
    return (
      <JobCardEditForm
        job={job}
        onSave={(updates) => onEdit?.(job.id, updates)}
        onCancel={() => onEditCancel?.()}
      />
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      className={cn(
        "w-full text-left p-3 rounded-xl border cursor-pointer transition-colors",
        active
          ? "border-tala-ink bg-tala-bg"
          : "border-tala-rule bg-transparent hover:bg-tala-bg/50",
        className
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <TalaMeta className={active ? "text-tala-accent-ink" : ""}>
          {active ? "MINING NOW" : "QUEUED"}
        </TalaMeta>
        {onEdit && onDelete ? (
          <LevelDotsMenu
            level={job.level}
            onEdit={() => onEditStart?.(job.id)}
            onDelete={() => onDelete(job.id)}
          />
        ) : (
          <div className="flex gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-[5px] h-[5px] rounded-full",
                  i < job.level ? "bg-tala-accent" : "bg-tala-rule"
                )}
              />
            ))}
          </div>
        )}
      </div>
      <div className="text-[13px] font-semibold text-tala-ink leading-tight">
        {job.role}
      </div>
      <div className="text-xs text-tala-muted mt-0.5">
        {job.company || <span className="italic text-tala-faint">No company</span>}
      </div>
      <div className="text-[10px] text-tala-muted mt-1.5 font-mono">
        {job.dates || <span className="italic text-tala-faint">No dates</span>}
      </div>
    </div>
  );
}
