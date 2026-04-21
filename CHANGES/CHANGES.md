# Tala Resume — Change Log

## April 22, 2026 — 6:48 AM

### Frontend
- Initialized Next.js project with TypeScript, Tailwind CSS v4, and App Router
- Set up shadcn/ui component library
- Implemented Tala design token system (palettes, typography, density, motifs)
- Configured typography system with all five font pairings via next/font
- Built complete CSS theming system integrated with Tala tokens
- Created core Tala components: ThemeProvider, TalaSun, TalaLogo, TalaButton, TalaChip, TalaMeta, TalaProgress, TalaAvatar, TalaInput, TalaSectionHead, TalaResumeDoc
- Built landing page with Filipino-themed hero section and Unsplash imagery
- Implemented login and signup pages with bilingual EN/FIL UX
- Built 4-step onboarding wizard with bilingual interface
- Created protected app layout with auth guard
- Built initial dashboard page
- Added navigation links from landing page to auth routes

### Backend
- Set up Supabase SSR authentication infrastructure (client, server, middleware helpers)
- Implemented auth server actions (login, signup, Google OAuth, magic link, logout)
- Created OAuth callback route with smart redirect (new users → onboarding, returning → dashboard)
- Migrated middleware.ts to proxy.ts for Next.js 16 compatibility

### Database
- Created profiles table migration with RLS policies (00001_create_profiles.sql)
- Set up environment variables template for Supabase configuration
