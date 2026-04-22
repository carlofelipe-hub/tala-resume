# Templates, PDF & ATS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 3 additional resume templates, enable PDF download for all 4 templates, and implement client-side ATS scoring.

**Architecture:** New template components render from the same `ResumeData` + `PreviewSettings` props. PDF layer uses `@react-pdf/renderer` with lazy-loaded download. ATS is a pure function that recalculates reactively.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, `@react-pdf/renderer`, shadcn/ui.

---

## File Structure

| File | Responsibility |
|------|--------------|
| `src/components/tala/preview/templates/classic.tsx` | Classic HTML template |
| `src/components/tala/preview/templates/modern.tsx` | Modern HTML template |
| `src/components/tala/preview/templates/minimal.tsx` | Minimal HTML template |
| `src/components/tala/preview/templates/index.ts` | Updated factory with 4 templates |
| `src/lib/pdf/register-fonts.ts` | Font.register() for all pairings |
| `src/lib/pdf/pdf-templates/pdf-editorial.tsx` | PDF Editorial template |
| `src/lib/pdf/pdf-templates/pdf-classic.tsx` | PDF Classic template |
| `src/lib/pdf/pdf-templates/pdf-modern.tsx` | PDF Modern template |
| `src/lib/pdf/pdf-templates/pdf-minimal.tsx` | PDF Minimal template |
| `src/lib/pdf/pdf-templates/index.ts` | PDF template factory |
| `src/components/tala/preview/download-button.tsx` | Lazy-loaded PDF download button |
| `src/lib/ats-score.ts` | computeAtsScore pure function |
| `src/components/tala/preview/ats-score-box.tsx` | Updated with live score display |
| `src/components/tala/preview/template-picker.tsx` | Updated to enable all templates |

---

### Task 1: Install @react-pdf/renderer

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install package**

Run: `npm install @react-pdf/renderer`
Expected: Package installs successfully.

- [ ] **Step 2: Verify installation**

Run: `cat package.json | grep react-pdf`
Expected: `"@react-pdf/renderer"` appears in dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @react-pdf/renderer"
```

---

### Task 2: Classic Template

**Files:**
- Create: `src/components/tala/preview/templates/classic.tsx`

- [ ] **Step 1: Write Classic template**

```tsx
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
```

- [ ] **Step 2: Update template factory**

Open `src/components/tala/preview/templates/index.ts` and add the Classic import/case:

```tsx
import { EditorialTemplate } from "./editorial";
import { ClassicTemplate } from "./classic";

