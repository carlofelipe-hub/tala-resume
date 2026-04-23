"use client";

import { TalaMeta } from "@/components/tala/tala-meta";
import { DownloadButton } from "./download-button";
import type { ResumeData, PreviewSettings } from "@/types/preview";

interface MobilePreviewHeaderProps {
  data: ResumeData;
  settings: PreviewSettings;
}

export function MobilePreviewHeader({ data, settings }: MobilePreviewHeaderProps) {
  const templateLabel = settings.template.charAt(0).toUpperCase() + settings.template.slice(1);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-tala-rule bg-tala-surface lg:hidden">
      <TalaMeta>Preview · {templateLabel}</TalaMeta>
      <DownloadButton data={data} settings={settings} />
    </div>
  );
}
