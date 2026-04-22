"use client";

import { cn } from "@/lib/utils";
import { TalaLogo } from "@/components/tala/tala-logo";
import { TalaMeta } from "@/components/tala/tala-meta";
import { TalaChip } from "@/components/tala/tala-chip";
import { TalaProgress } from "@/components/tala/tala-progress";
import { TalaButton } from "@/components/tala/tala-button";

interface InterviewTopBarProps {
  completeness: number;
  className?: string;
}

export function InterviewTopBar({ completeness, className }: InterviewTopBarProps) {
  return (
    <div className={cn("flex items-center justify-between px-4 lg:px-7 py-4 border-b border-tala-rule bg-tala-surface", className)}>
      <div className="flex items-center gap-3 lg:gap-4">
        <TalaLogo size="sm" />
        <span className="hidden sm:inline w-px h-3.5 bg-tala-rule" />
        <TalaMeta className="hidden sm:inline">Interview</TalaMeta>
        <TalaChip variant="accent">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tala-accent" />
            <span className="hidden sm:inline">Autosaved</span>
            <span className="sm:hidden">Auto</span>
          </span>
        </TalaChip>
        <span className="lg:hidden font-mono text-[11px] text-tala-ink">
          {completeness}%
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <TalaMeta>Completeness</TalaMeta>
          <div className="w-[140px]">
            <TalaProgress value={completeness} />
          </div>
          <span className="font-mono text-[11px] text-tala-ink">
            {completeness}%
          </span>
        </div>
        <span className="w-px h-[18px] bg-tala-rule" />
        <TalaButton variant="ghost" size="sm">
          Preview résumé
        </TalaButton>
        <TalaButton variant="primary" size="sm">
          Export
        </TalaButton>
      </div>
    </div>
  );
}
