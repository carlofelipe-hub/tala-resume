# Templates, PDF & ATS — Design Spec

Sub-project 2 of Preview & Templates. Covers Phase 3 (template variants), Phase 4 (PDF download), and Phase 5 (ATS score) from PLAN.md.

---

## Goals

- Build 3 additional resume templates (Classic, Modern, Minimal) alongside the existing Editorial.
- Enable PDF download for all 4 templates using `@react-pdf/renderer` with lazy loading.
- Implement client-side heuristic ATS scoring with real-time feedback.

## Non-Goals

- Mobile polish (deferred to sub-project 3)
- Integration with interview/dashboard buttons (deferred to sub-project 3)
- AI-powered ATS analysis (client-side heuristic only)
- Persisting preview settings across sessions

---

## Architecture & Data Flow

**Templates** are new React components in `src/components/tala/preview/templates/`. Each receives `{ data, settings }` and renders a distinct visual layout using inline styles. The existing `getTemplate(name)` factory gains 3 new cases.

**PDF Generation** uses `@react-pdf/renderer`. For each template, a PDF-equivalent component uses `<Document>`, `<Page>`, `<View>`, `<Text>`, and `<Link>`. Font registration happens in `src/lib/pdf/register-fonts.ts`. The `DownloadButton` lazy-loads react-pdf only on click.

**ATS Score** is a pure function `computeAtsScore(data, settings) → { score, insight }` in `src/lib/ats-score.ts`. It recalculates client-side on every settings/data change.

**No changes to data flow** — `compileResume`, `PreviewClient`, and the server page remain untouched. This work is purely additive.

---

## Components & File Structure

```
src/
├── lib/
│   ├── pdf/
│   │   ├── register-fonts.ts           # Font.register() for all 5 pairings
│   │   └── pdf-templates/
│   │       ├── pdf-editorial.tsx       # react-pdf Editorial equivalent
│   │       ├── pdf-classic.tsx         # react-pdf Classic equivalent
│   │       ├── pdf-modern.tsx          # react-pdf Modern equivalent
│   │       └── pdf-minimal.tsx         # react-pdf Minimal equivalent
│   └── ats-score.ts                    # computeAtsScore pure function
├── components/tala/preview/
│   ├── download-button.tsx             # Lazy-loaded PDF download trigger
│   ├── ats-score-box.tsx               # Updated to show live score (was placeholder)
│   └── templates/
│       ├── classic.tsx                 # New: traditional ATS-friendly
│       ├── modern.tsx                  # New: two-column sidebar
│       ├── minimal.tsx                 # New: clean, centered, airy
│       └── index.ts                    # Updated: getTemplate gains 3 cases
```

---

## Template Designs

Each template receives `{ data, settings }` and uses the same `PreviewSettings`. Accent color controls section label color.

### Classic — "Traditional ATS-friendly"

- Single column, full width
- Name: bold sans-serif, 22px, left-aligned
- Contact info: inline row below name (email · phone · location · linkedin), 9.5px, muted
- Horizontal rules (1px solid `#ccc`) separate sections
- Section headers: bold uppercase, 10px, left-aligned, accent-colored
- Experience: role bold 11px, company + dates same line (dates right-aligned), bullets with `•`
- Education: same layout as experience but no bullets
- Skills: comma-separated
- Density affects padding between sections (12px compact / 18px regular / 26px spacious)

### Modern — "Two-column sidebar"

- Two-column: left sidebar 160px, right content 420px (Letter)
- Left sidebar: name (display font, 20px), contact stacked vertically, skills list, education list
- Right content: summary, experience entries
- Sidebar background: subtle accent wash at 30% opacity
- Section labels in sidebar: small uppercase mono
- Section labels in main: bold uppercase, accent-colored
- Experience: role bold, company italic, dates right-aligned, bullets
- Density affects sidebar width and gap between entries

### Minimal — "Clean, airy, centered"

- Centered name: display font, 28px
- Centered contact row: 9.5px, muted, `·` separated
- No horizontal rules
- Extra whitespace: 32px before each section (regular density)
- Section labels: small caps, centered, letter-spacing 3px, accent-colored
- Experience: role centered bold, company + dates centered italic, bullets left-aligned
- Education: centered, no flex layout
- Skills: centered, `·` separated
- Most whitespace-heavy of the four

