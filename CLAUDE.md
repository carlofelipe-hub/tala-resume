# Tala Resume — Project Guide

## Project Overview

**Tala** (Tagalog for "star" / "record") is a Filipino-themed AI resume builder/coach. The core differentiator is conversational resume creation via "Achievement Mining" — instead of blank forms, an AI interviews users kuwentuhan-style (casual conversation) to extract wins they'd forget to mention.

### Target Audience

- Filipino job seekers (fresh grads, career switchers, OFWs)
- Bilingual EN/FIL support

### Key Flows

1. **Landing** — Hero with Tagalog microcopy, resume preview card, chat bubble overlay
2. **Onboarding** — 3-4 questions to shape the interview (goal, experience, role, language)
3. **Upload** — Analyze existing resume, surface findings (major/minor/positive)
4. **Interview (HERO)** — Chat with Tala, job timeline on left, live bullet building on right, mining checklist
5. **Preview & Templates** — Live document, fine-tune knobs, ATS score
6. **AI Suggestions / Diff** — Side-by-side before/after edits (rewrite, add, trim, verb swap)
7. **Dashboard** — Saved resumes, stats, progress tracking

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + Node.js (monorepo, no separate backend)
- **AI Layer**: OpenAI GPT-4o (with JSON mode) — swappable to Claude later
- **Resume Parsing**: unpdf (TypeScript-first, serverless/edge-compatible, UnJS ecosystem)
- **Database**: PostgreSQL + Prisma (via Supabase)
- **File Storage**: Supabase Storage
- **Auth**: Supabase Auth (Google OAuth + magic link)
- **Resume Export**: react-pdf
- **Payments**: Stripe (subscriptions + one-time credits)

## Design System — Tala Tokens

### Palettes

- **Sun Gold** (default): warm paper bg, sun-gold accent from PH flag — `oklch(0.78 0.14 75)`
- **Calamansi**: green accent — `oklch(0.72 0.16 135)`
- **Sampaguita**: deep indigo accent — `oklch(0.55 0.14 265)`
- **Terracotta**: terracotta accent — `oklch(0.60 0.15 40)`

### CSS Variables (set via tokens)

```
--bg, --surface, --ink, --muted, --faint, --rule
--accent, --accent-ink, --accent-wash
--font-display, --font-body, --font-mono, --font-accent
--display-italic, --display-tracking
--motif-pattern, --density-scale, --density-pad
```

### Typography Pairings

- **Editorial**: Instrument Serif + Geist + JetBrains Mono
- **Kuwentuhan** (default): DM Serif Display + Caveat + DM Sans
- **Pinoy editorial**: Fraunces + Newsreader
- **Retro-modern**: Gloock + Space Grotesk
- **Signpainter**: Shrikhand + Plus Jakarta Sans

### Filipino Cultural Cues (keep subtle)

- 8-rayed Philippine sun glyph (recurring mark)
- Tagalog microcopy ("Tara na", "Kumusta", "Salamat", "para matuloy", "walang pressure")
- EN / FIL language toggle
- NO jeepney patterns, NO flag stripes, NO purple gradients, NO AI slop gradients

### Motif Intensity Levels

- None / Subtle / Medium / Rich

### Density

- Airy (scale: 1.15) / Regular (scale: 1) / Compact (scale: 0.9)

### UI Principles

- Modern minimal editorial aesthetic
- Thin 1px borders, generous whitespace
- Monospace for metadata/timestamps (editorial feel)
- No shadows heavier than a hairline (except card shadows)
- Pill-shaped buttons (border-radius: 999)
- 14px rounded cards (border-radius: 14)

## Monorepo Structure

```
tala-resume/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing page
│   │   ├── (auth)/             # Auth routes
│   │   ├── (app)/              # Authenticated app routes
│   │   │   ├── dashboard/
│   │   │   ├── interview/
│   │   │   ├── preview/
│   │   │   ├── suggestions/
│   │   │   └── upload/
│   │   └── api/                # API routes
│   │       ├── ai/
│   │       ├── auth/
│   │       ├── resume/
│   │       └── webhooks/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── tala/               # Tala-specific components
│   │       ├── tala-logo.tsx
│   │       ├── tala-button.tsx
│   │       ├── tala-chip.tsx
│   │       ├── tala-meta.tsx
│   │       ├── tala-progress.tsx
│   │       ├── tala-avatar.tsx
│   │       ├── tala-input.tsx
│   │       ├── tala-sun.tsx
│   │       ├── tala-section-head.tsx
│   │       └── tala-resume-doc.tsx
│   ├── lib/
│   │   ├── tokens.ts           # Design token definitions
│   │   ├── fonts.ts            # Google Fonts config
│   │   ├── supabase/
│   │   ├── stripe/
│   │   └── ai/
│   ├── hooks/
│   └── types/
├── prisma/
│   └── schema.prisma
├── public/
├── CHANGES/
│   └── CHANGES.md
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Conventions

- Use `cn()` utility from shadcn for conditional classnames
- All Tala components go in `src/components/tala/`
- CSS variables for theming — Tailwind extended with Tala tokens
- Server components by default; `"use client"` only when needed
- Streaming for AI responses (stream: true)
- All colors via CSS variables, never hardcoded
- Fonts loaded via next/font/google

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Push Prisma schema
npm run db:generate  # Generate Prisma client
```

## Design Reference Files

The original design prototypes are in `/tmp/project-resume-builder/project/`. Key files:

- `Tala.html` — Main design canvas with all screens
- `tokens.js` — Design token definitions (palettes, typography, density, motifs)
- `components.jsx` — Shared UI atoms (Button, Logo, Chip, Avatar, Progress, etc.)
- `screens-desk-a.jsx` — Landing, Onboarding, Upload screens
- `screens-desk-interview.jsx` — Interview screen (HERO — the core differentiator)
- `screens-desk-b.jsx` — Preview, Diff/Suggestions, Dashboard screens
- `screens-mobile.jsx` — Mobile versions of key screens
- `resume-doc.jsx` — Resume document template with sample Filipino data

## DO NOT'S

- DO NOT OVERUSE PHILIPPINE FLAG MOTIFS (NO 8-RAYED SUN GLYPH)
- DO NOT USE jeepNEY PATTERNS
- DO NOT USE PURPLE GRADIENTS
- DO NOT USE AI SLOP GRATIENTS
- DO NOT USE ANY AI GRATIENTS
- DO NOT OVERUSE BADGES
- DO NOT USE ABSTRACT BACKGROUNDS

## DO'S

- DO USE TALA BRANDING CONSISTENTLY
- DO USE HIGH QUALITY IMAGERY
- DO USE HIGH QUALITY ICONS
- DO USE HIGH QUALITY SVGS
- DO USE HIGH QUALITY WEB3 COMPONENTS
- DO USE HIGH QUALITY AI COMPONENTS
- DO USE HIGH QUALITY ML COMPONENTS
