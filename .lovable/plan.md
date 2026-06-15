## Cyberbacker Management page + logo fixes

### 1. Logo consistency + collapsed overlap (`AppSidebar.tsx` + new asset)

Problem confirmed: in light mode the sidebar shows `cyberbacker-mark-dark.png` which still carries the **tagline** ("We've Got Your Back / World-Class Professional Support", aspect 2.14, rendered at `h-6`), while dark mode shows the **tagline-free** `cyberbacker-wordmark-light.png` at `h-8`. So the two themes show different logos at different sizes.

Fixes:
- Generate a clean, **tagline-free dark wordmark** (`cyberbacker-wordmark-dark.png`) to mirror the existing tagline-free light wordmark, and register it as a CDN asset.
- Use the two tagline-free wordmarks at the **same height** (`h-7`) for light/dark — visually consistent.
- Collapsed state: render a compact, centered brand mark with no horizontal padding so it can't overflow/overlap the icon rail. Use `justify-center` and remove `gap`/`px` when collapsed, keep the rounded "CB" tile sized to the icon rail.

### 2. Extend the data model (`src/lib/data/types.ts`)

Add optional rich fields to the existing `Cyberbacker` interface (kept optional so other pages stay valid) plus supporting types:

```text
Cyberbacker (added):
  avatarUrl?, attendanceRate, productivity, tasksCompleted,
  certifications: Certification[], schedule: ScheduleDay[],
  attendanceHistory: AttendanceDay[], reviews: PerformanceReview[],
  trainings: TrainingRecord[]

Certification { name, issuer, issuedOn, expiresOn? }
ScheduleDay { day, start, end, hours }   // Mon–Fri shift
AttendanceDay { date, status, hours }     // present/late/absent/leave
PerformanceReview { period, reviewer, score, summary }
TrainingRecord { title, status: "completed"|"in_progress"|"assigned", completedOn?, progress }
```

### 3. Mock data (`src/lib/data/mock.ts`)

Populate the new fields with realistic values for each existing cyberbacker (certifications like "Google Workspace Pro", "HubSpot CRM"; a Mon–Fri schedule; ~12 days of attendance history; 2–3 performance reviews; 3–4 training records with mixed status; productivity/attendanceRate numbers). No new query needed — reuses `q.cyberbackers()`.

### 4. Rebuild the page (`src/routes/_app.internal.cyberbackers.tsx`)

Enterprise dashboard layout:

- **Header**: title + "Onboard Cyberbacker" action (kept).
- **KPI row** (`StatCard`): Active Cyberbackers, Avg Attendance, Avg Productivity, Avg Performance Score.
- **Overview band**: small charts using existing `Charts.tsx` — productivity/attendance trend (area) + status distribution (donut).
- **Roster grid**: rich cards per cyberbacker (avatar/initials, role, status badge, skill chips, performance + attendance + productivity mini-bars). Card click / "View profile" opens the detail panel.
- **Detail side panel** (shadcn `Sheet`): tabbed (`Tabs`) sections —
  - Overview: photo/initials, role, skills, schedule table, productivity/performance/attendance stats.
  - Certifications: list with issuer + dates, expiry badges.
  - Attendance: recent attendance history rows with status badges.
  - Reviews: performance reviews with score + reviewer + summary.
  - Training: training records with status + progress bars.
  - **Management actions** (footer, always visible): **Request Coaching**, **Submit Feedback**, **Request Replacement**, **Schedule Review** — wired to `sonner` toasts (mock layer, no backend).

### Technical notes
- Frontend only; reuses `PageHeader`, `StatCard`, `InitialsAvatar`, `StatusBadge`/`toneFor`/`prettify`, `Charts`, `Sheet`, `Tabs`, `Progress`, `Badge`, `Button`, `Table`, `sonner`. No backend / no schema changes.
- New status tones ("completed", "in_progress", "assigned") already largely covered by `toneFor`; add any missing keys there.
- All colors via existing semantic tokens (no hardcoded colors).
