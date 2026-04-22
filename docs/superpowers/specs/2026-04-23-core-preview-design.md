# Core Preview — Design Spec

Sub-project 1 of Preview & Templates. Covers Phases 0–2 from PLAN.md: data compilation, editorial template resume renderer, and preview page layout.

---

## Goals

- Define the resume data shape and the function that bridges interview data → resume.
- Build one working resume template (Editorial) that renders from compiled data.
- Build the preview page shell with template picker, fine-tune knobs, and placeholder UI for deferred features.
- Ensure basic mobile responsiveness from day one.

## Non-Goals

- Additional template variants (classic, modern, minimal) — deferred to sub-project 2.
- PDF download — deferred to sub-project 2.
- ATS scoring algorithm — deferred to sub-project 2.
- Editable resume content — deferred to future work.
- Persisting preview settings across sessions.

---

## Architecture & Data Flow

**Route:** `GET /preview?session={id}`

The `session` query param is optional. If provided, we fetch that specific interview session. If omitted, we fetch the user's most recent session by `updated_at`.

### Server-side (`page.tsx`)

1. Auth guard via Supabase server client (same pattern as `(app)/layout.tsx`).
2. Fetch `profiles` row for contact info (`full_name`, `email`, `phone`, `location`, `linkedin`).
3. Fetch interview session by ID (or latest by `updated_at`).
4. Fetch the associated `resumes` record for `analysis` JSON.
5. Call `compileResume(profile, session, analysis)` → `ResumeData`.
6. Pass `ResumeData` + default `PreviewSettings` to client component.

### Client-side (`preview-client.tsx`)

- Holds `PreviewSettings` state (Typography, Density, Accent, Paper, Language).
- Renders 3-column layout on desktop (`lg:grid-cols-[280px_1fr_320px]`), single-column stack on mobile.
- Settings changes are purely local React state — preview updates instantly.
- No persistence of settings yet.

### `compileResume` Logic

| Field | Source | Fallback |
|-------|--------|----------|
| name | `profiles.full_name` | `""` |
| email | `profiles.email` | `""` |
| phone | `profiles.phone` | `""` |
| location | `profiles.location` | `""` |
| linkedin | `profiles.linkedin` | `undefined` |
| title | `profiles.target_role` | First job's role |
| summary | `resumeAnalysis.summary` | `""` |
| experience | `InterviewJob[]` + `BulletDraft[]` | `resumeAnalysis.experiences[].description` wrapped as single bullet |
| education | `resumeAnalysis` (parsed) | `[]` |
| skills | `resumeAnalysis` (parsed) | `[]` |

The function is pure and handles missing data gracefully (empty arrays, empty strings, null analysis).

---

## Components & File Structure

```
src/
├── types/
│   └── preview.ts                    # ResumeData, PreviewSettings, TemplateName, etc.
├── lib/
│   └── compile-resume.ts             # Pure function: profile + session + analysis → ResumeData
├── app/
│   └── (preview)/
│       ├── layout.tsx                # Auth guard + preview header bar
│       └── preview/
│           └── page.tsx              # Server component: fetch data, compile, pass to client
└── components/tala/preview/
    ├── index.ts                      # Barrel export
    ├── preview-client.tsx            # 3-col desktop / 1-col mobile layout, settings state
    ├── tala-resume-doc.tsx           # 612px resume document, receives data + settings
    ├── resume-section.tsx            # Reusable section label (mono, 8.5px, uppercase)
    ├── template-picker.tsx           # 4 template cards, 0.32x mini-previews
    ├── fine-tune-panel.tsx           # 5 knob rows + ATS placeholder card
    ├── knob.tsx                      # Label + dropdown selector
    ├── ats-score-box.tsx             # Accent-wash card, static placeholder for now
    └── templates/
        ├── index.ts                  # getTemplate(name) factory
        └── editorial.tsx             # Serif header, monospace labels (default)
```

### Component Hierarchy

```
PreviewPage (server)
└── PreviewClient (client)
    ├── TemplatePicker (left col)
    ├── TalaResumeDoc (center)
    │   └── EditorialTemplate
    │       └── ResumeSection
    └── FineTunePanel (right col)
        ├── Knob × 5
        └── AtsScoreBox
```

---

## Types

### `ResumeData`

```ts
interface ResumeData {
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

interface ResumeExperienceEntry {
  role: string;
  company: string;
  location?: string;
  dates: string;
  bullets: string[];
}

interface ResumeEducationEntry {
  school: string;
  degree: string;
  dates: string;
}
```

### `PreviewSettings`

```ts
interface PreviewSettings {
  template: TemplateName;       // "editorial" | "classic" | "modern" | "minimal"
  typography: TypographyName;   // from tokens.ts
  density: DensityName;         // "compact" | "regular" | "spacious"
  accent: PaletteName;          // from tokens.ts
  paper: PaperName;             // "letter" | "a4"
  language: LanguageName;       // "english" | "filipino" | "bilingual"
}

type TemplateName = "editorial" | "classic" | "modern" | "minimal";
type PaperName = "letter" | "a4";
type LanguageName = "english" | "filipino" | "bilingual";
```

