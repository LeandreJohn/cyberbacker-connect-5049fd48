# Reviews, Google Login, Job Description Builder, and Static Hosting

## 1. Review & Rate Cyberbackers (new client tab)
- New sidebar item under Client: **Reviews & Ratings** (`/reviews`).
- Pick one of your Cyberbackers and give them a 1–5 star rating overall and for Communication, Quality, Reliability and Timeliness, plus a written comment and a "would recommend" toggle.
- The page shows each Cyberbacker's average rating, recent reviews, and a rating trend chart.
- Submitting shows a confirmation toast and adds the review to the list (sample data only for now).

## 2. Google Login page
- New `/login` page with brand logo, powder-blue split layout, and one **Continue with Google** button.
- Clicking the button goes straight to the Client Dashboard. There is no real sign-in yet.
- The page has no sidebar. The profile menu's "Sign out" goes back to `/login`.

## 3. Job Description Builder (on the Dashboard)
- A **Build Job Description** quick action on the Dashboard opens the builder, which also has its own page (`/job-builder`) linked from the sidebar.
- Fields: job title, department, task list (add/remove), responsibilities (add/remove), required skills (tag input with suggestions), tools, schedule/time zone, and hours per week.
- **Tier selector:** choose between
  - *Trainable / Entry*: has the basics, and you will train them
  - *Experienced / Plug-and-play*: ready from day one, no training needed
  Each tier changes the suggested experience level, the rate range, and the wording.
- A live preview of the finished job description, with Copy, Download and "Find matching candidates" buttons. The last one opens the Hiring Marketplace with filters set from the skills and tier you chose.

## 4. Static build for Azure (no server rendering)
- Turn on TanStack Start's single-page app mode. The build becomes a set of static HTML/JS/CSS files that need no server, so you can host them on Azure Static Web Apps or Blob Storage.
- Add a `staticwebapp.config.json` file so that refreshing any page loads the app correctly (a navigation fallback to index.html).
- Note: the framework stays the same. Only the output changes to static. The live preview here keeps working as before.

## Technical details
- Routes: `src/routes/_app.reviews.tsx`, `src/routes/_app.job-builder.tsx`, `src/routes/login.tsx` (outside the `_app` shell). Each gets its own head().
- Data: `Review` type plus mock reviews, `getReviews`/`submitReview` in api.ts, and a query in queries.ts. Submitting uses a TanStack Query mutation that updates the cache.
- JD builder: a reusable `JobDescriptionBuilder` component used on the page and in a Dialog launched from the Dashboard. The Marketplace reads `skills`/`tier` search params for preset filters.
- nav-config: add Reviews & Ratings and Job Description Builder.
- vite.config.ts: `tanstackStart: { spa: { enabled: true } }`, with server functions and SSR loaders avoided. `public/staticwebapp.config.json` sets `navigationFallback` to `/index.html` (or `_shell.html` if needed). Record the static-only rule in AGENTS.md.
