"use client";

import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";
import { getTemplate } from "./templates";

interface TalaResumeDocProps {
  data: ResumeData;
  settings: PreviewSettings;
  scale?: number;
}

export function TalaResumeDoc({ data, settings, scale = 1 }: TalaResumeDocProps) {
  const Template = getTemplate(settings.template);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: "fit-content",
      }}
    >
      <Template data={data} settings={settings} />
    </div>
  );
}