Default settings:
```ts
const defaultPreviewSettings: PreviewSettings = {
  template: "editorial",
  typography: "editorial",
  density: "regular",
  accent: "sun-gold",
  paper: "letter",
  language: "english",
};
```

---

## Database Changes

**Migration:** `supabase/migrations/00009_add_profile_contact_fields.sql`

```sql
alter table public.profiles
  add column phone text,
  add column location text,
  add column linkedin text;
```

No RLS policy changes needed — existing "Users can read/update own profile" policies cover these columns.

Existing users will have `NULL` for these fields until they update their profile. `compileResume` treats `NULL` as empty string.

---

## UI Specification

### Preview Header Bar (`(preview)/layout.tsx`)

- Left: TalaLogo + vertical rule + TalaMeta text "Preview · {template_name}"
- Right:
  - "Back to interview" button (secondary, sm) → links to `/interview?session={id}`
  - "Download PDF" button (primary, sm, disabled) — shows tooltip "Coming in next update" on hover

### Template Picker (Left Column)

- TalaMeta header: "Templates · 4"
- 4 cards stacked vertically, gap-3:
  - **Editorial** — selectable, active state with border + background
  - **Classic** — disabled, opacity-60, "Coming soon" badge
  - **Modern** — disabled, opacity-60, "Coming soon" badge
  - **Minimal** — disabled, opacity-60, "Coming soon" badge
- Each card: 0.32x mini-preview (wireframe placeholder for non-editorial), name, subtitle
- Mini-preview for Editorial renders actual `TalaResumeDoc` with sample data at 0.32 scale

### Resume Document (Center)

- Rendered at natural 612px width (Letter) or 595px (A4)
- Wrapped in shadow container
- Desktop: `scale={1}` inside scrollable area with generous padding
- Mobile: `scale` prop calculated as `Math.min(1, (viewportWidth - 32) / 612)` so the resume fits with 16px padding on each side
- Editorial template styling matches reference exactly:
  - 48px top/bottom padding, 52px left/right
  - Header: flex space-between, name in display font 32px, contact in mono 9px
  - Sections: 18px margin-top, label in mono 8.5px uppercase letter-spacing 2
  - Density multiplier affects padding and line-height
  - Accent color controls section label color

### Fine-Tune Panel (Right Column)

- TalaMeta header: "Fine-tune"
- 5 knobs (label + dropdown):
  1. **Typography** — editorial | kuwentuhan | pinoy | retro | signpainter
  2. **Density** — compact | regular | spacious
  3. **Accent** — sun-gold | calamansi | sampaguita | terracotta
  4. **Paper** — letter | a4
  5. **Language** — english | filipino | bilingual
- Below knobs: ATS Score placeholder card
  - Accent-wash background (`accentWash` from palette)
  - TalaMeta header: "ATS Score"
  - Body text: "Coming in next update"
  - No score number displayed

### Mobile Layout

- Single column stack:
  1. Preview header bar
  2. Resume document (scaled to fit, horizontally scrollable if needed)
  3. Fine-tune knobs (in a scrollable container or accordion)
  4. Template picker (horizontal scroll thumbnails)
- Template thumbnails: 68×90px wireframe placeholders, horizontal scroll
- Fine-tune panel: collapsible/accordion on mobile to save space

---

## Error Handling & Edge Cases

| Scenario | Behavior |
|----------|----------|
| No interview session | Empty state: "You haven't started an interview yet" with CTA to `/interview` |
| Session exists, no bullets | Resume renders with empty bullet lists. Fallback to `resumeAnalysis.experiences[].description` if available. |
| No resume uploaded (`analysis` is null) | `compileResume` handles null gracefully. Summary/education/skills empty. |
| Missing profile fields | Empty strings in `ResumeData`. Resume renders without them. |
| Invalid `session` query param | 404: "Session not found" with link back to dashboard. |
| Unauthenticated | Redirect to `/login` (handled by layout auth guard). |

---

## Testing Approach

1. **`compileResume` unit tests** — Pure function, highest value to test:
   - Full data merge
   - Missing analysis fallback
   - Missing bullets fallback
   - Null/empty session handling

2. **Visual smoke tests** — Manual verification:
   - `/preview` authenticated → 3-column layout
   - Typography knob → font changes live
   - Density knob → spacing changes live
   - Non-working templates show "Coming soon"
   - Mobile viewport → stacked layout

3. **No new test infrastructure** — The project has no existing test setup. Adding Vitest/Jest is out of scope for this sub-project.

---

## Integration Points (for Sub-Project 3)

- Interview "Preview résumé" button → `/preview?session={id}`
- Dashboard completed resumes → `/preview?session={id}`
- `/preview` route added to protected routes in middleware if not already covered by auth

---

## Deferred to Future Work

- Template variants: classic, modern, minimal
- PDF generation via `@react-pdf/renderer`
- ATS scoring algorithm
- Editable resume content (inline editing of summary, bullets, etc.)
- Persisting preview settings
- Mobile polish: bottom sheet for knobs, refined thumbnail scaling
