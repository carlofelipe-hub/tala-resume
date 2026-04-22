"use client";

import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";
import { ResumeSection } from "../resume-section";
import { palettes } from "@/lib/tokens";

interface ClassicTemplateProps {
  data: ResumeData;
  settings: PreviewSettings;
}

const DENSITY_MULTIPLIER: Record<string, number> = {
  compact: 0.85,
  regular: 1,
  spacious: 1.2,
};

export function ClassicTemplate({ data, settings }: ClassicTemplateProps) {
  const density = DENSITY_MULTIPLIER[settings.density] ?? 1;
  const palette = palettes[settings.accent] ?? palettes["sun-gold"];
  const pageWidth = settings.paper === "a4" ? 595 : 612;
  const sectionPadding = 18 * density;

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
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: sectionPadding }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {data.name}
        </div>
        <div
          style={{
            fontSize: 9.5,
            color: "#555",
            marginTop: 4,
          }}
        >
          {[data.email, data.phone, data.location, data.linkedin]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>

      {/* Horizontal rule */}
      <div style={{ borderTop: "1px solid #ccc", marginBottom: sectionPadding }} />

      {/* Summary */}
      {data.summary && (
        <>
          <ResumeSection label="Summary">
            <p style={{ margin: 0, fontSize: 10, lineHeight: 1.5 }}>{data.summary}</p>
          </ResumeSection>
          <div style={{ borderTop: "1px solid #ccc", margin: `${sectionPadding}px 0` }} />
        </>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <>
          <ResumeSection label="Experience">
            {data.experience.map((job, i) => (
              <div key={i} style={{ marginBottom: i === data.experience.length - 1 ? 0 : 14 * density }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>{job.role}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>
                    {job.dates}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "#555", fontStyle: "italic", marginBottom: 4 }}>
                  {job.company}
                </div>
                {job.bullets.length > 0 && (
                  <div style={{ fontSize: 10, lineHeight: 1.5, color: "#2a2620" }}>
                    {job.bullets.map((b, j) => (
                      <div key={j} style={{ marginBottom: 2 }}>
                        • {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ResumeSection>
          <div style={{ borderTop: "1px solid #ccc", margin: `${sectionPadding}px 0` }} />
        </>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <>
          <ResumeSection label="Education">
            {data.education.map((ed, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: i === data.education.length - 1 ? 0 : 6,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11 }}>{ed.school}</div>
                  <div style={{ fontSize: 10, color: "#555" }}>{ed.degree}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>
                  {ed.dates}
                </div>
              </div>
            ))}
          </ResumeSection>
          <div style={{ borderTop: "1px solid #ccc", margin: `${sectionPadding}px 0` }} />
        </>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <ResumeSection label="Skills" last>
          <div style={{ fontSize: 10, lineHeight: 1.5 }}>
            {data.skills.join(", ")}
          </div>
        </ResumeSection>
      )}
    </div>
  );
}
