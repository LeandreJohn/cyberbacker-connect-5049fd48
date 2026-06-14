# Hiring Marketplace + Logo Fix

## 1. Fix the sidebar logo (no tagline)

The light-mode logo is already tagline-free, but the dark-mode logo (`cyberbacker-logo-light.png`) still shows the "We've Got Your Back. World-Class Professional Support." tagline.

- Generate a clean **white, tagline-free** logo by removing the tagline area from the existing white logo, then register it as a new CDN asset (`cyberbacker-wordmark-light.png`).
- Update `AppSidebar.tsx` to use this new tagline-free white logo in dark mode (light mode already uses the correct mark).

## 2. Extend the candidate data model

`src/lib/data/types.ts` — add fields to the `Candidate` interface to support the new page:

- `industries: string[]` — industry experience (e.g. Real Estate, Healthcare)
- `valuesScore: number` — Values Assessment Score (0–100)
- `introVideoUrl?: string` — intro video placeholder (kept null/empty; UI shows a placeholder)
- `bio: string` — short professional summary for the detail panel

`src/lib/data/mock.ts` — enrich the 6 existing candidates (and add a few more, ~9 total) with realistic values for the new fields. No backend; still served through the existing `api.getCandidates` / `q.candidates()` flow.

## 3. Rebuild the Marketplace page (`src/routes/_app.marketplace.tsx`)

A talent-marketplace layout inspired by LinkedIn Recruiter / modern hiring tools, using existing shared components and design tokens (powder-blue theme, no hardcoded colors).

**Toolbar**
- Prominent search bar (name, role, skill, industry).
- "Advanced filters" — a collapsible filter bar / popover with: availability, minimum years of experience, minimum rating, minimum values score, industry, and skill chips. Plus a results count and a "Clear filters" action.

**Candidate cards grid**
Each card shows: avatar + name, role, years of experience, top skills, industry tags, availability badge, Values Assessment Score, rating, and match score. Card actions:
- **View Profile** → opens the detail side panel
- **Schedule Interview** → confirmation toast (sonner)
- **Shortlist** → toggles shortlisted state (heart/bookmark), toast feedback
- A **Compare** checkbox to add/remove the candidate from comparison

**Detail side panel** (shadcn `Sheet`, slides from right)
Full candidate info: header (name, role, availability, rating, match), **intro video placeholder** (16:9 block with play icon + "Intro video coming soon"), Values Assessment Score (progress bar), years of experience, full skill list, industry experience, bio, and the three primary actions (View Profile is the panel itself, Schedule Interview, Shortlist).

**Candidate comparison**
- Selecting candidates via the Compare checkbox shows a sticky bottom **comparison bar** ("N selected · Compare").
- Clicking Compare opens a `Dialog` with a side-by-side comparison table across key attributes (role, experience, rating, values score, availability, rate, skills, industries) for up to 3–4 candidates.

All filtering/sorting is client-side over the TanStack Query data. State (search, filters, shortlist set, compare set, open panel) lives in component `useState`.

## Technical notes
- Reuse `PageHeader`, `InitialsAvatar`, `StatusBadge`/`toneFor`, and shadcn `Card`, `Button`, `Badge`, `Input`, `Select`, `Sheet`, `Dialog`, `Checkbox`, `Progress`, `Popover`, `Slider`.
- Keep the route's `loader` + `useSuspenseQuery(q.candidates())` pattern.
- No business-logic/backend changes — purely the typed mock layer + UI.
