# Core Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Core Preview feature: data compilation, editorial resume template, preview page with template picker and fine-tune knobs, basic mobile responsive.

**Architecture:** Server component fetches profile + interview session + resume analysis, compiles into `ResumeData` via pure function, passes to client component. Client manages `PreviewSettings` state locally and renders live preview with 3-column desktop / single-column mobile layout.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Supabase, shadcn/ui components (Select for knobs).

---

## File Structure

| File | Responsibility |
|------|--------------|
| `supabase/migrations/00009_add_profile_contact_fields.sql` | Add phone, location, linkedin to profiles |
| `src/types/preview.ts` | ResumeData, PreviewSettings, template/knob type unions |
| `src/lib/compile-resume.ts` | Pure function: merge profile + session + analysis → ResumeData |
| `src/components/tala/preview/resume-section.tsx` | Reusable section label (mono, uppercase) |
| `src/components/tala/preview/templates/editorial.tsx` | Editorial template component |
| `src/components/tala/preview/templates/index.ts` | Template factory / barrel export |
| `src/components/tala/preview/tala-resume-doc.tsx` | Resume document wrapper (612px, scale, delegates to template) |
| `src/components/tala/preview/knob.tsx` | Label + Select dropdown for fine-tune panel |
| `src/components/tala/preview/ats-score-box.tsx` | Placeholder accent-wash card |
| `src/components/tala/preview/fine-tune-panel.tsx` | 5 knobs + ATS score box |
| `src/components/tala/preview/template-picker.tsx` | 4 template cards with mini-previews |
| `src/components/tala/preview/preview-client.tsx` | Client layout, settings state, 3-col/1-col grid |
| `src/components/tala/preview/index.ts` | Barrel export for preview components |
| `src/app/(preview)/layout.tsx` | Auth guard + preview header bar |
| `src/app/(preview)/preview/page.tsx` | Server component: fetch, compile, render client |

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/00009_add_profile_contact_fields.sql`

- [ ] **Step 1: Write migration**

```sql
alter table public.profiles
  add column phone text,
  add column location text,
  add column linkedin text;
```

- [ ] **Step 2: Apply migration locally**

Run: `npx supabase migration up`
Expected: Migration applies successfully.

- [ ] **Step 3: Verify columns exist**

Run: `npx supabase db dump --data-only | grep -A 20 "CREATE TABLE public.profiles"`
Expected: Columns `phone`, `location`, `linkedin` appear in schema.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/00009_add_profile_contact_fields.sql
git commit -m "feat(db): add phone, location, linkedin to profiles"
```

---

### Task 2: Preview Types

**Files:**
- Create: `src/types/preview.ts`

- [ ] **Step 1: Write types file**

```typescript
import type { TypographyName, DensityName, PaletteName } from "@/lib/tokens";

export type TemplateName = "editorial" | "classic" | "modern" | "minimal";
export type PaperName = "letter" | "a4";
export type LanguageName = "english" | "filipino" | "bilingual";

export interface ResumeExperienceEntry {
  role: string;
  company: string;
  location?: string;
  dates: string;
  bullets: string[];
}

export interface ResumeEducationEntry {
  school: string;
  degree: string;
  dates: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  summary: string;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
  skills: string[];
}

export interface PreviewSettings {
  template: TemplateName;
  typography: TypographyName;
  density: DensityName;
  accent: PaletteName;
  paper: PaperName;
  language: LanguageName;
}

export const defaultPreviewSettings: PreviewSettings = {
  template: "editorial",
  typography: "editorial",
  density: "regular",
  accent: "sun-gold",
  paper: "letter",
  language: "english",
};
```

- [ ] **Step 2: Commit**

```bash
git add src/types/preview.ts
git commit -m "feat(types): add ResumeData and PreviewSettings types"
```

---

### Task 3: compileResume Function

**Files:**
- Create: `src/lib/compile-resume.ts`
- Create: `scripts/verify-compile-resume.ts`

- [ ] **Step 1: Write compileResume**

