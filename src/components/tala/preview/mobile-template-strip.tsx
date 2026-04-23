"use client";

import { cn } from "@/lib/utils";
import type { TemplateName } from "@/types/preview";

const TEMPLATES: { id: TemplateName; name: string }[] = [
  { id: "editorial", name: "Editorial" },
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
];

interface MobileTemplateStripProps {
  value: TemplateName;
  onChange: (template: TemplateName) => void;
}

export function MobileTemplateStrip({ value, onChange }: MobileTemplateStripProps) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto border-t border-tala-rule bg-tala-surface lg:hidden">
      {TEMPLATES.map((t) => {
        const isActive = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors",
              isActive
                ? "border-tala-ink bg-tala-bg"
                : "border-tala-rule bg-transparent"
            )}
          >
            <div className="w-[68px] h-[90px] bg-white border border-tala-rule rounded-sm overflow-hidden relative">
              {/* Simple wireframe */}
              <div className="absolute inset-2">
                <div className="h-2 w-3/4 bg-gray-200 rounded mb-1" />
                <div className="h-1.5 w-1/2 bg-gray-100 rounded mb-2" />
                <div className="h-1 w-8 bg-gray-200 rounded mb-0.5" />
                <div className="h-1 w-full bg-gray-100 rounded mb-0.5" />
                <div className="h-1 w-4/5 bg-gray-100 rounded" />
              </div>
            </div>
            <span className="text-[10px] font-medium text-tala-ink">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}
