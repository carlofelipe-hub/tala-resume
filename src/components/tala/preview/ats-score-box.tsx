"use client";

import { TalaMeta } from "@/components/tala/tala-meta";
import { palettes } from "@/lib/tokens";
import type { PaletteName } from "@/lib/tokens";
import { computeAtsScore } from "@/lib/ats-score";
import type { ResumeData, PreviewSettings } from "@/types/preview";

interface AtsScoreBoxProps {
  data: ResumeData;
  settings: PreviewSettings;
}

export function AtsScoreBox({ data, settings }: AtsScoreBoxProps) {
  const palette = palettes[settings.accent] ?? palettes["sun-gold"];
  const { score, insight } = computeAtsScore(data, settings);

  return (
    <div
      className="mt-6 p-4 rounded-xl"
      style={{ backgroundColor: palette.accentWash }}
    >
      <TalaMeta style={{ color: palette.accentInk, marginBottom: 6 }}>
        ATS Score
      </TalaMeta>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span
          className="text-4xl leading-none"
          style={{ fontFamily: "var(--font-display)", color: palette.accentInk }}
        >
          {score}
        </span>
        <span className="text-sm" style={{ color: palette.accentInk }}>
          / 100
        </span>
      </div>
      <p className="text-sm" style={{ color: palette.accentInk, lineHeight: 1.5 }}>
        {insight}
      </p>
    </div>
  );
}
