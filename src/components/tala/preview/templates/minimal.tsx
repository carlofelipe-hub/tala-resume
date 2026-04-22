"use client";

import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";
import { palettes } from "@/lib/tokens";

interface MinimalTemplateProps {
  data: ResumeData;
  settings: PreviewSettings;
}

const DENSITY_MULTIPLIER: Record<string, number> = {
  compact: 0.85,
  regular: 1,
  spacious: 1.2,
};

export function MinimalTemplate({ data, settings }: MinimalTemplateProps) {
  const density = DENSITY_MULTIPLIER[settings.density] ?? 1;
  const palette = palettes[settings.accent] ?? palettes["sun-gold"];
  const pageWidth = settings.paper === "a4" ? 595 : 612;
  const sectionGap = 32 * density;

  return (
    <div
      style={{
        width: pageWidth,
        background: "#fff",
        color: "#14110d",
        fontFamily: "var(--font-body)",
        fontSize: 10,
        lineHeight: 1.6,
        padding: `${48 * density}px 52px`,
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      {/* Name */}
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, lineHeight: 1.1, marginBottom: 8 }}>
        {data.name}
      </div>

      {/* Title */}
      <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>
        {data.title}
      </div>

      {/* Contact */}
      <div style={{ fontSize: 9.5, color: "#888", marginBottom: sectionGap }}>
        {[data.email, data.phone, data.location, data.linkedin].filter(Boolean).join(" · ")}
      </div>

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: sectionGap }}>
          <div
            style={{
              fontVariant: "small-caps",
              letterSpacing: 3,
              fontSize: 9,
              color: palette.muted,
              marginBottom: 10,
            }}
          >
            Profile
          </div>
          <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: sectionGap, textAlign: "left" }}>
          <div
            style={{
              fontVariant: "small-caps",
              letterSpacing: 3,
              fontSize: 9,
              color: palette.muted,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Experience
          </div>
          {data.experience.map((job, i) => (
            <div key={i} style={{ marginBottom: i === data.experience.length - 1 ? 0 : 18 * density }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 600, fontSize: 11 }}>{job.role}</div>
                <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>
                  {job.company} · {job.dates}
                </div>
              </div>
              {job.bullets.length > 0 && (
                <ul style={{ margin: "8px 0 0", paddingLeft: 20, fontSize: 10, lineHeight: 1.6 }}>
                  {job.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 3 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: sectionGap }}>
          <div
            style={{
              fontVariant: "small-caps",
              letterSpacing: 3,
              fontSize: 9,
              color: palette.muted,
              marginBottom: 10,
            }}
          >
            Education
          </div>
          {data.education.map((ed, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 600, fontSize: 10 }}>{ed.school}</div>
              <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>
                {ed.degree} · {ed.dates}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div>
          <div
            style={{
              fontVariant: "small-caps",
              letterSpacing: 3,
              fontSize: 9,
              color: palette.muted,
              marginBottom: 10,
            }}
          >
            Skills
          </div>
          <div style={{ fontSize: 10, lineHeight: 1.7 }}>
            {data.skills.join(" · ")}
          </div>
        </div>
      )}
    </div>
  );
}
