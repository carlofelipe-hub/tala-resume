# Mobile-First Responsive Design — Tala Resume Builder

## Context

The Tala interview page is currently built as a fixed desktop-only three-column layout (`grid-cols-[280px_1fr_420px]`) with large fixed padding (`px-20`). It is completely unusable on mobile. Other pages (landing, auth, dashboard, onboarding, upload) already have responsive Tailwind classes but need minor tightening.

## Goals

1. Make the **interview page** fully mobile-responsive with a chat-first mobile experience.
2. Keep the **existing desktop 3-panel layout unchanged** for `lg:` screens and up.
3. Tighten mobile experience across **all other pages** (padding, touch targets, overflow).
4. Use a **single breakpoint strategy** (`lg:`) to keep the system simple.

## Non-Goals

- No native app wrapper or PWA changes.
- No redesign of the desktop layout.
- No new animation libraries or UI dependencies.

## Architecture

### Breakpoint Strategy

| Breakpoint | Interview Layout | Other Pages |
|---|---|---|
| `< lg` (mobile / portrait tablet) | Tabbed 3-panel view | Existing responsive behavior |
| `≥ lg` (desktop / landscape tablet) | 3-column grid `280px_1fr_420px` | Existing responsive behavior |

### Interview State Model

Add a `mobileTab` state to `InterviewClient`:

```ts
type MobileTab = "chat" | "jobs" | "bullets";
const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
```

- On desktop (`lg:` and up), `mobileTab` is ignored — all three panels render.
- On mobile (`< lg`), only the panel matching `mobileTab` renders as a full-screen view.

## Design: Interview Page

### Mobile Layout (< `lg`)

```
┌─────────────────────────────┐
│  Tala    Interview   [menu] │  ← Simplified top bar
├─────────────────────────────┤
│                             │
│      CHAT PANEL             │  ← Full screen, scrollable
│      (or Jobs, or Bullets)  │
│                             │
├─────────────────────────────┤
│  💬 Chat  💼 Jobs  ✨ Bullets│  ← Fixed bottom tab bar (48px)
└─────────────────────────────┘
```

**Top bar (mobile):**
- Show: Logo + "Interview" label
- Hide: completeness progress bar, "Preview résumé", "Export" buttons
- Move Preview/Export to the Bullets tab where they're contextually relevant

**Tab bar (mobile):**
- Fixed to bottom, 48px height
- Icons + text labels
- Active tab: `text-tala-ink` with accent underline indicator
- Inactive tab: `text-tala-muted`
- Tabs: **Chat** | **Jobs** | **Bullets**

**Chat tab:**
- Full-width chat area with `px-4` padding (replaces `px-20`)
- Chat bubbles use `max-w-[85%]` instead of fixed `480px`
- Composer uses `px-4 py-3` padding
- Keyboard opens normally; scroll behavior preserved

**Jobs tab:**
- Renders `InterviewSidebar` without the "Other sections" checklist (that belongs to a future feature)
- Job cards are full-width and tappable
- "Add" button stays at top

**Bullets tab:**
- Renders `RightPanel` as a scrollable full-width column
- Preview / Export buttons appear at the top of this tab

### Desktop Layout (≥ `lg`)

Unchanged from current implementation:
```
┌─────────────────────────────────────────────────────────────┐
│ Top bar with completeness, Preview, Export                  │
├──────────────┬──────────────────────────────┬───────────────┤
│ Sidebar      │ Chat                         │ Right Panel   │
│ (280px)      │ (fluid)                      │ (420px)       │
└──────────────┴──────────────────────────────┴───────────────┘
```

## Design: Global Mobile Fixes

### Interview Components

| Component | Current | Mobile Fix |
|---|---|---|
| `interview-client.tsx` | `grid-cols-[280px_1fr_420px]` | `flex flex-col lg:grid lg:grid-cols-[280px_1fr_420px]` + tab state |
| `interview-top-bar.tsx` | Single row, all items | Wrap/hide on `< lg`; move actions to Bullets tab |
| `chat-composer.tsx` | `px-20` | `px-4 lg:px-20` |
| `chat-bubble.tsx` | `max-w-[480px]` | `max-w-[85%] lg:max-w-[480px]` |

### Other Pages

| Page | Fix |
|---|---|
| `upload-form.tsx` | Drop zone: `p-6 md:p-12` instead of `p-12` |
| `page.tsx` (landing) | CTA buttons already wrap with `flex-wrap`; verify no overflow |
| `(app)/layout.tsx` | Allow nav to wrap on very small screens if needed |
| `layout.tsx` (root) | Verify viewport meta tag is present |

### Touch Targets

- All buttons, tabs, and tappable cards must be at least **44px** tall.
- Job cards, tab bar items, and composer buttons already meet this; verify no regressions.

## Data Flow

No changes to existing data flow. The `mobileTab` state is local UI state only and does not affect:
- Chat messages
- Job list
- Bullets
- Session saving

## Error Handling

- If a user is on the Jobs tab and the last job is deleted, automatically switch to the Chat tab to prevent an empty state.
- If a user switches tabs while Tala is streaming a response, the stream continues uninterrupted.

## Accessibility

- Bottom tabs use `<button>` elements with `aria-selected` for the active tab.
- Tab bar is a `role="tablist"` with `role="tab"` children.
- Focus management: when switching tabs, focus moves to the panel container.

## Testing Checklist

- [ ] Interview renders as tabs on iPhone SE (375px width)
- [ ] Interview renders as 3-panel on 13" MacBook (1280px width)
- [ ] Chat scrolls to bottom when new messages arrive on mobile
- [ ] Composer is usable with on-screen keyboard open
- [ ] Jobs tab allows adding, editing, deleting jobs
- [ ] Bullets tab shows live bullet updates
- [ ] No horizontal scroll on any page at 320px–1440px widths
- [ ] All tap targets ≥ 44px

## Files Changed

1. `src/components/tala/interview/interview-client.tsx`
2. `src/components/tala/interview/interview-top-bar.tsx`
3. `src/components/tala/interview/chat-composer.tsx`
4. `src/components/tala/interview/chat-bubble.tsx`
5. `src/components/tala/interview/mobile-tab-bar.tsx` *(new)*
6. `src/app/(app)/upload/upload-form.tsx`
7. `src/app/layout.tsx` *(viewport verification)*

## Approaches Considered

| Approach | Why Rejected |
|---|---|
| Slide-out drawers (B) | Less discoverable; hidden UI violates mobile-first clarity |
| Bottom sheets (C) | Sheets feel fiddly; two sheets for jobs + bullets is confusing |
| **Bottom tabs (A)** | **Selected** — familiar, discoverable, one-tap access |
