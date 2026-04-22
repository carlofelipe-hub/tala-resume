"use client";

import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";
import { ResumeSection } from "../resume-section";
import { palettes } from "@/lib/tokens";

interface EditorialTemplateProps {
  data: ResumeData;
  settings: PreviewSettings;
}

const DENSITY_MULTIPLIER: Record<string, number> = {
  compact: 0.85,
  regular: 1,
  spacious: 1.2,
};

export function EditorialTemplate({ data, settings }: EditorialTemplateProps) {
  const density = DENSITY_MULTIPLIER[settings.density] ?? 1;
  const palette = palettes[settings.accent] ?? palettes["sun-gold"];
  const pageWidth = settings.paper === "a4" ? 595 : 612;

  const sectionLabelColor = palette.muted;

  return (
    <div
      style={{
        width: pageWidth,
        background: "#fff",
        color: "#14110d",
        fontFamily: "var(--font-body)",
        fontSize: 10,
        lineHeight: 1.5 * density,
        padding: `${48 * density}px 52px`,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          paddingBottom: 14,
          borderBottom: "1px solid #14110d",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              lineHeight: 1,
              letterSpacing: -1,
              fontWeight: 400,
            }}
          >
            {data.name}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: "#555", letterSpacing: 0.1 }}>
            {data.title}
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "#555",
            lineHeight: 1.7,
          }}
        >
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.location}</div>
          {data.linkedin && <div>{data.linkedin}</div>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <ResumeSection label="Profile">
          <p style={{ margin: 0, fontSize: 10.5, lineHeight: 1.6 * density, color: "#2a2620" }}>
            {data.summary}
          </p>
        </ResumeSection>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <ResumeSection label="Experience">
          {data.experience.map((job, i) => (
            <div key={i} style={{ marginBottom: i === data.experience.length - 1 ? 0 : 18 * density }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 2,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 11 }}>{job.role}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>
                  {job.dates}
                </div>
              </div>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 6, fontStyle: "italic" }}>
                {job.company}
                {job.location ? ` · ${job.location}` : ""}
              </div>
              {job.bullets.length > 0 && (
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 14,
                    fontSize: 10,
                    color: "#2a2620",
                    lineHeight: 1.55 * density,
                  }}
                >
                  {job.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: 3 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ResumeSection>
      )}

      {/* Education */}
      {data.education.length > 0 && (
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
                <div style={{ fontWeight: 600, fontSize: 11 }}>{ed.school}</div>
                <div style={{ fontSize: 10, color: "#555", fontStyle: "italic" }}>{ed.degree}</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "#555" }}>
                {ed.dates}
              </div>
            </div>
          ))}
        </ResumeSection>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <ResumeSection label="Skills" last>
          <div style={{ fontSize: 10, color: "#2a2620", lineHeight: 1.7 }}>
            {data.skills.join(" · ")}
          </div>
        </ResumeSection>
      )}
    </div>
  );
}
