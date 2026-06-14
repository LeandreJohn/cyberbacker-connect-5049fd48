# Client Dashboard — Build Plan

Rebuild the home page (`src/routes/_app.index.tsx`) into a premium SaaS Client Dashboard, refresh the palette toward **powder blue**, and bring in the real **Cyberbacker logo**.

## 1. Powder-blue theme refresh
Update tokens in `src/styles.css` to soften the current deep "Trust Blue" into an airy powder-blue system that matches the logo (powder-blue globe + navy ink):
- Keep a readable navy ink for text and primary buttons (logo's dark blue).
- Introduce powder-blue surfaces: lighter app background with a faint blue tint, softer card borders, and a new `--powder` accent token plus a `--gradient-powder` for banners/cards.
- Refine chart colors so chart-1 reads as the powder/navy blue family, keeping success/warning/info intact.
- Verify both light and dark mode contrast.

## 2. Brand logo asset
- Register the uploaded logo as a CDN asset (powder-on-dark version `CB-with-Tagline-White-M.png` for the dark sidebar/banner, and the black version for light surfaces) via `lovable-assets`, writing `.asset.json` pointers under `src/assets/`.
- Use the logo in the new welcome banner; optionally swap the placeholder `Hexagon` mark in `AppSidebar` for the globe logo.

## 3. Dashboard data layer additions
Extend the typed mock layer (`types.ts`, `mock.ts`, `api.ts`, `queries.ts`) with new client-dashboard data, mirroring future FastAPI endpoints:
- `renewals` (upcoming contract/plan renewals: name, plan, renewalDate, amount, daysUntil, status).
- `announcements` (recent announcements: title, body, date, tag, author).
- An attendance-summary derivation (present / late / leave / absent counts for the donut) computed from existing `attendance`, plus a small weekly-hours series for a bar chart.
Existing `dashboardStats`, `activityFeed`, `cyberbackers`, `performanceTrend`, `tickets` are reused.

## 4. Dashboard layout (`_app.index.tsx`)
Top-to-bottom, responsive grid, using existing shared components (`PageHeader`, `StatCard`, `StatusBadge`, `InitialsAvatar`) and charts (`TrendAreaChart`, `GroupedBarChart`, `DonutChart`):

```text
┌────────────────────────────────────────────────────────┐
│ Welcome banner (powder gradient + logo, greeting, CTA)  │
├──────────┬──────────┬──────────┬────────────────────────┤
│ KPI:     │ KPI:     │ KPI:     │ KPI:                   │
│ Active   │ Attend.  │ Open     │ Upcoming               │
│ Cyberbk. │ rate     │ tickets  │ renewals               │
├─────────────────────────────┬──────────────────────────┤
│ Team performance (area)     │ Quick actions (4 buttons) │
├─────────────────────────────┼──────────────────────────┤
│ Attendance summary (donut)  │ Recent activity feed      │
├─────────────────────────────┴──────────────────────────┤
│ Open support tickets (list) │ Upcoming renewals (list)  │
├─────────────────────────────────────────────────────────┤
│ Recent announcements (cards)                            │
└─────────────────────────────────────────────────────────┘
```

Sections:
- **Welcome banner** — powder-blue gradient card with logo, personalized greeting, date, and primary "Hire a Cyberbacker" CTA.
- **KPI cards** — Active Cyberbackers, Attendance rate (this week), Open support tickets, Upcoming renewals count, each with trend deltas.
- **Charts** — Team performance area chart (productivity/satisfaction) + Attendance summary donut (present/late/leave/absent).
- **Quick actions** — 4 buttons: Hire a Cyberbacker (`/marketplace`), Submit Support Ticket (`/support`), View Attendance (`/attendance`), Download Reports (`/performance`, triggers a sample report toast).
- **Open support tickets** — compact list of open/urgent tickets with priority + SLA badges, link to `/support`.
- **Upcoming renewals** — list of plan/contract renewals with date, amount, days-until badge, link to `/contracts`.
- **Recent activity feed** — reuse existing activity data.
- **Recent announcements** — card list from new announcements data.

All data via TanStack Query (`ensureQueryData` in loader + `useSuspenseQuery`), keeping the existing pattern.

## Technical notes
- No backend; everything stays in the typed mock layer, swappable for FastAPI later.
- Only semantic tokens for colors (no hardcoded hex in components).
- Keep `errorComponent`/`notFoundComponent` conventions and SSR-safe chart rendering.
- "Download Reports" uses a toast (sonner) to simulate export — no real file generation.
