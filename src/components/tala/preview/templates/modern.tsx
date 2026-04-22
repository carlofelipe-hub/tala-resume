"use client";

import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";
import { palettes } from "@/lib/tokens";

interface ModernTemplateProps {
  data: ResumeData;
  settings: PreviewSettings;
}

const DENSITY_MULTIPLIER: Record<string, number> = {
  compact: 0.85,
  regular: 1,
  spacious: 1.2,
};

export function ModernTemplate({ data, settings }: ModernTemplateProps) {
  const density = DENSITY_MULTIPLIER[settings.density] ?? 1;
  const palette = palettes[settings.accent] ?? palettes["sun-gold"];
  const pageWidth = settings.paper === "a4" ? 595 : 612;
  const sidebarWidth = 160 * density;

  return (
    <div
      style={{
        width: pageWidth,
        background: "#fff",
        color: "#14110d",
        fontFamily: "var(--font-body)",
        fontSize: 10,
        lineHeight: 1.5,
        padding: `${48 * density}px 52px`,
        boxSizing: "border-box",
        display: "flex",
        gap: 24 * density,
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: sidebarWidth,
          backgroundColor: palette.accentWash,
          padding: 16,
          borderRadius: 8,
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, lineHeight: 1.1, marginBottom: 12 }}>
          {data.name}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: palette.muted, marginBottom: 6 }}>
            Contact
          </div>
          <div style={{ fontSize: 9, lineHeight: 1.6, color: "#555" }}>
            <div>{data.email}</div>
            <div>{data.phone}</div>
            <div>{data.location}</div>
            {data.linkedin && <div>{data.linkedin}</div>}
          </div>
        </div>

        {data.skills.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: palette.muted, marginBottom: 6 }}>
              Skills
            </div>
            <div style={{ fontSize: 9, lineHeight: 1.5 }}>
              {data.skills.join(" · ")}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: palette.muted, marginBottom: 6 }}>
              Education
            </div>
            {data.education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 9 }}>{ed.school}</div>
                <div style={{ fontSize: 9, color: "#555" }}>{ed.degree}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "#888" }}>{ed.dates}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <div style={{ fontSize: 11, color: "#555", marginBottom: 16, fontStyle: "italic" }}>
          {data.title}
        </div>

        {/* Summary */}
        {data.summary && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: palette.muted, marginBottom: 6 }}>
              Profile
            </div>
            <p style={{ margin: 0, fontSize: 10, lineHeight: 1.5 }}>{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: palette.muted, marginBottom: 8 }}>
              Experience
            </div>
            {data.experience.map((job, i) => (
              <div key={i} style={{ marginBottom: i === data.experience.length - 1 ? 0 : 14 * density }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 600, fontSize: 11 }}>{job.role}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>{job.dates}</div>
                </div>
                <div style={{ fontSize: 10, color: "#555", fontStyle: "italic", marginBottom: 4 }}>
                  {job.company}
                </div>
                {job.bullets.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, lineHeight: 1.5 }}>
                    {job.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: 2 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
