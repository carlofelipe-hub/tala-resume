"use client";

import { useState } from "react";
import { FineTunePanel } from "./fine-tune-panel";
import type { ResumeData, PreviewSettings } from "@/types/preview";

interface KnobsAccordionProps {
  data: ResumeData;
  settings: PreviewSettings;
  onChange: (settings: PreviewSettings) => void;
}

export function KnobsAccordion({ data, settings, onChange }: KnobsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-tala-rule bg-tala-surface lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-mono uppercase tracking-wider text-tala-muted hover:text-tala-ink transition-colors"
      >
        <span>Fine-tune</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <FineTunePanel data={data} settings={settings} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