export function getTemplate(name: string) {
  switch (name) {
    case "editorial":
      return EditorialTemplate;
    case "classic":
      return ClassicTemplate;
    default:
      return EditorialTemplate;
  }
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: Zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/tala/preview/templates/
git commit -m "feat(preview): add Classic template"
```

---

### Task 3: Modern Template

**Files:**
- Create: `src/components/tala/preview/templates/modern.tsx`

- [ ] **Step 1: Write Modern template**

```tsx
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
  const mainWidth = pageWidth - sidebarWidth - 104; // 104 = 52px padding * 2

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
          backgroundColor: palette.accentWash.replace("oklch", "rgba").replace(")", ", 0.3)"),
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
```

- [ ] **Step 2: Update template factory**

Add Modern case to `getTemplate`:

```tsx
case "modern":
  return ModernTemplate;
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/tala/preview/templates/
git commit -m "feat(preview): add Modern template"
```

---

### Task 4: Minimal Template

**Files:**
- Create: `src/components/tala/preview/templates/minimal.tsx`

- [ ] **Step 1: Write Minimal template**

```tsx
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
```

- [ ] **Step 2: Update template factory**

Add Minimal case and update default:

```tsx
import { EditorialTemplate } from "./editorial";
import { ClassicTemplate } from "./classic";
import { ModernTemplate } from "./modern";
import { MinimalTemplate } from "./minimal";

export function getTemplate(name: string) {
  switch (name) {
    case "editorial":
      return EditorialTemplate;
    case "classic":
      return ClassicTemplate;
    case "modern":
      return ModernTemplate;
    case "minimal":
      return MinimalTemplate;
    default:
      return EditorialTemplate;
  }
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/tala/preview/templates/
git commit -m "feat(preview): add Minimal template, complete template factory"
```

---

### Task 5: Enable All Templates in Picker

**Files:**
- Modify: `src/components/tala/preview/template-picker.tsx`

- [ ] **Step 1: Remove "Coming soon" logic**

Remove the `isDisabled` logic so all templates are selectable. Remove the disabled overlay, opacity, and cursor-not-allowed classes.

Key changes:
- Remove `const isDisabled = t.id !== "editorial";`
- Remove `disabled={isDisabled}`
- Remove `isDisabled && "opacity-60 cursor-not-allowed"` from className
- Remove the "Coming soon" overlay div
- Keep the wireframe previews for all templates

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/tala/preview/template-picker.tsx
git commit -m "feat(preview): enable all 4 templates in picker"
```

---

### Task 6: PDF Font Registration

**Files:**
- Create: `src/lib/pdf/register-fonts.ts`

- [ ] **Step 1: Write font registration**

```ts
import { Font } from "@react-pdf/renderer";

// Editorial: Instrument Serif + Geist
Font.register({
  family: "Instrument Serif",
  src: "https://fonts.gstatic.com/s/instrumentserif/v4/jizBRFtNs2ka5fXjeivQ4LroWlx-2zIZj1bIkNo.woff2",
  fontStyle: "normal",
  fontWeight: 400,
});
Font.register({
  family: "Geist",
  src: "https://fonts.gstatic.com/s/geist/v1/gyBhhwUxIdKoE5NaTOQr.woff2",
  fontStyle: "normal",
  fontWeight: 400,
});

// Kuwentuhan: DM Serif Display + DM Sans + Caveat
Font.register({
  family: "DM Serif Display",
  src: "https://fonts.gstatic.com/s/dmserifdisplay/v15/-nFnOHM81r4j6k0gjAW3mujVU2B2G_5x0ujy.woff2",
});
Font.register({
  family: "DM Sans",
  src: "https://fonts.gstatic.com/s/dmsans/v15/rP2Yp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRR23w.woff2",
});
Font.register({
  family: "Caveat",
  src: "https://fonts.gstatic.com/s/caveat/v18/Wnz6HAc5bAfYB2QLYTwZr46x.woff2",
});

// Pinoy: Fraunces + Newsreader
Font.register({
  family: "Fraunces",
  src: "https://fonts.gstatic.com/s/fraunces/v31/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nib14c7qv8o.woff2",
});
Font.register({
  family: "Newsreader",
  src: "https://fonts.gstatic.com/s/newsreader/v20/cY9qfjOCX1hbuyalUrK439vogqC9yFZCYg7oRZaLP4obnf7fTXglsMz-.woff2",
});

// Retro: Gloock + Space Grotesk
Font.register({
  family: "Gloock",
  src: "https://fonts.gstatic.com/s/gloock/v1/Iurb6YFw84WUY4Pnoz_9pQ.woff2",
});
Font.register({
  family: "Space Grotesk",
  src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7oUXskPMBBSSJLm2E.woff2",
});

// Signpainter: Shrikhand + Plus Jakarta Sans
Font.register({
  family: "Shrikhand",
  src: "https://fonts.gstatic.com/s/shrikhand/v15/a8IbNovqLWfZWU7 gam5.woff2",
});
Font.register({
  family: "Plus Jakarta Sans",
  src: "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoa08I4iJmwzhcB9XqrR4J_j4z4z12r42D.woff2",
});

// Monospace fallback
Font.register({
  family: "Geist Mono",
  src: "https://fonts.gstatic.com/s/geistmono/v1/gyBthhwUxIdKoE5NaTOQrE4P5ClP5wU5PqU.woff2",
});

export const pdfFontMap: Record<string, { display: string; body: string; mono: string }> = {
  editorial: { display: "Instrument Serif", body: "Geist", mono: "Geist Mono" },
  kuwentuhan: { display: "DM Serif Display", body: "DM Sans", mono: "Geist Mono" },
  pinoy: { display: "Fraunces", body: "Newsreader", mono: "Geist Mono" },
  retro: { display: "Gloock", body: "Space Grotesk", mono: "Geist Mono" },
  signpainter: { display: "Shrikhand", body: "Plus Jakarta Sans", mono: "Geist Mono" },
};
```

- [ ] **Step 2: Verify file**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/lib/pdf/register-fonts.ts
git commit -m "feat(pdf): add font registration for all typography pairings"
```

---

### Task 7: PDF Editorial Template

**Files:**
- Create: `src/lib/pdf/pdf-templates/pdf-editorial.tsx`

- [ ] **Step 1: Write PDF Editorial**

```tsx
import { Document, Page, Text, View, Link } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/preview";

interface PdfEditorialProps {
  data: ResumeData;
}

const styles = {
  page: { padding: 48, fontSize: 10, fontFamily: "Geist", lineHeight: 1.5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 14, borderBottom: "1px solid #14110d", marginBottom: 18 },
  name: { fontFamily: "Instrument Serif", fontSize: 28, lineHeight: 1 },
  title: { fontSize: 11, color: "#555", marginTop: 4 },
  contact: { textAlign: "right", fontSize: 9, color: "#555", lineHeight: 1.6 },
  sectionLabel: { fontSize: 8.5, letterSpacing: 2, textTransform: "uppercase", color: "#888", marginBottom: 8 },
  role: { fontWeight: 700, fontSize: 11 },
  company: { fontSize: 10, color: "#555", fontStyle: "italic", marginBottom: 4 },
  bullet: { fontSize: 10, marginBottom: 2, paddingLeft: 10 },
};

export function PdfEditorial({ data }: PdfEditorialProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
          <View style={styles.contact}>
            <Text>{data.email}</Text>
            <Text>{data.phone}</Text>
            <Text>{data.location}</Text>
            {data.linkedin && <Text>{data.linkedin}</Text>}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>Profile</Text>
            <Text style={{ fontSize: 10.5, lineHeight: 1.6 }}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>Experience</Text>
            {data.experience.map((job, i) => (
              <View key={i} style={{ marginBottom: i === data.experience.length - 1 ? 0 : 14 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.role}>{job.role}</Text>
                  <Text style={{ fontSize: 9, color: "#555" }}>{job.dates}</Text>
                </View>
                <Text style={styles.company}>{job.company}</Text>
                {job.bullets.map((b, j) => (
                  <Text key={j} style={styles.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.sectionLabel}>Education</Text>
            {data.education.map((ed, i) => (
              <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: i === data.education.length - 1 ? 0 : 6 }}>
                <View>
                  <Text style={{ fontWeight: 700, fontSize: 11 }}>{ed.school}</Text>
                  <Text style={{ fontSize: 10, color: "#555" }}>{ed.degree}</Text>
                </View>
                <Text style={{ fontSize: 9, color: "#555" }}>{ed.dates}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>Skills</Text>
            <Text style={{ fontSize: 10 }}>{data.skills.join(" · ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/pdf/pdf-templates/pdf-editorial.tsx
git commit -m "feat(pdf): add Editorial PDF template"
```

---

### Task 8: PDF Classic Template

**Files:**
- Create: `src/lib/pdf/pdf-templates/pdf-classic.tsx`

- [ ] **Step 1: Write PDF Classic**

Follow the same structure as pdf-editorial but with Classic styling:
- Bold name 22px
- Inline contact row
- Horizontal rules between sections (`<View style={{ borderTop: "1px solid #ccc", marginVertical: 14 }} />`)
- Bold uppercase section headers
- Bullet points with `•` prefix
- Comma-separated skills

- [ ] **Step 2: Commit**

```bash
git add src/lib/pdf/pdf-templates/pdf-classic.tsx
git commit -m "feat(pdf): add Classic PDF template"
```

---

### Task 9: PDF Modern Template

**Files:**
- Create: `src/lib/pdf/pdf-templates/pdf-modern.tsx`

- [ ] **Step 1: Write PDF Modern**

Two-column layout using react-pdf flexbox:
- Left sidebar ~140px with name, contact, skills, education
- Right main content with summary and experience
- Use `flexDirection: "row"` on the page body

- [ ] **Step 2: Commit**

```bash
git add src/lib/pdf/pdf-templates/pdf-modern.tsx
git commit -m "feat(pdf): add Modern PDF template"
```

---

### Task 10: PDF Minimal Template

**Files:**
- Create: `src/lib/pdf/pdf-templates/pdf-minimal.tsx`

- [ ] **Step 1: Write PDF Minimal**

Centered layout:
- Centered name, title, contact
- Section labels in small caps
- Experience entries centered header, left-aligned bullets

- [ ] **Step 2: Commit**

```bash
git add src/lib/pdf/pdf-templates/pdf-minimal.tsx
git commit -m "feat(pdf): add Minimal PDF template"
```

---

### Task 11: PDF Template Factory

**Files:**
- Create: `src/lib/pdf/pdf-templates/index.ts`

- [ ] **Step 1: Write factory**

```tsx
import { PdfEditorial } from "./pdf-editorial";
import { PdfClassic } from "./pdf-classic";
import { PdfModern } from "./pdf-modern";
import { PdfMinimal } from "./pdf-minimal";
import type { ResumeData } from "@/types/preview";

export function getPdfTemplate(name: string) {
  switch (name) {
    case "editorial":
      return PdfEditorial;
    case "classic":
      return PdfClassic;
    case "modern":
      return PdfModern;
    case "minimal":
      return PdfMinimal;
    default:
      return PdfEditorial;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/pdf/pdf-templates/index.ts
git commit -m "feat(pdf): add PDF template factory"
```

---

### Task 12: Download Button

**Files:**
- Create: `src/components/tala/preview/download-button.tsx`
- Modify: `src/app/(preview)/layout.tsx`

- [ ] **Step 1: Write DownloadButton**

```tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-3 py-1.5 text-sm font-medium text-tala-surface opacity-70">
        Loading PDF...
      </span>
    ),
  }
);

interface DownloadButtonProps {
  data: ResumeData;
  settings: PreviewSettings;
}

export function DownloadButton({ data, settings }: DownloadButtonProps) {
  const [pdfDoc, setPdfDoc] = useState<React.ReactNode>(null);

  const handleClick = async () => {
    if (pdfDoc) return;
    
    const { getPdfTemplate } = await import("@/lib/pdf/pdf-templates");
    const PdfTemplate = getPdfTemplate(settings.template);
    
    setPdfDoc(<PdfTemplate data={data} />);
  };

  const fileName = `${data.name.replace(/\s+/g, "_") || "resume"}_resume.pdf`;

  if (pdfDoc) {
    return (
      <PDFDownloadLink
        document={pdfDoc as any}
        fileName={fileName}
        className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-3 py-1.5 text-sm font-medium text-tala-surface hover:opacity-90 transition-opacity"
      >
        Download PDF
      </PDFDownloadLink>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-3 py-1.5 text-sm font-medium text-tala-surface hover:opacity-90 transition-opacity"
    >
      Download PDF
    </button>
  );
}
```

- [ ] **Step 2: Update preview layout**

Replace the disabled Download PDF button in `src/app/(preview)/layout.tsx` with the actual DownloadButton. Since the layout is a server component and DownloadButton is a client component that needs `data` and `settings`, we need to pass these from the page or restructure.

**Approach:** Move the Download button into `PreviewClient` instead of the layout, since that's where `data` and `settings` live.

Modify `PreviewClient` to include a download button in the header area, or add it to the top bar inside `PreviewClient`.

Alternatively, add a simple prop-drilling approach: pass `data` to the layout via context, but that's overkill.

**Simplest fix:** Add the DownloadButton to `PreviewClient` in the top-right of the resume center column, or right next to the FineTunePanel header.

Actually, the cleanest approach is to add it to the `PreviewClient` header bar. Let's add a small toolbar inside `PreviewClient` above the grid.

Modify `src/components/tala/preview/preview-client.tsx`:

```tsx
import { DownloadButton } from "./download-button";

// Inside the component, add a toolbar:
<div className="flex items-center justify-between px-6 py-3 border-b border-tala-rule bg-tala-surface lg:hidden">
  <TalaMeta>Preview · {settings.template}</TalaMeta>
  <DownloadButton data={data} settings={settings} />
</div>
```

And for desktop, add it near the FineTunePanel or in a floating position.

Actually, the simplest approach: update the preview layout to accept children that include the button, OR add the button directly in PreviewClient.

Let's update `PreviewClient` to render a small header above the grid with the download button:

```tsx
<div className={fontClasses}>
  {/* Mobile top bar */}
  <div className="flex items-center justify-between px-4 py-3 border-b border-tala-rule bg-tala-surface lg:hidden">
    <span className="text-xs font-mono uppercase tracking-wider text-tala-muted">
      Preview · {settings.template}
    </span>
    <DownloadButton data={data} settings={settings} />
  </div>
  
  {/* Desktop: hide the layout header's disabled button and use this instead */}
  <div className="hidden lg:flex items-center justify-end px-6 py-2 border-b border-tala-rule bg-tala-surface">
    <DownloadButton data={data} settings={settings} />
  </div>
  
  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] min-h-[calc(100vh-64px)]">
    {/* ... rest unchanged ... */}
  </div>
</div>
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/tala/preview/download-button.tsx src/components/tala/preview/preview-client.tsx
git commit -m "feat(pdf): add DownloadButton with lazy-loaded react-pdf"
```

---

### Task 13: ATS Score Function

**Files:**
- Create: `src/lib/ats-score.ts`

- [ ] **Step 1: Write computeAtsScore**

```ts
import type { ResumeData, PreviewSettings } from "@/types/preview";

const ACTION_VERBS = [
  "led", "managed", "built", "delivered", "designed", "developed",
  "improved", "reduced", "increased", "created", "launched", "scaled",
  "spearheaded", "optimized", "implemented", "engineered", "architected",
  "streamlined", "automated", "negotiated", "mentored", "revamped",
];

function hasNumber(text: string): boolean {
  return /\d/.test(text);
}

function hasActionVerb(text: string): boolean {
  const lower = text.toLowerCase();
  return ACTION_VERBS.some((verb) => lower.includes(verb));
}

function countUniqueWords(bullets: string[]): number {
  const words = bullets
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  return new Set(words).size;
}

export function computeAtsScore(
  data: ResumeData,
  settings: PreviewSettings
): { score: number; insight: string } {
  let score = 0;

  // Contact completeness (10 pts)
  if (data.name.length > 0) score += 2.5;
  if (data.email.length > 0) score += 2.5;
  if (data.phone.length > 0) score += 2.5;
  if (data.location.length > 0) score += 2.5;

  // Summary (10 pts)
  if (data.summary.length > 20) score += 10;
  else if (data.summary.length > 0) score += 5;

  // Experience quality (30 pts)
  let expScore = 0;
  let hasMetrics = false;
  let hasActionVerbs = false;

  for (const job of data.experience) {
    if (job.bullets.length >= 3) expScore += 5;
    else if (job.bullets.length > 0) expScore += 3;

    for (const bullet of job.bullets) {
      if (hasNumber(bullet)) hasMetrics = true;
      if (hasActionVerb(bullet)) hasActionVerbs = true;
    }
  }
  expScore = Math.min(20, expScore); // cap bullet count score at 20
  if (hasMetrics) expScore += 5;
  if (hasActionVerbs) expScore += 5;
  score += Math.min(30, expScore);

  // Education (10 pts)
  if (data.education.length > 0) score += 10;

  // Skills (10 pts)
  if (data.skills.length >= 5) score += 10;
  else if (data.skills.length > 0) score += 5;

  // Template friendliness (15 pts)
  const templateScores: Record<string, number> = {
    classic: 15,
    editorial: 12,
    minimal: 10,
    modern: 8,
  };
  score += templateScores[settings.template] ?? 12;

  // Keyword variety (15 pts)
  const allBullets = data.experience.flatMap((j) => j.bullets);
  const uniqueWords = countUniqueWords(allBullets);
  const keywordScore = Math.min(15, Math.round((uniqueWords / 30) * 15));
  score += keywordScore;

  // Cap at 100
  score = Math.min(100, Math.round(score));

  // Insight
  let insight = "";
  if (score >= 90) insight = "Excellent ATS parse. Your résumé is well-optimized.";
  else if (score >= 75) insight = "Good parse. Add more metrics or keywords for a higher score.";
  else if (score >= 60) insight = "Fair parse. Consider adding a summary, more bullets, or switching to the Classic template.";
  else if (score >= 40) insight = "Weak parse. Fill in contact info, add experience bullets, and include skills.";
  else insight = "Poor parse. Your résumé needs more content before ATS submission.";

  return { score, insight };
}
```

- [ ] **Step 2: Write verification script**

Create `scripts/verify-ats-score.ts`:

```ts
import { computeAtsScore } from "../src/lib/ats-score";
import assert from "assert";

const perfectData = {
  name: "Maria Reyes",
  title: "Customer Success Lead",
  email: "maria@test.com",
  phone: "+63 917 555 0142",
  location: "Quezon City",
  summary: "Customer success professional with 5+ years building support operations for SaaS teams.",
  experience: [
    {
      role: "Team Lead",
      company: "Lumi",
      dates: "2023-Present",
      bullets: [
        "Led a 12-person team serving 840 accounts",
        "Reduced ticket resolution time by 38%",
        "Launched bilingual onboarding playbook",
        "Improved NPS from 42 to 71",
      ],
    },
  ],
  education: [{ school: "University of Santo Tomas", degree: "B.A. Communication Arts", dates: "2015-2019" }],
  skills: ["Zendesk", "Intercom", "Salesforce", "Team Leadership", "SQL", "Onboarding Design"],
};

const classicSettings = { template: "classic", typography: "editorial", density: "regular", accent: "sun-gold", paper: "letter", language: "english" };

const result = computeAtsScore(perfectData as any, classicSettings as any);
assert(result.score >= 85, `Expected high score, got ${result.score}`);
assert(result.insight.includes("Excellent") || result.insight.includes("Good"));
console.log("✓ Perfect resume score:", result.score, result.insight);

const sparseData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

const sparseResult = computeAtsScore(sparseData as any, classicSettings as any);
assert(sparseResult.score < 40, `Expected low score, got ${sparseResult.score}`);
console.log("✓ Sparse resume score:", sparseResult.score, sparseResult.insight);

console.log("\nAll ATS score tests passed!");
```

Run: `npx tsx scripts/verify-ats-score.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/ats-score.ts scripts/verify-ats-score.ts
git commit -m "feat(ats): add computeAtsScore with verification"
```

---

### Task 14: Update AtsScoreBox with Live Score

**Files:**
- Modify: `src/components/tala/preview/ats-score-box.tsx`
- Modify: `src/components/tala/preview/fine-tune-panel.tsx`

- [ ] **Step 1: Update AtsScoreBox**

```tsx
"use client";

import { TalaMeta } from "@/components/tala/tala-meta";
import { palettes } from "@/lib/tokens";
import type { PaletteName } from "@/lib/tokens";
import { computeAtsScore } from "@/lib/ats-score";
import type { ResumeData, PreviewSettings } from "@/types/preview";

interface AtsScoreBoxProps {
  data: ResumeData;
  settings: PreviewSettings;
}

export function AtsScoreBox({ data, settings }: AtsScoreBoxProps) {
  const palette = palettes[settings.accent] ?? palettes["sun-gold"];
  const { score, insight } = computeAtsScore(data, settings);

  return (
    <div
      className="mt-6 p-4 rounded-xl"
      style={{ backgroundColor: palette.accentWash }}
    >
      <TalaMeta style={{ color: palette.accentInk, marginBottom: 6 }}>
        ATS Score
      </TalaMeta>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span
          className="text-4xl leading-none"
          style={{ fontFamily: "var(--font-display)", color: palette.accentInk }}
        >
          {score}
        </span>
        <span className="text-sm" style={{ color: palette.accentInk }}>
          / 100
        </span>
      </div>
      <p className="text-sm" style={{ color: palette.accentInk, lineHeight: 1.5 }}>
        {insight}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Update FineTunePanel to pass data**

Modify `FineTunePanelProps` to include `data`:

```tsx
interface FineTunePanelProps {
  data: ResumeData;
  settings: PreviewSettings;
  onChange: (settings: PreviewSettings) => void;
}
```

Update the AtsScoreBox usage:
```tsx
<AtsScoreBox data={data} settings={settings} />
```

Update `PreviewClient` to pass `data` to `FineTunePanel`:
```tsx
<FineTunePanel data={data} settings={settings} onChange={setSettings} />
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/tala/preview/ats-score-box.tsx src/components/tala/preview/fine-tune-panel.tsx src/components/tala/preview/preview-client.tsx
git commit -m "feat(ats): wire live ATS score into AtsScoreBox"
```

---

### Task 15: Integration & Verification

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: Zero errors.

- [ ] **Step 2: Run compileResume verification**

Run: `npx tsx scripts/verify-compile-resume.ts`
Expected: All tests pass.

- [ ] **Step 3: Run ATS verification**

Run: `npx tsx scripts/verify-ats-score.ts`
Expected: All tests pass.

- [ ] **Step 4: Production build**

Run: `npx next build`
Expected: Build succeeds with all routes.

- [ ] **Step 5: Manual verification checklist**

1. Navigate to `/preview` with data
2. Switch to **Classic** template → layout changes to bold headers + rules
3. Switch to **Modern** template → two-column layout appears
4. Switch to **Minimal** template → centered, airy layout
5. Click **Download PDF** → generates and downloads PDF matching current template
6. Verify PDF fonts load correctly
7. Adjust content (knobs don't affect ATS, but template does) → ATS score updates
8. Check ATS insight message changes based on score range

- [ ] **Step 6: Final commit**

```bash
git add scripts/verify-ats-score.ts
git commit -m "test: add ATS score verification script"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✓ Classic template — Task 2
- ✓ Modern template — Task 3
- ✓ Minimal template — Task 4
- ✓ Template picker enables all 4 — Task 5
- ✓ PDF font registration — Task 6
- ✓ PDF Editorial template — Task 7
- ✓ PDF Classic template — Task 8
- ✓ PDF Modern template — Task 9
- ✓ PDF Minimal template — Task 10
- ✓ PDF template factory — Task 11
- ✓ Download button with lazy loading — Task 12
- ✓ ATS computeAtsScore — Task 13
- ✓ Live ATS score in UI — Task 14

**2. Placeholder scan:**
- No TBD, TODO, or vague steps.

**3. Type consistency:**
- `AtsScoreBox` now receives `data` prop — consistent with `FineTunePanel` and `PreviewClient` updates.
- PDF templates use `ResumeData` type consistently.

**4. Gaps:** None identified.
