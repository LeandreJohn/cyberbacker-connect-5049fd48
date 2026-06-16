# Support Center module (Zendesk/Freshdesk style)

Build a full helpdesk experience on **both** surfaces, sharing components, plus make the brand logos load offline.

## 1. Data model & mock data

**`src/lib/data/types.ts`**
- Rename/relabel the "Pending Client" status. Keep the `TicketStatus` union but change `waiting` → `pending_client` so the five statuses are exact: `open | in_progress | pending_client | resolved | closed`. Update the `prettify`/`toneFor` map accordingly (`pending_client` → "Pending Client", warning tone).
- Extend `Ticket` with the fields the detail view needs:
  - `description: string`
  - `attachments: TicketAttachment[]`
  - `messages: TicketMessage[]` (conversation thread)
  - `events: TicketEvent[]` (timeline / status history)
  - `requesterInitials: string`, `tags?: string[]`
- New supporting interfaces:
  - `TicketAttachment { id; name; sizeKb; type }`
  - `TicketMessage { id; author; initials; role: "client" | "agent"; body; time; attachments?: TicketAttachment[] }`
  - `TicketEvent { id; type: "created" | "status" | "assignment" | "priority" | "comment" | "attachment"; label; actor; time }`

**`src/lib/data/mock.ts`**
- Update the 5 existing tickets (`waiting` → `pending_client`) and expand to ~7–8 realistic tickets across all five statuses and all four priorities, varied categories (Billing, Account, Onboarding, Reports, Technical).
- Give each ticket a description, 0–3 attachments, a 3–6 message conversation thread (alternating client/agent), and a matching event timeline.

No `api.ts`/`queries.ts` signature changes needed — `q.tickets()` already returns the enriched list.

## 2. Shared Support components

New folder `src/components/support/`:
- **`CreateTicketModal.tsx`** — shadcn `Dialog` with subject, category `Select`, priority `Select`, description `Textarea`, and a file-attachment dropzone (local-only file list, no upload backend). Submit fires a `sonner` toast (mock layer). Reusable on both pages.
- **`TicketStatusBadge` / priority helpers** — thin wrappers over existing `StatusBadge` + `toneFor` so status/priority chips look identical everywhere.
- **`TicketTimeline.tsx`** — vertical timeline rendering `TicketEvent[]` with icons per event type and connector line.
- **`ConversationThread.tsx`** — Zendesk-style message thread: avatar (`InitialsAvatar`), author/role, body bubble (agent vs client styled with semantic tokens, not hardcoded colors), inline attachment chips, and a reply composer (`Textarea` + attach + send → toast).
- **`AttachmentList.tsx`** — file chips with type icon + size, download affordance (visual only).
- **`TicketDetailPanel.tsx`** — the right-hand detail view used by both surfaces: header (subject, #id, status/priority badges, category, assignee, SLA), `Tabs` for **Conversation** / **Timeline** / **Details (+attachments)**, and action buttons.

## 3. Client Support Center — `src/routes/_app.support.tsx` (rebuild)

Two-pane Zendesk layout:
- **Header** with "New Ticket" button (opens `CreateTicketModal`).
- KPI row (`StatCard`): Open, In Progress, Pending Client, Resolved.
- **Left:** ticket list with a search `Input`, category filter `Select`, status filter `Tabs` (All / Open / In Progress / Pending Client / Resolved / Closed), and priority filter. Clickable rows select a ticket.
- **Right:** `TicketDetailPanel` for the selected ticket (conversation thread, timeline, attachments). On mobile the detail opens in a `Sheet`.
- Scoped to the current client's tickets (existing `requester` filter for Jordan/BrightPath).

## 4. Agent Helpdesk — `src/routes/_app.internal.tickets.tsx` (rebuild)

Same shared components, staff-oriented:
- KPI row (Total, Open, Urgent, SLA Breaching) — keep existing stats, add status counts.
- Full-width ticket queue across **all** clients with search, category filter, priority filter, status `Tabs`, assignee column, SLA column, and requester avatars.
- Selecting a ticket opens `TicketDetailPanel` (right pane on desktop, `Sheet` on mobile) with agent actions: change status, reassign, set priority, internal reply — all wired to `sonner` toasts.
- "Create Ticket" button reuses `CreateTicketModal`.

## 5. Logos offline (bundle PNGs)

Currently logos load from the CDN via `.asset.json` `.url` (won't render offline). Download the referenced brand PNGs into the repo and import them directly so Vite bundles them:
- Download from their CDN URLs into `src/assets/`: `cyberbacker-mark-dark.png`, `cyberbacker-wordmark-light.png`, `cyberbacker-logo-light.png` (and the remaining two for completeness).
- Switch imports to direct image imports (e.g. `import wordmarkDark from "@/assets/cyberbacker-mark-dark.png"`) and use the imported value directly as `src` in:
  - `src/components/layout/AppSidebar.tsx` (light + dark wordmarks)
  - `src/routes/_app.index.tsx` (dashboard welcome banner logo)
- Remove the now-unused `.png.asset.json` pointer files for the bundled logos.

## Technical notes
- All status/priority colors via existing `StatusBadge` + semantic tokens; no hardcoded colors.
- Attachments and replies are front-end mock only (no storage/backend) — actions surface `sonner` toasts, matching the existing mock-layer pattern.
- Data stays in the typed mock layer so the future FastAPI swap is unaffected.
