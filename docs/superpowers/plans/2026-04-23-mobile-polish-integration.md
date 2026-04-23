# Mobile Polish & Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish mobile preview UX and wire navigation from interview/dashboard to preview.

**Architecture:** Add mobile-specific sub-components to PreviewClient. Update interview client and dashboard resume card with navigation links.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4.

---

## File Structure

| File | Responsibility |
|------|--------------|
| `src/components/tala/preview/mobile-preview-header.tsx` | Mobile top bar |
| `src/components/tala/preview/mobile-template-strip.tsx` | Horizontal template thumbnails |
| `src/components/tala/preview/knobs-accordion.tsx` | Collapsible fine-tune knobs |
| `src/components/tala/preview/preview-client.tsx` | Updated with mobile layout |
| `src/components/tala/interview/interview-client.tsx` | Wire Preview résumé button |
| `src/app/(app)/dashboard/resume-card.tsx` | Add Preview link |

---

### Task 1: Mobile Preview Header

**Files:**
- Create: `src/components/tala/preview/mobile-preview-header.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { TalaMeta } from "@/components/tala/tala-meta";
import { DownloadButton } from "./download-button";
import type { ResumeData, PreviewSettings } from "@/types/preview";

interface MobilePreviewHeaderProps {
  data: ResumeData;
  settings: PreviewSettings;
}

export function MobilePreviewHeader({ data, settings }: MobilePreviewHeaderProps) {
  const templateLabel = settings.template.charAt(0).toUpperCase() + settings.template.slice(1);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-tala-rule bg-tala-surface lg:hidden">
      <TalaMeta>Preview · {templateLabel}</TalaMeta>
      <DownloadButton data={data} settings={settings} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/mobile-preview-header.tsx
git commit -m "feat(preview): add mobile preview header"
```

---

### Task 2: Mobile Template Strip

**Files:**
- Create: `src/components/tala/preview/mobile-template-strip.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { cn } from "@/lib/utils";
import type { TemplateName } from "@/types/preview";

const TEMPLATES: { id: TemplateName; name: string }[] = [
  { id: "editorial", name: "Editorial" },
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "minimal", name: "Minimal" },
];

interface MobileTemplateStripProps {
  value: TemplateName;
  onChange: (template: TemplateName) => void;
}

export function MobileTemplateStrip({ value, onChange }: MobileTemplateStripProps) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto border-t border-tala-rule bg-tala-surface lg:hidden">
      {TEMPLATES.map((t) => {
        const isActive = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors",
              isActive
                ? "border-tala-ink bg-tala-bg"
                : "border-tala-rule bg-transparent"
            )}
          >
            <div className="w-[68px] h-[90px] bg-white border border-tala-rule rounded-sm overflow-hidden relative">
              {/* Simple wireframe */}
              <div className="absolute inset-2">
                <div className="h-2 w-3/4 bg-gray-200 rounded mb-1" />
                <div className="h-1.5 w-1/2 bg-gray-100 rounded mb-2" />
                <div className="h-1 w-8 bg-gray-200 rounded mb-0.5" />
                <div className="h-1 w-full bg-gray-100 rounded mb-0.5" />
                <div className="h-1 w-4/5 bg-gray-100 rounded" />
              </div>
            </div>
            <span className="text-[10px] font-medium text-tala-ink">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/mobile-template-strip.tsx
git commit -m "feat(preview): add mobile template strip"
```

---

### Task 3: Knobs Accordion

**Files:**
- Create: `src/components/tala/preview/knobs-accordion.tsx`

- [ ] **Step 1: Write component**

```tsx
"use client";

import { useState } from "react";
import { FineTunePanel } from "./fine-tune-panel";
import type { ResumeData, PreviewSettings } from "@/types/preview";

interface KnobsAccordionProps {
  data: ResumeData;
  settings: PreviewSettings;
  onChange: (settings: PreviewSettings) => void;
}

export function KnobsAccordion({ data, settings, onChange }: KnobsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-tala-rule bg-tala-surface lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-mono uppercase tracking-wider text-tala-muted hover:text-tala-ink transition-colors"
      >
        <span>Fine-tune</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <FineTunePanel data={data} settings={settings} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tala/preview/knobs-accordion.tsx
git commit -m "feat(preview): add knobs accordion for mobile"
```

---

### Task 4: Update PreviewClient

**Files:**
- Modify: `src/components/tala/preview/preview-client.tsx`

- [ ] **Step 1: Import new components**

```tsx
import { MobilePreviewHeader } from "./mobile-preview-header";
import { MobileTemplateStrip } from "./mobile-template-strip";
import { KnobsAccordion } from "./knobs-accordion";
```

- [ ] **Step 2: Restructure layout**

Replace the current layout with:

