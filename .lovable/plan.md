# Expand the Job Description Builder from the reference documents

## Goal
Turn the builder into a structured role-matching intake, using the VA client document for role questions and the JD Builder document for filtering, scoring, and explanations.

## Builder changes
- Replace the current two tiers with:
  - **Beginner — 0–1 year**
  - **Intermediate — 1–4 years**
  - **Advanced — 4+ years**
- Organize the form into clear sections instead of one long card:
  1. **Role basics:** title, department, industry, and role duration.
  2. **Work scope:** task areas, responsibilities, and expected deliverables/outcomes.
  3. **Requirements:** required skills, preferred skills, software/tools, certifications, and language needs.
  4. **Work style:** time zone, preferred coverage hours, weekly hours, communication method, update cadence, and proactive/reactive work preference.
  5. **Timing:** ideal start date.
- Keep the requested scope to role-matching questions only; exclude lead contact, budget, previous-VA history, and concierge/self-service questions.
- Add completion checks for the core matching fields and update the live job-description preview with all answers.

## Marketplace matching
- Send the complete structured role profile to the Hiring Marketplace through typed URL search parameters so the result remains shareable.
- Enrich the typed candidate sample data only where needed to compare schedule/time zone, languages, certifications, tools, work style, and availability.
- Apply the JD document's matching model:
  - Required skills and explicit operational needs act as constraints.
  - Preferred skills improve ranking but do not exclude candidates.
  - Rank candidates across skills, experience tier, responsibilities, and operational compatibility.
- Use the three tier ranges consistently in filtering and scoring, including overlap at the stated boundaries: Beginner 0–1, Intermediate 1–4, Advanced 4+.
- Show an updated active-JD summary and a concise match explanation on each result, highlighting strengths and gaps rather than only a percentage.

## Technical details
- Keep everything client-side with the existing typed mock data layer and static Azure-compatible SPA architecture.
- Centralize the JD profile and tier definitions in a shared typed module so the builder and marketplace cannot drift.
- Add focused tests for the three experience ranges, required-vs-preferred behavior, and operational constraints.
- Verify the full builder-to-marketplace flow on desktop and mobile, then confirm the preview build is clean.
