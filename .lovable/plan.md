## Goal

Add two executive-grade internal dashboards modeled on Power BI / Tableau / Salesforce:

1. **Internal Operations Dashboard** — the new Internal landing (`/internal`), an ops command center with cross-department KPIs and tabbed drill-downs for Recruitment, Support, Finance, and Client Success.
2. **Executive Dashboard** — revamp the existing `/internal/executive` page into a company-wide strategic view with 7 metrics, 5 charts, and a strategic insights section.

Both reuse existing patterns: `PageHeader`, `StatCard`, `StatusBadge`, the chart wrappers in `Charts.tsx`, and TanStack Query (loader `ensureQueryData` + `useSuspenseQuery`).

## 1. Extend the data layer

**`src/lib/data/types.ts`** — add new interfaces:
- `GrowthPoint { month; clients; cyberbackers }`
- `TicketVolumePoint { month; opened; resolved }`
- `RetentionPoint { month; retention; churn }`
- `DeptSummary { id; label; metrics: {label; value; change?; trend?}[] }` (optional helper, or inline in pages)

**`src/lib/data/mock.ts`** — add 6-month series:
- `growthTrend` (client + cyberbacker counts trending up)
- `ticketVolume` (opened vs resolved)
- `retentionTrend` (retention % up, churn % down)

**`src/lib/data/api.ts`** — add `getGrowthTrend`, `getTicketVolume`, `getRetentionTrend` following the existing `mockResponse(...)` pattern (with commented `fetchJson` stubs).

**`src/lib/data/queries.ts`** — register `growthTrend`, `ticketVolume`, `retentionTrend` query options.

## 2. Internal Operations Dashboard — new landing at `/internal`

New file **`src/routes/_app.internal.index.tsx`** → `createFileRoute("/_app/internal/")`.

Layout:
- `PageHeader` "Operations Dashboard" with a period badge.
- **Top KPI row** (`StatCard` x5): Active Clients, Active Cyberbackers, Open Tickets, Revenue (MRR), Client Satisfaction (CSAT) — values derived from `clientAccounts`, `cyberbackers`, `tickets`, `revenueTrend`, plus a CSAT constant.
- **Department drill-downs** via shadcn `Tabs` (Recruitment / Support / Finance / Client Success). Each tab shows:
  - 3-4 inline mini metric cards for that department,
  - one relevant chart (Recruitment: pipeline funnel/bar; Support: ticket volume line; Finance: revenue vs payouts bar; Client Success: retention area),
  - a small table or list (e.g. top pipeline candidates, recent tickets, recent invoices, at-risk accounts),
  - a "View full dashboard" `Button asChild` linking to the existing department route (`/internal/recruitment`, `/internal/tickets`, `/internal/finance`, `/internal/clients`).
- Loader primes all needed queries with `ensureQueryData`.

## 3. Executive Dashboard revamp — `src/routes/_app.internal.executive.tsx`

Replace the current body with:
- **Executive summary cards**: a 7-metric grid using `StatCard`: Total Clients, Total Cyberbackers, Revenue (ARR/MRR), Retention Rate, Churn Rate, Satisfaction Score, Referral Growth.
- **Charts grid** (5 charts using existing wrappers):
  - Revenue Trend — `TrendAreaChart` (revenueTrend)
  - Client Growth — `SimpleLineChart`/`TrendAreaChart` (growthTrend.clients)
  - Cyberbacker Growth — `GroupedBarChart` (growthTrend.cyberbackers)
  - Ticket Volume — `SimpleLineChart` (ticketVolume opened vs resolved)
  - Retention Analysis — `TrendAreaChart` (retentionTrend retention vs churn)
- **Strategic insights section**: keep/upgrade the strategic objectives progress bars and add an "Insights" card with 3-4 narrative bullet callouts (e.g. NRR, utilization, churn watch) using semantic tokens and small trend badges.
- Loader primes revenueTrend, performanceTrend, growthTrend, ticketVolume, retentionTrend.

## 4. Navigation

**`src/components/layout/nav-config.ts`** — add an "Operations Dashboard" item at the top of the Internal group pointing to `/internal` (icon e.g. `Gauge`/`LayoutDashboard`), and keep the existing Executive Dashboard item. Reorder so Operations is first.

## 5. Verify

- Confirm `routeTree.gen.ts` picks up the new `_app.internal.index.tsx` (auto-generated; no manual edit).
- Load `/internal` and `/internal/executive` in the preview to confirm charts render, tabs switch, and drill-down links navigate. Check light + dark mode.

### Technical notes
- All colors via semantic tokens / `chartColors` — no hardcoded color classes.
- Charts already guard SSR via `ChartShell`; safe to reuse.
- No backend changes; mock layer stays API-ready for the future FastAPI swap.
