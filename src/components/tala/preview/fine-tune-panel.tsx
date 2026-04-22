"use client";

import { Knob } from "./knob";
import { AtsScoreBox } from "./ats-score-box";
import type { PreviewSettings } from "@/types/preview";
import { typographyPairings, palettes } from "@/lib/tokens";

interface FineTunePanelProps {
  settings: PreviewSettings;
  onChange: (settings: PreviewSettings) => void;
}

const DENSITY_OPTIONS = ["compact", "regular", "spacious"];
const PAPER_OPTIONS = ["letter", "a4"];
const LANGUAGE_OPTIONS = ["english", "filipino", "bilingual"];

export function FineTunePanel({ settings, onChange }: FineTunePanelProps) {
  const typographyOptions = Object.keys(typographyPairings);
  const accentOptions = Object.keys(palettes);

  const update = (key: keyof PreviewSettings, value: string) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="p-6">
      <div className="text-xs font-mono uppercase tracking-wider text-tala-muted mb-4">
        Fine-tune
      </div>

      <Knob
        label="Typography"
        value={settings.typography}
        options={typographyOptions}
        onChange={(v) => update("typography", v)}
      />
      <Knob
        label="Density"
        value={settings.density}
        options={DENSITY_OPTIONS}
        onChange={(v) => update("density", v)}
      />
      <Knob
        label="Accent"
        value={settings.accent}
        options={accentOptions}
        onChange={(v) => update("accent", v)}
      />
      <Knob
        label="Paper"
        value={settings.paper}
        options={PAPER_OPTIONS}
        onChange={(v) => update("paper", v)}
      />
      <Knob
        label="Language"
        value={settings.language}
        options={LANGUAGE_OPTIONS}
        onChange={(v) => update("language", v)}
      />

      <AtsScoreBox accent={settings.accent} />
    </div>
  );
}
