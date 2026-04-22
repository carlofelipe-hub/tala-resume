"use client";

import { useState, useMemo } from "react";
import type { ResumeData } from "@/types/preview";
import { defaultPreviewSettings, type PreviewSettings } from "@/types/preview";
import { getFontClasses } from "@/lib/fonts";
import { TemplatePicker } from "./template-picker";
import { TalaResumeDoc } from "./tala-resume-doc";
import { FineTunePanel } from "./fine-tune-panel";

interface PreviewClientProps {
  data: ResumeData;
}

export function PreviewClient({ data }: PreviewClientProps) {
  const [settings, setSettings] = useState<PreviewSettings>(defaultPreviewSettings);

  const fontClasses = useMemo(() => getFontClasses(settings.typography), [settings.typography]);

  const pageWidth = settings.paper === "a4" ? 595 : 612;
  // Mobile scale: fit within viewport minus 32px padding
  const mobileScale = typeof window !== "undefined" ? Math.min(1, (window.innerWidth - 32) / pageWidth) : 1;

  return (
    <div className={fontClasses}>
      {/* Desktop: 3-column grid. Mobile: single column stack */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] min-h-[calc(100vh-64px)]">
        {/* Left: Template picker */}
        <div className="border-r border-tala-rule bg-tala-surface overflow-auto order-2 lg:order-1">
          <TemplatePicker value={settings.template} onChange={(t) => setSettings({ ...settings, template: t })} />
        </div>

        {/* Center: Resume document */}
        <div className="overflow-auto p-6 lg:p-10 flex justify-center bg-tala-bg order-1 lg:order-2">
          <div className="hidden lg:block shadow-[0_20px_60px_-12px_rgba(30,20,10,0.15),0_4px_12px_rgba(30,20,10,0.06)]">
            <TalaResumeDoc data={data} settings={settings} scale={1} />
          </div>
          <div className="lg:hidden">
            <TalaResumeDoc data={data} settings={settings} scale={mobileScale} />
          </div>
        </div>

        {/* Right: Fine-tune panel */}
        <div className="border-l border-tala-rule bg-tala-surface overflow-auto order-3">
          <FineTunePanel settings={settings} onChange={setSettings} />
        </div>
      </div>
    </div>
  );
}
