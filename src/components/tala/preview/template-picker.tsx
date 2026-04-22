"use client";

import { cn } from "@/lib/utils";
import type { TemplateName } from "@/types/preview";

const TEMPLATES: { id: TemplateName; name: string; sub: string }[] = [
  { id: "editorial", name: "Editorial", sub: "Serif header, monospace meta" },
  { id: "classic", name: "Classic", sub: "Traditional ATS-friendly" },
  { id: "modern", name: "Modern", sub: "Two-column with sidebar" },
  { id: "minimal", name: "Minimal", sub: "Sans, single column, airy" },
];

interface TemplatePickerProps {
  value: TemplateName;
  onChange: (template: TemplateName) => void;
}

export function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  return (
    <div className="p-5">
      <div className="text-xs font-mono uppercase tracking-wider text-tala-muted mb-4">
        Templates · 4
      </div>
      <div className="flex flex-col gap-3">
        {TEMPLATES.map((t) => {
          const isActive = value === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "text-left rounded-xl border p-3 transition-colors",
                isActive
                  ? "border-tala-ink bg-tala-bg"
                  : "border-tala-rule bg-transparent"
              )}
            >
              {/* Mini preview frame */}
              <div className="h-[150px] bg-tala-bg border border-tala-rule rounded-md mb-2.5 overflow-hidden relative">
                {t.id === "editorial" ? (
                  <div className="absolute top-2 left-2">
                    {/* Simplified wireframe for editorial */}
                    <div className="w-[190px] h-[260px] bg-white shadow-sm p-2 scale-[0.55] origin-top-left">
                      <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
                      <div className="h-2 w-12 bg-gray-100 rounded mb-3" />
                      <div className="h-1.5 w-full bg-gray-100 rounded mb-1" />
                      <div className="h-1.5 w-4/5 bg-gray-100 rounded mb-3" />
                      <div className="h-1 w-8 bg-gray-200 rounded mb-1" />
                      <div className="h-1 w-full bg-gray-100 rounded mb-0.5" />
                      <div className="h-1 w-full bg-gray-100 rounded mb-0.5" />
                      <div className="h-1 w-3/4 bg-gray-100 rounded" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[120px] h-[160px] bg-white border border-tala-rule rounded-sm opacity-50" />
                  </div>
                )}

              </div>

              <div className="text-sm font-semibold text-tala-ink">{t.name}</div>
              <div className="text-xs text-tala-muted mt-0.5">{t.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