```tsx
<div className={fontClasses}>
  {/* Mobile header */}
  <MobilePreviewHeader data={data} settings={settings} />

  {/* Desktop: 3-column grid */}
  <div className="hidden lg:grid lg:grid-cols-[280px_1fr_320px] min-h-[calc(100vh-64px)]">
    {/* Left: Template picker */}
    <div className="border-r border-tala-rule bg-tala-surface overflow-auto">
      <TemplatePicker value={settings.template} onChange={(t) => setSettings({ ...settings, template: t })} />
    </div>

    {/* Center: Resume document */}
    <div className="overflow-auto p-10 flex justify-center bg-tala-bg">
      <div className="shadow-[0_20px_60px_-12px_rgba(30,20,10,0.15),0_4px_12px_rgba(30,20,10,0.06)]">
        <TalaResumeDoc data={data} settings={settings} scale={1} />
      </div>
    </div>

    {/* Right: Fine-tune panel */}
    <div className="border-l border-tala-rule bg-tala-surface overflow-auto">
      <FineTunePanel data={data} settings={settings} onChange={setSettings} />
    </div>
  </div>

  {/* Mobile: single column */}
  <div className="lg:hidden">
    {/* Resume */}
    <div className="overflow-auto p-4 flex justify-center bg-tala-bg min-h-[50vh]">
      <TalaResumeDoc data={data} settings={settings} scale={scale} />
    </div>

    {/* Template strip */}
    <MobileTemplateStrip value={settings.template} onChange={(t) => setSettings({ ...settings, template: t })} />

    {/* Knobs accordion */}
    <KnobsAccordion data={data} settings={settings} onChange={setSettings} />
  </div>
</div>
```

- [ ] **Step 3: Remove old top bar**

Remove the existing download button top bar that was added in Task 12:
```tsx
{/* Top bar with download button */}
<div className="flex items-center justify-end px-6 py-3 border-b border-tala-rule bg-tala-surface">
  <DownloadButton data={data} settings={settings} />
</div>
```

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add src/components/tala/preview/preview-client.tsx
git commit -m "feat(preview): add mobile layout with header, strip, and accordion"
```

---

### Task 5: Wire Interview Preview Button

**Files:**
- Modify: `src/components/tala/interview/interview-client.tsx`

- [ ] **Step 1: Find and update Preview résumé button**

Locate the button (around line 499). It currently looks like:

```tsx
<button className="text-xs font-medium text-tala-muted hover:text-tala-ink transition-colors bg-transparent border-none cursor-pointer">
  Preview résumé
</button>
```

Replace with:

```tsx
<a
  href={`/preview?session=${sessionId}`}
  className="text-xs font-medium text-tala-muted hover:text-tala-ink transition-colors"
>
  Preview résumé
</a>
```

Make sure `sessionId` is in scope. It should be available from the component state.

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/tala/interview/interview-client.tsx
git commit -m "feat(integration): wire interview Preview résumé button"
```

---

### Task 6: Dashboard Resume Card Preview Link

**Files:**
- Modify: `src/app/(app)/dashboard/resume-card.tsx`

- [ ] **Step 1: Read current ResumeCard**

Read the file first to understand its structure.

- [ ] **Step 2: Add preview link**

Add a link to `/preview` near the card actions:

```tsx
<a
  href="/preview"
  className="text-xs font-medium text-tala-accent hover:underline"
>
  Preview résumé
</a>
```

Place it alongside existing actions (view, download, delete, etc.).

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/app/\(app\)/dashboard/resume-card.tsx
git commit -m "feat(integration): add preview link to dashboard resume card"
```

---

### Task 7: Integration & Verification

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: Zero errors.

- [ ] **Step 2: Production build**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 3: Manual verification**

1. Open `/preview` on mobile viewport (375px)
   - Top bar shows "Preview · Editorial" + Download button
   - Resume scales to fit
   - Template thumbnails scroll horizontally
   - Knobs accordion expands/collapses
2. Open `/preview` on desktop (1024px+)
   - 3-column layout unchanged
3. Navigate to `/interview`, click "Preview résumé" → lands on `/preview?session={id}`
4. Navigate to `/dashboard`, click "Preview résumé" on a card → lands on `/preview`
5. Log out, try `/preview` → redirects to `/login`

- [ ] **Step 4: Final commit**

```bash
git commit --allow-empty -m "chore: complete sub-project 3 - mobile polish & integration"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✓ Mobile header — Task 1
- ✓ Template strip — Task 2
- ✓ Knobs accordion — Task 3
- ✓ PreviewClient mobile layout — Task 4
- ✓ Interview integration — Task 5
- ✓ Dashboard integration — Task 6

**2. Placeholder scan:** No TBD/TODO.

**3. Type consistency:** Props match across components.

**4. Gaps:** None.
