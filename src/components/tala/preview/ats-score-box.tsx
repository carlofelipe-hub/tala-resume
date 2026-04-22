"use client";

import { TalaMeta } from "@/components/tala/tala-meta";
import { palettes } from "@/lib/tokens";
import type { PaletteName } from "@/lib/tokens";

interface AtsScoreBoxProps {
  accent: PaletteName;
}

export function AtsScoreBox({ accent }: AtsScoreBoxProps) {
  const palette = palettes[accent] ?? palettes["sun-gold"];

  return (
    <div
      className="mt-6 p-4 rounded-xl"
      style={{
        backgroundColor: palette.accentWash,
      }}
    >
      <TalaMeta style={{ color: palette.accentInk, marginBottom: 6 }}>
        ATS Score
      </TalaMeta>
      <p className="text-sm" style={{ color: palette.accentInk, lineHeight: 1.5 }}>
        Coming in next update
      </p>
    </div>
  );
}