---

## PDF Generation

### Font Registration

`src/lib/pdf/register-fonts.ts` registers fonts via `Font.register()` using Google Fonts CDN URLs:

| Pairing | Display Font | Body Font | Hand Font |
|---------|-------------|-----------|-----------|
| editorial | Instrument Serif | Geist | — |
| kuwentuhan | DM Serif Display | DM Sans | Caveat |
| pinoy | Fraunces | Newsreader | — |
| retro | Gloock | Space Grotesk | — |
| signpainter | Shrikhand | Plus Jakarta Sans | — |

### PDF Templates

Each PDF template mirrors its HTML equivalent using react-pdf components:
- `<Document>` → `<Page size="LETTER">` or `<Page size="A4">`
- `<View>` for layout containers
- `<Text>` for text content
- `<Link>` for email/LinkedIn

### Download Button

```tsx
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span>Loading PDF...</span> }
);
```

- Lazy-loads react-pdf (~400KB) only on button interaction
- Filename: `{name.replace(/\s+/g, "_")}_resume.pdf`
- Replaces the disabled "Download PDF" button in the preview header bar

### PDF Limitations

- react-pdf uses a flexbox-like layout engine, not CSS. Some details (exact pixel spacing) may differ slightly from HTML preview. Aim for "visually equivalent" rather than "pixel-perfect."

---

## ATS Scoring

### Function Signature

```ts
function computeAtsScore(
  data: ResumeData,
  settings: PreviewSettings
): { score: number; insight: string };
```

### Scoring Breakdown

| Criteria | Max | Calculation |
|----------|-----|-------------|
| Contact completeness | 10 | 2.5 pts each for name, email, phone, location. LinkedIn optional (no penalty if missing). |
| Summary present | 10 | 10 pts if summary.length > 20, 5 pts if any summary, 0 if empty. |
| Experience quality | 30 | Per job: 5 pts for ≥3 bullets, 3 pts for 1-2 bullets. +5 pts if any bullet contains a number (metric). +5 pts if any bullet contains an action verb (Led, Managed, Built, Delivered, Designed, Developed, Improved, Reduced, Increased, Created, Launched, Scaled, Spearheaded, Optimized). |
| Education present | 10 | 10 pts if ≥1 education entry. |
| Skills present | 10 | 10 pts if ≥5 skills, 5 pts if 1-4 skills. |
| Template friendliness | 15 | Classic = 15, Editorial = 12, Minimal = 10, Modern = 8. |
| Keyword variety | 15 | Count unique meaningful words across all bullets. 15 pts for ≥30 unique, scales down proportionally. |

**Total: 100 points**

### Insight Messages

| Score Range | Insight |
|-------------|---------|
| 90–100 | "Excellent ATS parse. Your résumé is well-optimized." |
| 75–89 | "Good parse. Add more metrics or keywords for a higher score." |
| 60–74 | "Fair parse. Consider adding a summary, more bullets, or switching to the Classic template." |
| 40–59 | "Weak parse. Fill in contact info, add experience bullets, and include skills." |
| 0–39 | "Poor parse. Your résumé needs more content before ATS submission." |

### UI Integration

- `AtsScoreBox` displays the score number (display font, 36px) + `/ 100`
- Insight text below
- Updates reactively when `data` or `settings` change
- Accent-wash background uses current palette

---

## Error Handling & Edge Cases

| Scenario | Behavior |
|----------|----------|
| PDF font fails to load | Download button shows error state, fallback to default font |
| Empty resume data | ATS score = 0, insight = "Poor parse..." |
| Template switch | PDF regenerates with selected template |
| Mobile viewport | PDF download still works (lazy-loaded react-pdf handles it) |

---

## Testing Approach

1. **Visual verification** — Manual check that each template renders correctly with sample data
2. **PDF verification** — Download PDF for each template, verify layout and fonts
3. **ATS verification** — Test with sample resumes (full, sparse, empty) to verify score accuracy
4. **TypeScript compilation** — `npx tsc --noEmit` passes
5. **Production build** — `npx next build` succeeds
