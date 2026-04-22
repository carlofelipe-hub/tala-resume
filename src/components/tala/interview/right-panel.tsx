"use client";

import { TalaMeta } from "@/components/tala/tala-meta";
import { LiveBulletCard, Highlight } from "./live-bullet-card";
import { ActiveJobCard } from "./active-job-card";
import { MiningChecklist } from "./mining-checklist";
import { CoachTipCard } from "./coach-tip-card";
import type { InterviewJob, BulletDraft } from "@/types/interview";

interface RightPanelProps {
  activeJob: InterviewJob | null;
  bullets: BulletDraft[];
  coachTip: string;
  liveBullet: { text: string; elapsed: number } | null;
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function RightPanel({
  activeJob,
  bullets,
  coachTip,
  liveBullet,
}: RightPanelProps) {
  if (!activeJob) {
    return (
      <div className="border-l border-tala-rule bg-tala-surface p-6 overflow-auto flex flex-col items-center justify-center text-center">
        <div className="text-sm text-tala-muted">
          Start chatting with Tala to see your achievements build here.
        </div>
      </div>
    );
  }

  return (
    <div className="border-l border-tala-rule bg-tala-surface p-6 overflow-auto flex flex-col gap-5">
      <div>
        <TalaMeta className="mb-2.5 block">Building bullet · Live</TalaMeta>
        {liveBullet ? (
          <LiveBulletCard
            text={liveBullet.text}
            elapsed={formatElapsed(liveBullet.elapsed)}
          />
        ) : (
          <div className="p-[18px] bg-tala-bg rounded-xl border border-dashed border-tala-rule text-xs text-tala-faint italic">
            Tala will draft bullets here as you share your achievements...
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <TalaMeta>Job card · Lv {activeJob.level}</TalaMeta>
          {bullets.some((b) => b.fresh) && (
            <TalaMeta className="text-tala-accent-ink">
              +{bullets.filter((b) => b.fresh).length} bullet unlocked
            </TalaMeta>
          )}
        </div>
        <ActiveJobCard job={activeJob} bullets={bullets} />
      </div>

      <div>
        <TalaMeta className="mb-2.5 block">Mining checklist</TalaMeta>
        <MiningChecklist mined={activeJob.mined} />
      </div>

      <CoachTipCard tip={coachTip} />
    </div>
  );
}
