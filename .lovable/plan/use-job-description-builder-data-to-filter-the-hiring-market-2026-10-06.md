# Use Job Description Builder data to filter the Hiring Marketplace

## Goal
When a client builds a job description, the Hiring Marketplace filters and ranks candidates against the full JD — not just one skill — so they immediately see the best-matching Cyberbackers.

## What changes

### 1. Pass the full JD to the marketplace
- The "Find matching candidates" button in `JobDescriptionBuilder` currently sends only the first skill and the tier. It will now send: job title, all required skills, tasks/responsibilities keywords, and the tier (as URL search params on `/marketplace`).

### 2. Marketplace reads and applies the JD
- Extend the marketplace's search params (`skill`, `tier` → `title`, `skills[]`, `tier`) with `validateSearch`.
- When a JD is active:
  - **Search box** pre-fills with the job title.
  - **Required skills filter:** candidates must match the JD's skills (shown as removable filter chips above the results).
  - **Tier filter:** "Experienced" sets minimum experience to 3+ years; "Trainable" shows all.
  - **Match ranking:** each candidate's match score is recomputed against the JD (skill overlap, title/keyword match, experience vs. tier) and results sort by that score.

### 3. Active-JD banner
- A banner at the top of the marketplace shows "Filtering by: [Job title]" with the skill chips, plus two buttons: **Edit job description** (back to the builder) and **Clear** (remove JD filters, keep manual filters).

### 4. Builder polish
- "Find matching candidates" shows a toast confirming how many filters were applied.

## Technical notes
- All client-side: JD data travels via typed URL search params (no backend, no localStorage), so the filtered view is shareable/bookmarkable.
- Files touched: `src/components/jobs/JobDescriptionBuilder.tsx`, `src/routes/_app.marketplace.tsx`.
- Matching logic is a small pure function in the marketplace file (skill overlap + keyword scoring); easy to replace with a real API call later.