```typescript
import type { ResumeData, ResumeExperienceEntry, ResumeEducationEntry } from "@/types/preview";
import type { InterviewJob, BulletDraft } from "@/types/interview";
import type { ResumeAnalysis, ResumeExperienceItem } from "@/types/resume";

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  target_role: string | null;
}

interface InterviewSession {
  jobs: InterviewJob[];
  bullets: Record<string, BulletDraft[]>;
}

export function compileResume(
  profile: Profile,
  session: InterviewSession | null,
  analysis: ResumeAnalysis | null
): ResumeData {
  const jobs = session?.jobs ?? [];
  const bullets = session?.bullets ?? {};

  const experience: ResumeExperienceEntry[] = jobs.map((job) => {
    const jobBullets = bullets[job.id] ?? [];
    const bulletTexts = jobBullets.map((b) => b.text);

    // Fallback to analysis description if no bullets
    if (bulletTexts.length === 0 && analysis) {
      const analysisExp = analysis.experiences.find(
        (e) => e.role === job.role && e.company === job.company
      );
      if (analysisExp?.description) {
        bulletTexts.push(analysisExp.description);
      }
    }

    return {
      role: job.role,
      company: job.company,
      location: "", // InterviewJob doesn't have location yet
      dates: job.dates,
      bullets: bulletTexts,
    };
  });

  // Fallback: add experiences from analysis that aren't in jobs
  const analysisExps: ResumeExperienceEntry[] =
    analysis?.experiences
      .filter(
        (ae) =>
          !jobs.some((j) => j.role === ae.role && j.company === ae.company)
      )
      .map((ae) => ({
        role: ae.role,
        company: ae.company,
        dates: ae.dates ?? "",
        bullets: ae.description ? [ae.description] : [],
      })) ?? [];

  const allExperience = [...experience, ...analysisExps];

  const education: ResumeEducationEntry[] =
    analysis?.experiences && Array.isArray((analysis as any).education)
      ? (analysis as any).education
      : [];

  const skills: string[] =
    analysis?.experiences && Array.isArray((analysis as any).skills)
      ? (analysis as any).skills
      : [];

  const firstJob = allExperience[0];

  return {
    name: profile.full_name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    linkedin: profile.linkedin ?? undefined,
    title: profile.target_role ?? firstJob?.role ?? "",
    summary: analysis?.summary ?? "",
    experience: allExperience,
    education,
    skills,
  };
}
```

- [ ] **Step 2: Write verification script**

```typescript
import { compileResume } from "../src/lib/compile-resume";
import assert from "assert";

const profile = {
  full_name: "Maria Reyes",
  email: "maria@test.com",
  phone: "+63 917 555 0142",
  location: "Quezon City",
  linkedin: "linkedin.com/in/mariareyes",
  target_role: "Customer Success Lead",
};

const session = {
  jobs: [
    { id: "j1", role: "Team Lead", company: "Lumi", dates: "2023-Present", level: 2, mined: {} as any },
  ],
  bullets: {
    j1: [{ id: "b1", jobId: "j1", text: "Led 12-person team", level: 2, fresh: false }],
  },
};

const analysis = {
  is_resume: true,
  summary: "CS professional with 5+ years",
  experiences: [
    { role: "Team Lead", company: "Lumi", dates: "2023-Present", description: "Managed team" },
    { role: "Specialist", company: "Acenture", dates: "2020-2023", description: "Handled tickets" },
  ],
  major_issues: [],
  minor_issues: [],
  positives: [],
};

// Test 1: Full data
const full = compileResume(profile, session, analysis as any);
assert.strictEqual(full.name, "Maria Reyes");
assert.strictEqual(full.experience.length, 2);
assert.strictEqual(full.experience[0].bullets[0], "Led 12-person team");
assert.strictEqual(full.experience[1].bullets[0], "Handled tickets");
assert.strictEqual(full.summary, "CS professional with 5+ years");
console.log("✓ Test 1: full data merge");

// Test 2: Missing bullets falls back to analysis
const noBullets = compileResume(profile, { jobs: session.jobs, bullets: {} }, analysis as any);
assert.strictEqual(noBullets.experience[0].bullets[0], "Managed team");
console.log("✓ Test 2: fallback to analysis description");

// Test 3: No session
const noSession = compileResume(profile, null, null);
assert.strictEqual(noSession.name, "Maria Reyes");
assert.strictEqual(noSession.experience.length, 0);
assert.strictEqual(noSession.title, "Customer Success Lead");
console.log("✓ Test 3: null session handling");

// Test 4: Missing profile fields
const sparseProfile = { full_name: null, email: null, phone: null, location: null, linkedin: null, target_role: null };
const sparse = compileResume(sparseProfile as any, session, null);
assert.strictEqual(sparse.name, "");
assert.strictEqual(sparse.title, "Team Lead"); // falls back to first job role
console.log("✓ Test 4: missing profile fields");

console.log("\nAll compileResume tests passed!");
```

- [ ] **Step 3: Run verification**

Run: `npx tsx scripts/verify-compile-resume.ts`
Expected: All 4 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/compile-resume.ts scripts/verify-compile-resume.ts
git commit -m "feat(lib): add compileResume with verification script"
```

---

### Task 4: ResumeSection Component

**Files:**
- Create: `src/components/tala/preview/resume-section.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

