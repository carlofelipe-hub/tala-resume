"use client";

import { useState, useMemo, useEffect } from "react";
import type { ResumeData } from "@/types/preview";
import { defaultPreviewSettings, type PreviewSettings } from "@/types/preview";
import { getFontClasses } from "@/lib/fonts";
import { TemplatePicker } from "./template-picker";
import { TalaResumeDoc } from "./tala-resume-doc";
import { FineTunePanel } from "./fine-tune-panel";
import { MobilePreviewHeader } from "./mobile-preview-header";
import { MobileTemplateStrip } from "./mobile-template-strip";
import { KnobsAccordion } from "./knobs-accordion";

interface PreviewClientProps {
  data: ResumeData;
}

export function PreviewClient({ data }: PreviewClientProps) {
  const [settings, setSettings] = useState<PreviewSettings>(defaultPreviewSettings);

  const fontClasses = useMemo(() => getFontClasses(settings.typography), [settings.typography]);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const pageWidth = settings.paper === "a4" ? 595 : 612;
      const newScale = Math.min(1, (window.innerWidth - 32) / pageWidth);
      setScale(newScale);
    };
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [settings.paper]);

  return (
    <div className={fontClasses}>
      {/* Mobile header */}
      <MobilePreviewHeader data={data} settings={settings} />

      {/* Desktop: 3-column grid */}
      <div className="hidden lg:grid lg:grid-cols-[280px_1fr_320px] min-h-[calc(100vh-64px)]">
        {/* Left: Template picker */}
        <div className="border-r border-tala-rule bg-tala-surface overflow-auto">
          <TemplatePicker value={settings.template} onChange={(t) => setSettings({ ...settings, template: t })} />
        </div>

        {/* Center: Resume document */}
        <div className="overflow-auto p-10 flex justify-center bg-tala-bg">
          <div className="shadow-[0_20px_60px_-12px_rgba(30,20,10,0.15),0_4px_12px_rgba(30,20,10,0.06)]">
            <TalaResumeDoc data={data} settings={settings} scale={1} />
          </div>
        </div>

        {/* Right: Fine-tune panel */}
        <div className="border-l border-tala-rule bg-tala-surface overflow-auto">
          <FineTunePanel data={data} settings={settings} onChange={setSettings} />
        </div>
      </div>

      {/* Mobile: single column */}
      <div className="lg:hidden">
        {/* Resume */}
        <div className="overflow-auto p-4 flex justify-center bg-tala-bg min-h-[50vh]">
          <TalaResumeDoc data={data} settings={settings} scale={scale} />
        </div>

        {/* Template strip */}
        <MobileTemplateStrip value={settings.template} onChange={(t) => setSettings({ ...settings, template: t })} />

        {/* Knobs accordion */}
        <KnobsAccordion data={data} settings={settings} onChange={setSettings} />
      </div>
    </div>
  );
}
