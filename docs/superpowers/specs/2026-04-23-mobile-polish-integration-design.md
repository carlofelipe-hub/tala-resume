# Mobile Polish & Integration — Design Spec

Sub-project 3 of Preview & Templates. Covers Phase 6 (mobile polish) and Phase 7 (integration) from PLAN.md.

---

## Goals

- Polish the mobile preview experience with a compact header, horizontal template thumbnails, and a collapsible knobs accordion.
- Wire the existing "Preview résumé" button from the interview flow to `/preview?session={id}`.
- Add preview links from the dashboard resume cards.

## Non-Goals

- Bottom sheet or floating action button (out of scope)
- Pinch-to-zoom on mobile resume
- Dashboard session-to-resume mapping (link to `/preview` latest session)

---

## Architecture & Data Flow

**Mobile Layout Changes:**

The `PreviewClient` component gains mobile-specific sub-components:

1. **Top bar** — TalaMeta showing current template name + Download button
2. **Resume viewport** — Centered, scaled resume (current behavior, better framing)
3. **Template thumbnails** — Horizontal-scroll compact cards
4. **Knobs accordion** — Collapsible section for fine-tune controls

**Desktop stays unchanged** — the existing 3-column grid works fine.

**Integration Points:**

1. **Interview client** — "Preview résumé" button links to `/preview?session={sessionId}`
2. **Dashboard** — ResumeCard gets a "Preview résumé" link to `/preview`
3. **Middleware** — `/preview` already protected ✅

**No new data flow** — all integration is navigation/links.

---

## Components & File Structure

```
src/
├── components/tala/preview/
│   ├── mobile-preview-header.tsx     # Mobile top bar (template name + download)
│   ├── mobile-template-strip.tsx     # Horizontal-scroll template thumbnails
│   ├── knobs-accordion.tsx           # Collapsible fine-tune knobs
│   └── preview-client.tsx            # Modified to include mobile layout
├── components/tala/interview/
│   └── interview-client.tsx          # Modified: wire Preview résumé button
├── app/(app)/dashboard/
│   └── resume-card.tsx               # Modified: add Preview link
```

---

## Mobile Layout Specification

### Top Bar (`<MobilePreviewHeader />`)

- Fixed height, `border-b border-tala-rule`, `bg-tala-surface`
- Left: TalaMeta text `Preview · {template}` (capitalize first letter)
- Right: `<DownloadButton data={data} settings={settings} />`
- Only visible on mobile: `lg:hidden`

### Resume Viewport

- Keeps current scaling behavior (`scale` state from `useEffect`)
- Wrapped in container with `overflow-auto` and `bg-tala-bg`
- Desktop shadow container hidden on mobile
- `min-h-[50vh]` to ensure tappable/scrollable area

### Template Thumbnails (`<MobileTemplateStrip />`)

- Horizontal scroll: `overflow-x-auto flex gap-2 px-4 py-3`
- Each thumbnail: 68px × 90px compact card
- Template name below: 10px text
- Active: `border-tala-ink`
- Inactive: `border-tala-rule`
- Reuses `TemplatePicker`'s `onChange` callback

### Knobs Accordion

- Toggle button: "Fine-tune ▼" / "Fine-tune ▲"
- Collapsed: only toggle button visible
- Expanded: all 5 knobs in stacked layout
- Simple `useState` for open/closed
- Background: `bg-tala-surface`, `border-t border-tala-rule`

---

## Integration Specification

### Interview → Preview

In `src/components/tala/interview/interview-client.tsx`, the "Preview résumé" button becomes a link:

```tsx
<a
  href={`/preview?session=${sessionId}`}
  className="text-xs font-medium text-tala-muted hover:text-tala-ink transition-colors"
>
  Preview résumé
</a>
```

`sessionId` is already available in the component state.

### Dashboard → Preview

In the dashboard `ResumeCard` component, add a preview link:

```tsx
<a
  href="/preview"
  className="text-xs font-medium text-tala-accent hover:underline"
>
  Preview résumé
</a>
```

Links to `/preview` (latest session) since resumes don't have a direct `session_id` column.

### Middleware

`/preview` is already in `protectedPaths` in `src/lib/supabase/middleware.ts`. No changes needed.

---

## Error Handling & Edge Cases

| Scenario | Behavior |
|----------|----------|
| Interview session ID is null | Button hidden or disabled |
| No interview sessions exist | `/preview` shows empty state (already handled) |
| Mobile viewport < 375px | Layout still works, thumbnails smaller |
| Knobs accordion on desktop | Hidden, desktop uses full FineTunePanel |

---

## Testing Approach

1. **Mobile viewport** — DevTools at 375px: verify top bar, thumbnails scroll, accordion toggles
2. **Interview integration** — Click "Preview résumé" → lands on `/preview?session={id}`
3. **Dashboard integration** — Click "Preview résumé" from resume card → lands on `/preview`
4. **Auth** — `/preview` still redirects unauthenticated users
5. **TypeScript + build** — Zero errors, all routes compile
