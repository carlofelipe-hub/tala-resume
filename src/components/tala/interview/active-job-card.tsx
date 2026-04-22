import { cn } from "@/lib/utils";
import { TalaMeta } from "@/components/tala/tala-meta";
import type { InterviewJob, BulletDraft } from "@/types/interview";

interface ActiveJobCardProps {
  job: InterviewJob;
  bullets: BulletDraft[];
  className?: string;
}

export function ActiveJobCard({
  job,
  bullets,
  className,
}: ActiveJobCardProps) {
  return (
    <div
      className={cn(
        "p-4 bg-tala-bg rounded-xl border border-tala-rule",
        className
      )}
    >
      <div className="text-[13px] font-semibold text-tala-ink mb-0.5">
        {job.role}
      </div>
      <div className="text-[11px] text-tala-muted mb-3">
        {job.company || "(no company stated)"} · {job.dates || "No dates"}
      </div>

      {bullets.length === 0 ? (
        <div className="text-xs text-tala-faint italic py-2">
          Bullets will appear here as Tala mines your achievements...
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {bullets.map((b, i) => (
            <div
              key={b.id}
              className={cn(
                "flex gap-2 text-xs leading-[1.45] text-tala-ink p-2.5 rounded-lg",
                b.fresh
                  ? "bg-tala-accent-wash border border-tala-accent"
                  : "border border-dashed border-tala-rule"
              )}
            >
              <span className="text-tala-accent-ink font-mono text-[10px] pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{b.text}</span>
              {b.fresh && (
                <TalaMeta className="text-tala-accent-ink shrink-0">
                  NEW
                </TalaMeta>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
