"use client";

import { useState, useMemo, useEffect } from "react";
import type { ResumeData } from "@/types/preview";
import { defaultPreviewSettings, type PreviewSettings } from "@/types/preview";
import { getFontClasses } from "@/lib/fonts";
import { TemplatePicker } from "./template-picker";
import { TalaResumeDoc } from "./tala-resume-doc";
import { FineTunePanel } from "./fine-tune-panel";
import { DownloadButton } from "./download-button";

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
      {/* Top bar with download button */}
      <div className="flex items-center justify-end px-6 py-3 border-b border-tala-rule bg-tala-surface">
        <DownloadButton data={data} settings={settings} />
      </div>
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
            <TalaResumeDoc data={data} settings={settings} scale={scale} />
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
