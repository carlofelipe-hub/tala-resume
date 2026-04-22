import { cn } from "@/lib/utils";
import { TalaSun } from "@/components/tala/tala-sun";
import { TalaMeta } from "@/components/tala/tala-meta";

interface CoachTipCardProps {
  tip: string;
  className?: string;
}

export function CoachTipCard({ tip, className }: CoachTipCardProps) {
  return (
    <div
      className={cn(
        "p-4 bg-tala-bg rounded-xl border border-tala-rule mt-auto",
        className
      )}
    >
      <div className="flex items-center gap-2.5 mb-1.5">
        <TalaSun size={14} className="text-tala-accent-ink" />
        <TalaMeta className="text-tala-accent-ink">Coach tip</TalaMeta>
      </div>
      <div className="text-xs leading-relaxed text-tala-ink">{tip}</div>
    </div>
  );
}
