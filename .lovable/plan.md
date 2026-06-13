## Cyberbacker Client Success Platform

A modern, enterprise-grade SaaS frontend (Stripe/Salesforce-style "Trust Blue" aesthetic) with all 19 navigation sections built as full UI, dark mode, and a typed mock-data layer designed to be swapped for FastAPI REST endpoints with zero component changes. No backend logic, no auth gating — every section is reachable from one app shell.

### Design system
- **Palette (Trust Blue):** primary `#2563EB`, ink/navy `#0F172A`, surface `#F1F5F9`, success accent `#10B981`. Defined as semantic oklch tokens in `src/styles.css` for both light and dark mode.
- **Typography:** Geist/`space-grotesk-dm-sans` style pairing — crisp display headings + clean body. Loaded via `<link>` in `__root.tsx`.
- **Feel:** medium radius (10px), soft layered shadows, generous spacing, data-dense but breathable cards. All colors via design tokens — no hardcoded color classes.

### App shell (used by every page)
- Collapsible **sidebar** (shadcn sidebar) with two grouped sections: CLIENT FEATURES and INTERNAL FEATURES, active-route highlighting, icon mini-collapse.
- **Top navigation bar:** global search, dark-mode toggle, **notification center** (popover with unread badge + list), and **user profile menu** (dropdown: profile, settings, sign out — visual only).
- Fully responsive: sidebar becomes an off-canvas drawer on mobile; header collapses to grid layout per responsive rules.

### Navigation & routes (TanStack file-based routing under `src/routes/`)

**Client features**
```
/                       Dashboard (KPIs, activity, quick actions)
/my-cyberbackers        Roster cards, status, hours, contact
/marketplace            Hiring marketplace — candidate grid + filters
/attendance             Attendance calendar + time logs table
/performance            Performance reports w/ charts
/support                Support Center — ticket list + create
/knowledge-base         KB categories + articles + search
/contracts              Contract list, status, signing state
/billing                Invoices, payment methods, plan
/rewards                Rewards & coupons grid
/settings               Profile, notifications, preferences, theme
```

**Internal features**
```
/internal/clients       Client Management table + detail drawer
/internal/cyberbackers  Cyberbacker Management roster + status
/internal/recruitment   Recruitment Pipeline (kanban stages)
/internal/tickets       Support Ticket Management queue + SLA
/internal/finance       Finance Dashboard (revenue, payouts, AR)
/internal/analytics     Analytics Dashboard (charts, funnels)
/internal/executive     Executive Dashboard (high-level KPIs)
/internal/admin         System Administration (users, roles, audit, settings)
```

Each route gets its own `head()` metadata (title + description).

### Reusable components (`src/components/`)
- `layout/` — `AppSidebar`, `Topbar`, `NotificationCenter`, `UserMenu`, `ThemeToggle`, `PageHeader`.
- `shared/` — `StatCard` (KPI tile w/ trend), `DataTable` (sortable shadcn table wrapper), `StatusBadge`, `EmptyState`, `SectionCard`, `FilterBar`, `Avatar` helpers.
- `charts/` — Recharts wrappers (line/area/bar/donut) themed to tokens, for performance/finance/analytics/executive pages.
- Roles (Client, Recruiter, Facilitator, Support Agent, Finance Team, Administrator, Executive) modeled as a typed enum/union in the data layer and shown in mock user/staff records — used for display, not access control in this version.

### Mock data + API-ready layer (`src/lib/data/`)
- `types.ts` — TypeScript interfaces for every entity: `User`, `Role`, `Cyberbacker`, `Candidate`, `AttendanceEntry`, `PerformanceReport`, `Ticket`, `Article`, `Contract`, `Invoice`, `Reward`, `Client`, `PipelineStage`, `FinanceMetric`, `AnalyticsMetric`, `Notification`, etc.
- `mock/*.ts` — realistic placeholder datasets per entity.
- `api.ts` — async service functions (e.g. `getCyberbackers()`, `getTickets()`) that currently return mock data via a small delay, but mirror the future FastAPI REST shape. A single `API_BASE` constant + commented `fetch` stubs make swapping to real endpoints a drop-in change.
- Pages consume data through **TanStack Query** (`useQuery` against these service functions) so the move to live APIs is seamless.

### Technical notes
- Stack: TanStack Start + React 19 + Tailwind v4 + shadcn (already in project). No backend/Lovable Cloud enabled — purely frontend per request.
- Dark mode via `.dark` class toggle persisted to `localStorage`, applied on the html element.
- All data fetching goes through the service layer so no component imports mock data directly.
- Strict-build safe: every imported file/component created before it's referenced.

### Build order
1. Theme tokens + fonts + dark-mode toggle infrastructure.
2. Data layer (types, mock data, service functions, Query setup).
3. App shell (sidebar, topbar, notifications, profile menu, responsive layout) + root layout route.
4. Client feature pages (11).
5. Internal feature pages (8).
6. Charts, polish, responsive QA, slop-sweep.

This is a large build; I'll implement it section by section so the app stays runnable throughout.