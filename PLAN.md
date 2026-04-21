# Tala Auth + Onboarding — Implementation Plan

## Phase 0: Documentation & Discovery (Complete)

### Allowed APIs (from @supabase/ssr docs)
- `createBrowserClient(url, key)` — for client components
- `createServerClient(url, key, { cookies: { getAll, setAll } })` — for server components, route handlers, middleware
- `parseCookieHeader()` — parse cookie strings in middleware
- `supabase.auth.getUser()` — validate session (NEVER use `getSession()` for protection)
- `supabase.auth.exchangeCodeForSession(code)` — OAuth callback
- `supabase.auth.signInWithOtp({ email })` — magic link
- `supabase.auth.signInWithOAuth({ provider: 'google' })` — Google OAuth
- `supabase.auth.signOut()` — logout

### Anti-Patterns
- Do NOT use deprecated `@supabase/auth-helpers-nextjs`
- Do NOT use `getSession()` for auth verification on server
- Do NOT use `createMiddlewareClient()`, `createClientComponentClient()`, `createServerComponentClient()`

### Existing Project State
- Next.js 16.2.4, React 19, Tailwind v4, shadcn/ui
- 11 Tala components available (TalaButton, TalaInput, TalaChip, TalaAvatar, TalaMeta, TalaProgress, TalaSectionHead, TalaSun, TalaSunBackdrop, TalaRule, ThemeProvider)
- No middleware.ts exists yet
- No Supabase packages installed
- No API routes exist yet
- Landing page done with nav containing login/get-started CTAs

---

## Phase 1: Supabase Foundation

### Tasks
1. **Install dependencies**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Create `.env.local.example`** with placeholder keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Create Supabase client utilities**:
   - `src/lib/supabase/client.ts` — browser client using `createBrowserClient()`
   - `src/lib/supabase/server.ts` — server client using `createServerClient()` with `cookies()` from next/headers
   - `src/lib/supabase/middleware.ts` — `updateSession()` helper for middleware

4. **Create `src/middleware.ts`** — calls `updateSession()`, matcher excludes static files

### Verification
- [ ] `npm run build` passes
- [ ] Supabase client files export correct functions
- [ ] Middleware file exists with proper matcher

---

## Phase 2: Auth Pages

### Tasks
1. **Create auth layout** — `src/app/(auth)/layout.tsx`
   - Centered card layout with TalaLogo, TalaSunBackdrop
   - No nav bar (clean auth experience)

2. **Create login page** — `src/app/(auth)/login/page.tsx`
   - Google OAuth button (TalaButton variant="primary")
   - Magic link form (TalaInput for email + TalaButton to send)
   - "Don't have an account? Sign up" link
   - Uses Tala design system throughout

3. **Create signup page** — `src/app/(auth)/signup/page.tsx`
   - Same as login but with "Already have an account?" link
   - After signup, redirect to onboarding

4. **Create auth callback route** — `src/app/(auth)/callback/route.ts`
   - Exchanges OAuth code for session
   - Checks if user has completed onboarding → redirect to /onboarding or /dashboard

5. **Create auth actions** — `src/app/(auth)/actions.ts`
   - Server actions for `signInWithOAuth`, `signInWithOtp`, `signOut`

6. **Create magic link confirmation page** — `src/app/(auth)/check-email/page.tsx`
   - "Check your email" message after magic link sent

### Verification
- [ ] Login page renders with Tala styling
- [ ] Google OAuth redirects to Supabase
- [ ] Magic link sends email
- [ ] Callback route handles code exchange
- [ ] Unauthenticated users redirected to /login

---

## Phase 3: Database Schema (Prisma)

### Tasks
1. **Install Prisma**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Create Prisma schema** — `prisma/schema.prisma`
   ```prisma
   model Profile {
     id            String   @id @default(uuid())
     authId        String   @unique  // Supabase auth.users.id
     email         String
     fullName      String?
     avatarUrl     String?
     
     // Onboarding fields
     goal          String?  // "first-job" | "career-switch" | "promotion" | "ofw"
     experienceLevel String? // "student" | "entry" | "mid" | "senior"
     targetRole    String?
     language      String?  @default("en") // "en" | "fil" | "both"
     onboardingComplete Boolean @default(false)
     
     createdAt     DateTime @default(now())
     updatedAt     DateTime @updatedAt
   }
   ```

3. **Add DATABASE_URL to `.env.local.example`**:
   ```
   DATABASE_URL=your_supabase_database_url
   ```

### Verification
- [ ] `npx prisma validate` passes
- [ ] Schema matches onboarding flow needs

---

## Phase 4: Onboarding Flow

### Tasks
1. **Create onboarding layout** — `src/app/(app)/onboarding/layout.tsx`
   - Minimal chrome, TalaProgress bar at top
   - TalaLogo in corner

2. **Create onboarding page** — `src/app/(app)/onboarding/page.tsx`
   - Multi-step form (client component)
   - 4 steps with smooth transitions:
     - **Step 1: Goal** — "Ano ang goal mo?" — 4 card options (First job, Career switch, Level up, OFW abroad)
     - **Step 2: Experience** — "Gaano ka na katagal nagwo-work?" — 4 options (Student, 0-2 years, 3-7 years, 8+ years)
     - **Step 3: Target Role** — "Anong role ang gusto mo?" — TalaInput text field
     - **Step 4: Language** — "Paano mo gustong makipag-usap?" — 3 options (English, Filipino, Both)
   - Back/Next navigation with TalaButton
   - TalaChip for selection cards
   - Final step submits to server action → marks onboarding complete → redirects to /dashboard

3. **Create onboarding server action** — `src/app/(app)/onboarding/actions.ts`
   - Saves profile with onboarding data via Prisma
   - Sets `onboardingComplete: true`

### Verification
- [ ] All 4 steps render and navigate correctly
- [ ] Selections persist across steps (client state)
- [ ] Submit creates/updates profile in DB
- [ ] Redirects to dashboard after completion

---

## Phase 5: Protected Routes & Dashboard Shell

### Tasks
1. **Create app layout** — `src/app/(app)/layout.tsx`
   - Server component that checks auth via `supabase.auth.getUser()`
   - Redirects to /login if not authenticated
   - Redirects to /onboarding if `onboardingComplete === false`
   - Renders nav with user info + sign out

2. **Create dashboard page** — `src/app/(app)/dashboard/page.tsx`
   - Placeholder with welcome message using user's name
   - "Start new resume" CTA (TalaButton)
   - Empty state for saved resumes
   - Uses TalaSectionHead, TalaMeta, TalaRule

3. **Update landing page nav** — `src/app/page.tsx`
   - Wire "Log in" to `/login`
   - Wire "Get started — libre" to `/signup`

4. **Update middleware** — redirect logic:
   - Authenticated users hitting /login → /dashboard
   - Unauthenticated users hitting /dashboard, /onboarding → /login

### Verification
- [ ] Dashboard only accessible when logged in
- [ ] Onboarding required before dashboard
- [ ] Landing page CTAs work
- [ ] Sign out works and redirects to landing
- [ ] Middleware redirects work correctly

---

## Phase 6: Final Verification

### Checklist
- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes
- [ ] Auth flow: landing → signup → callback → onboarding → dashboard
- [ ] Auth flow: landing → login → callback → dashboard (returning user)
- [ ] Magic link flow works
- [ ] Sign out returns to landing
- [ ] Protected routes redirect correctly
- [ ] Onboarding data saves to DB
- [ ] All pages use Tala design system consistently
- [ ] No hardcoded colors (all via CSS vars)
- [ ] No deprecated Supabase APIs used
