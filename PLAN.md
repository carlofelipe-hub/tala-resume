# Preview & Templates — Implementation Plan

## Context

The interview flow mines jobs and bullets, but there's no way to see the result as an actual resume. The Preview page is the bridge — it compiles interview data into a live, editable resume document with template selection, fine-tune knobs, ATS scoring, and PDF download.

---

## Phase 0: Types & Data Compilation

**Goal:** Define the resume data shape and the function that bridges interview → resume.

**Create:**
- `src/types/preview.ts` — `ResumeData`, `PreviewSettings`, template/font/density/accent/paper/language type unions
- `src/lib/compile-resume.ts` — Pure function `compileResume(profile, jobs, bullets, analysis) → ResumeData`
  - Maps `InterviewJob[]` + `BulletDraft[]` → experience entries
  - Pulls contact info from profile + resume analysis
  - Fills education/skills from analysis if available

**Key types:**
```
ResumeData: { name, title, email, phone, location, linkedin?, summary, experience[], education[], skills[] }
PreviewSettings: { template, displayFont, bodyFont, density, accent, paper, language }
```

**Verify:** Function handles missing data gracefully (empty arrays, placeholder strings).

---

## Phase 1: TalaResumeDoc Component

**Goal:** HTML/CSS resume renderer matching the design reference exactly.

**Create:**
- `src/components/tala/preview/tala-resume-doc.tsx` — 612px wide US Letter doc
  - Props: `data`, `settings`, `scale?`, `highlight?`
  - Sections: Header (name + contact), Summary, Experience (per-job bullets), Education, Skills
  - Inline styles (pixel-precise, maps 1:1 to eventual PDF)
  - Density multiplier affects margins/padding/line-height
  - Accent setting controls section label color
- `src/components/tala/preview/resume-section.tsx` — Reusable section label (monospace, 8.5px, uppercase)

**Reference:** `/tmp/project-resume-builder/project/resume-doc.jsx` for exact styling values.

---

## Phase 2: Preview Page + Layout

**Goal:** Full preview page with 3-column desktop / single-column mobile.

Since `(app)/layout.tsx` has nav + padding that preview doesn't want, use a separate route group `(preview)`.

**Create:**
- `src/app/(preview)/layout.tsx` — Auth guard + preview header bar (TalaLogo + TalaMeta + "Back to interview" + "Download PDF")
- `src/app/(preview)/preview/page.tsx` — Server component, fetches profile + latest session + resume analysis, calls `compileResume()`, passes to client
- `src/components/tala/preview/preview-client.tsx` — Client component managing all state:
  - `grid grid-cols-1 lg:grid-cols-[280px_1fr_320px]`
  - Left: TemplatePicker, Center: scaled TalaResumeDoc, Right: FineTunePanel + ATS
- `src/components/tala/preview/template-picker.tsx` — 4 template cards with 0.32x mini-previews
- `src/components/tala/preview/fine-tune-panel.tsx` — 6 knob dropdowns + ATS score box
- `src/components/tala/preview/knob.tsx` — Reusable label + dropdown selector
- `src/components/tala/preview/ats-score-box.tsx` — Accent-wash card with score + insight
- `src/components/tala/preview/index.ts` — Barrel export

**Reuse:** Auth guard pattern from `src/app/(app)/layout.tsx`, Supabase server client from `src/lib/supabase/server.ts`.

---

## Phase 3: Template Variants

**Goal:** 4 visually distinct templates sharing the same `ResumeData`.

**Create:**
- `src/components/tala/preview/templates/editorial.tsx` — Serif header, monospace labels (default, matches design ref)
- `src/components/tala/preview/templates/classic.tsx` — Traditional ATS-friendly, sans-serif, bold headers + rules
- `src/components/tala/preview/templates/modern.tsx` — Two-column sidebar layout
- `src/components/tala/preview/templates/minimal.tsx` — Clean sans-serif, extra whitespace, centered name
- `src/components/tala/preview/templates/index.ts` — `getTemplate(name)` factory

Each receives: `{ data, settings (minus template), highlight? }`.

---

## Phase 4: PDF Download

**Goal:** Generate downloadable PDF matching on-screen preview.

**Install:** `@react-pdf/renderer`

**Create:**
- `src/lib/pdf/register-fonts.ts` — `Font.register()` calls for each display/body font
- `src/lib/pdf/pdf-resume-doc.tsx` — react-pdf `<Document>` using `<Page>`, `<View>`, `<Text>` matching editorial layout
- `src/components/tala/preview/download-button.tsx` — Dynamic import of react-pdf, generates blob on click, triggers download

**Mitigation:** Lazy-load react-pdf (~400KB) only on download click to keep initial bundle small.

---

## Phase 5: ATS Score

**Goal:** Client-side heuristic ATS score.

**Create:**
- `src/lib/ats-score.ts` — `computeAtsScore(data, settings) → { score: number; insight: string }`
  - Contact completeness (10pts), Summary (10pts), Experience quality (30pts), Education (10pts), Skills (10pts), Template friendliness (15pts), Keyword variety (15pts)

Score updates reactively when data or settings change.

---

## Phase 6: Mobile Polish

- Mobile top bar: TalaMeta "Preview · {template}" + Download button (sm)
- Resume at 0.58x scale inside overflow container
- Bottom horizontal-scroll template thumbnails (68x90px wireframe placeholders)
- Fine-tune knobs via expandable accordion or bottom sheet

---

## Phase 7: Integration

**Modify:**
- `src/components/tala/interview/interview-client.tsx` — Wire "Preview resume" button → `/preview?session={id}`
- `src/app/(app)/dashboard/page.tsx` — Link completed resumes → `/preview?session={id}`
- `src/lib/supabase/middleware.ts` — Add `/preview` to protected routes if not already covered

---

## Execution Order

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 + Phase 4 + Phase 5 (parallel) → Phase 6 → Phase 7
```

## Key Files to Reference

| File | Purpose |
|------|---------|
| `src/types/interview.ts` | InterviewJob, BulletDraft shapes |
| `src/types/resume.ts` | ResumeAnalysis shape |
| `src/app/(app)/layout.tsx` | Auth guard pattern to replicate |
| `src/lib/tokens.ts` | Design token values (palettes, fonts, density) |
| `src/components/tala/interview/interview-client.tsx` | Jobs/bullets state, navigation point |
| `/tmp/project-resume-builder/project/resume-doc.jsx` | Exact resume document styling reference |
| `/tmp/project-resume-builder/project/screens-desk-b.jsx` | Desktop preview layout reference |
| `/tmp/project-resume-builder/project/screens-mobile.jsx` | Mobile preview layout reference |

## Verification Checklist

- [ ] Navigate to `/preview` while authenticated → 3-column layout with resume
- [ ] Switch templates → resume appearance changes
- [ ] Adjust knobs → font/density/accent updates live
- [ ] ATS score reflects content completeness
- [ ] "Download PDF" → produces a matching PDF file
- [ ] Mobile viewport → stacked layout with scrollable thumbnails
- [ ] "Back to interview" → returns to interview page
- [ ] Interview "Preview resume" button → lands on preview with correct data