interface ResumeSectionProps {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}

export function ResumeSection({ label, children, last = false }: ResumeSectionProps) {
  return (
    <div style={{ marginTop: 18, marginBottom: last ? 0 : 0 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 8.5,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#888",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/resume-section.tsx
git commit -m "feat(preview): add ResumeSection component"
```

---

### Task 5: Editorial Template

**Files:**
- Create: `src/components/tala/preview/templates/editorial.tsx`
- Create: `src/components/tala/preview/templates/index.ts`

- [ ] **Step 1: Write editorial template**

```tsx
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
```

- [ ] **Step 2: Write template factory**

```tsx
import { EditorialTemplate } from "./editorial";
import type { ResumeData } from "@/types/preview";
import type { PreviewSettings } from "@/types/preview";

export function getTemplate(name: string) {
  switch (name) {
    case "editorial":
      return EditorialTemplate;
    default:
      return EditorialTemplate;
  }
}

export type TemplateComponent = React.FC<{
  data: ResumeData;
  settings: PreviewSettings;
}>;

export { EditorialTemplate };
```

- [ ] **Step 3: Commit**

```bash
git add src/components/tala/preview/templates/
git commit -m "feat(preview): add Editorial template and template factory"
```

---

### Task 6: TalaResumeDoc Component

**Files:**
- Create: `src/components/tala/preview/tala-resume-doc.tsx`

- [ ] **Step 1: Write component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/tala-resume-doc.tsx
git commit -m "feat(preview): add TalaResumeDoc wrapper component"
```

---

### Task 7: Knob Component

**Files:**
- Create: `src/components/tala/preview/knob.tsx`

- [ ] **Step 1: Install shadcn Select if not present**

Run: `npx shadcn add select` or verify `src/components/ui/select.tsx` exists.

- [ ] **Step 2: Write Knob component**

```tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KnobProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export function Knob({ label, value, options, onChange }: KnobProps) {
  return (
    <div className="mb-4">
      <div className="text-xs text-tala-muted mb-1.5">{label}</div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-9 text-sm bg-tala-bg border-tala-rule">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-sm">
              {opt.charAt(0).toUpperCase() + opt.slice(1).replace(/-/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/tala/preview/knob.tsx
git commit -m "feat(preview): add Knob component with shadcn Select"
```

---

### Task 8: ATS Score Box (Placeholder)

**Files:**
- Create: `src/components/tala/preview/ats-score-box.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { TalaMeta } from "@/components/tala/tala-meta";
import { palettes } from "@/lib/tokens";
import type { PaletteName } from "@/lib/tokens";

interface AtsScoreBoxProps {
  accent: PaletteName;
}

export function AtsScoreBox({ accent }: AtsScoreBoxProps) {
  const palette = palettes[accent] ?? palettes["sun-gold"];

  return (
    <div
      className="mt-6 p-4 rounded-xl"
      style={{
        backgroundColor: palette.accentWash,
      }}
    >
      <TalaMeta style={{ color: palette.accentInk, marginBottom: 6 }}>
        ATS Score
      </TalaMeta>
      <p className="text-sm" style={{ color: palette.accentInk, lineHeight: 1.5 }}>
        Coming in next update
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Check TalaMeta accepts style prop**

Open `src/components/tala/tala-meta.tsx` and verify it accepts a `style` prop. If not, add it:

```tsx
interface TalaMetaProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function TalaMeta({ children, style }: TalaMetaProps) {
  return (
    <span
      className="text-xs font-mono uppercase tracking-wider text-tala-muted"
      style={style}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/tala/preview/ats-score-box.tsx src/components/tala/tala-meta.tsx
git commit -m "feat(preview): add ATS score placeholder box"
```

---

### Task 9: Fine-Tune Panel

**Files:**
- Create: `src/components/tala/preview/fine-tune-panel.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { Knob } from "./knob";
import { AtsScoreBox } from "./ats-score-box";
import type { PreviewSettings } from "@/types/preview";
import { typographyPairings, palettes } from "@/lib/tokens";

interface FineTunePanelProps {
  settings: PreviewSettings;
  onChange: (settings: PreviewSettings) => void;
}

const DENSITY_OPTIONS = ["compact", "regular", "spacious"];
const PAPER_OPTIONS = ["letter", "a4"];
const LANGUAGE_OPTIONS = ["english", "filipino", "bilingual"];

export function FineTunePanel({ settings, onChange }: FineTunePanelProps) {
  const typographyOptions = Object.keys(typographyPairings);
  const accentOptions = Object.keys(palettes);

  const update = (key: keyof PreviewSettings, value: string) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="p-6">
      <div className="text-xs font-mono uppercase tracking-wider text-tala-muted mb-4">
        Fine-tune
      </div>

      <Knob
        label="Typography"
        value={settings.typography}
        options={typographyOptions}
        onChange={(v) => update("typography", v)}
      />
      <Knob
        label="Density"
        value={settings.density}
        options={DENSITY_OPTIONS}
        onChange={(v) => update("density", v)}
      />
      <Knob
        label="Accent"
        value={settings.accent}
        options={accentOptions}
        onChange={(v) => update("accent", v)}
      />
      <Knob
        label="Paper"
        value={settings.paper}
        options={PAPER_OPTIONS}
        onChange={(v) => update("paper", v)}
      />
      <Knob
        label="Language"
        value={settings.language}
        options={LANGUAGE_OPTIONS}
        onChange={(v) => update("language", v)}
      />

      <AtsScoreBox accent={settings.accent} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/fine-tune-panel.tsx
git commit -m "feat(preview): add FineTunePanel with 5 knobs"
```

---

### Task 10: Template Picker

**Files:**
- Create: `src/components/tala/preview/template-picker.tsx`

- [ ] **Step 1: Write component**

```tsx
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
          const isDisabled = t.id !== "editorial";

          return (
            <button
              key={t.id}
              onClick={() => !isDisabled && onChange(t.id)}
              disabled={isDisabled}
              className={cn(
                "text-left rounded-xl border p-3 transition-colors",
                isActive
                  ? "border-tala-ink bg-tala-bg"
                  : "border-tala-rule bg-transparent",
                isDisabled && "opacity-60 cursor-not-allowed"
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
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-tala-surface px-2 py-1 rounded border border-tala-rule">
                      Coming soon
                    </span>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/template-picker.tsx
git commit -m "feat(preview): add TemplatePicker with 4 cards"
```

---

### Task 11: Preview Client

**Files:**
- Create: `src/components/tala/preview/preview-client.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { useState, useMemo } from "react";
import type { ResumeData } from "@/types/preview";
import { defaultPreviewSettings, type PreviewSettings } from "@/types/preview";
import { getFontClasses } from "@/lib/fonts";
import { TemplatePicker } from "./template-picker";
import { TalaResumeDoc } from "./tala-resume-doc";
import { FineTunePanel } from "./fine-tune-panel";

interface PreviewClientProps {
  data: ResumeData;
}

export function PreviewClient({ data }: PreviewClientProps) {
  const [settings, setSettings] = useState<PreviewSettings>(defaultPreviewSettings);

  const fontClasses = useMemo(() => getFontClasses(settings.typography), [settings.typography]);

  const pageWidth = settings.paper === "a4" ? 595 : 612;
  // Mobile scale: fit within viewport minus 32px padding
  const mobileScale = typeof window !== "undefined" ? Math.min(1, (window.innerWidth - 32) / pageWidth) : 1;

  return (
    <div className={fontClasses}>
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
            <TalaResumeDoc data={data} settings={settings} scale={mobileScale} />
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/preview-client.tsx
git commit -m "feat(preview): add PreviewClient with responsive layout"
```

---

### Task 12: Preview Layout

**Files:**
- Create: `src/app/(preview)/layout.tsx`

- [ ] **Step 1: Write layout**

```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TalaLogo } from "@/components/tala/tala-logo";
import { TalaMeta } from "@/components/tala/tala-meta";
import Link from "next/link";

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-tala-bg">
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-tala-rule bg-tala-surface">
        <div className="flex items-center gap-3.5">
          <TalaLogo size="sm" />
          <span className="w-px h-3.5 bg-tala-rule" />
          <TalaMeta>Preview · Editorial</TalaMeta>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/interview"
            className="inline-flex items-center justify-center rounded-lg border border-tala-rule bg-tala-surface px-3 py-1.5 text-sm font-medium text-tala-ink hover:bg-tala-bg transition-colors"
          >
            Back to interview
          </Link>
          <button
            disabled
            className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-3 py-1.5 text-sm font-medium text-tala-surface opacity-50 cursor-not-allowed"
            title="Coming in next update"
          >
            Download PDF
          </button>
        </div>
      </header>

      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(preview\)/layout.tsx
git commit -m "feat(preview): add preview layout with auth guard and header"
```

---

### Task 13: Preview Page (Server)

**Files:**
- Create: `src/app/(preview)/preview/page.tsx`

- [ ] **Step 1: Write page**

```tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { compileResume } from "@/lib/compile-resume";
import { PreviewClient } from "@/components/tala/preview/preview-client";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session: sessionId } = await searchParams;
  const supabase = await createClient();

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null; // layout handles redirect
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, location, linkedin, target_role")
    .eq("id", user.id)
    .single();

  // Get session
  let session = null;
  if (sessionId) {
    const { data: s } = await supabase
      .from("interview_sessions")
      .select("id, jobs, bullets, resume_id")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();
    session = s;
  } else {
    const { data: s } = await supabase
      .from("interview_sessions")
      .select("id, jobs, bullets, resume_id")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    session = s;
  }

  // Get resume analysis
  let analysis = null;
  if (session?.resume_id) {
    const { data: resume } = await supabase
      .from("resumes")
      .select("analysis")
      .eq("id", session.resume_id)
      .eq("user_id", user.id)
      .single();
    if (resume?.analysis) {
      analysis = resume.analysis;
    }
  }

  // Empty state
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <h1 className="text-xl font-semibold text-tala-ink mb-2">
          You haven&apos;t started an interview yet
        </h1>
        <p className="text-sm text-tala-muted mb-6">
          Complete an interview to generate your résumé preview.
        </p>
        <a
          href="/interview"
          className="inline-flex items-center justify-center rounded-lg bg-tala-ink px-4 py-2 text-sm font-medium text-tala-surface hover:opacity-90 transition-opacity"
        >
          Start an interview
        </a>
      </div>
    );
  }

  const resumeData = compileResume(
    profile ?? {
      full_name: null,
      email: null,
      phone: null,
      location: null,
      linkedin: null,
      target_role: null,
    },
    session,
    analysis
  );

  return <PreviewClient data={resumeData} />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(preview\)/preview/page.tsx
git commit -m "feat(preview): add server page with data fetch and compile"
```

---

### Task 14: Barrel Export

**Files:**
- Create: `src/components/tala/preview/index.ts`

- [ ] **Step 1: Write barrel**

```tsx
export { PreviewClient } from "./preview-client";
export { TalaResumeDoc } from "./tala-resume-doc";
export { TemplatePicker } from "./template-picker";
export { FineTunePanel } from "./fine-tune-panel";
export { Knob } from "./knob";
export { AtsScoreBox } from "./ats-score-box";
export { ResumeSection } from "./resume-section";
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/index.ts
git commit -m "feat(preview): add barrel export"
```

---

### Task 15: Integration & Manual Verification

- [ ] **Step 1: Run dev server**

Run: `npm run dev`
Expected: Server starts on localhost:3000.

- [ ] **Step 2: Verify auth guard**

Navigate to `http://localhost:3000/preview` while logged out.
Expected: Redirects to `/login`.

- [ ] **Step 3: Verify empty state**

Log in with a user that has no interview sessions.
Navigate to `/preview`.
Expected: Shows "You haven't started an interview yet" with CTA.

- [ ] **Step 4: Verify preview with data**

Log in with a user that has completed an interview (has session with jobs/bullets).
Navigate to `/preview` or `/preview?session={id}`.
Expected:
- 3-column layout on desktop
- Resume renders with name, contact, experience bullets
- Typography knob changes fonts live
- Density knob changes spacing
- Accent knob changes ATS box background
- Non-editorial templates show "Coming soon"
- Mobile: single column stack, resume scales to fit

- [ ] **Step 5: Run compileResume verification**

Run: `npx tsx scripts/verify-compile-resume.ts`
Expected: All tests pass.

- [ ] **Step 6: Final commit**

```bash
git add scripts/verify-compile-resume.ts
git commit -m "test: add compileResume verification script"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✓ Database migration (phone, location, linkedin) — Task 1
- ✓ Types (ResumeData, PreviewSettings) — Task 2
- ✓ compileResume with fallbacks — Task 3
- ✓ Editorial template — Tasks 4, 5, 6
- ✓ 5 knobs (Typography, Density, Accent, Paper, Language) — Tasks 7, 9
- ✓ Template picker with 4 cards, 3 disabled — Task 10
- ✓ ATS placeholder box — Task 8
- ✓ Preview header bar with disabled Download PDF — Task 12
- ✓ Basic mobile responsive — Task 11
- ✓ Auth guard + empty state — Task 13

**2. Placeholder scan:**
- No TBD, TODO, or vague steps.
- Every file has exact path and complete code.
- Every command has expected output.

**3. Type consistency:**
- `PreviewSettings` uses `TypographyName`, `DensityName`, `PaletteName` from `tokens.ts` — consistent with existing codebase.
- `compileResume` signature matches usage in page.tsx.
- `TalaMeta` style prop added if missing — checked in Task 8.

**4. Gaps:** None identified. All spec requirements map to a task.
