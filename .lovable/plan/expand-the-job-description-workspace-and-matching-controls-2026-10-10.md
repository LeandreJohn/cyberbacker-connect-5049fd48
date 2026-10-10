# Expand the Job Description workspace and matching controls

## Goal
Turn the Job Description Builder tab into a saved-job workspace, then extend the existing form with the skill, experience, education, availability, and scoring controls shown in the references.

## Job Description workspace
- Open the tab on a responsive table of saved job descriptions instead of opening the form immediately.
- Show useful columns such as title, department, tier, status, last updated, and candidate count, with an Edit action that reopens the selected job.
- Add a prominent **+ New Job** button above the table.
- The button opens a “New job” choice screen modeled on the reference:
  - **Start blank** opens the existing builder with clean defaults.
  - **Paste existing job description** is visible but marked **Coming soon** and cannot start an import yet.
- Add Save/Update and Back to jobs actions. Keep saved jobs browser-local through the typed data service so the static Azure-compatible app works now and remains replaceable by the future FastAPI service.

## Builder fields and controls
- Preserve the current five-section form and three experience tiers.
- Rebuild requirements as one searchable skill/tool picker:
  - Add an item as **Must-have** or **Preferred**.
  - Give every selected item a level: Basic, Intermediate, Advanced, or Expert.
  - Display must-have and preferred items in clear side-by-side groups with easy removal and editing.
  - Offer at least 15 specific skill suggestions and at least 15 specific software/tool suggestions. Use explicit product names such as Monday.com, GoHighLevel CRM, HubSpot CRM, Salesforce CRM, Buildium, Yardi Breeze, RentRedi, Google Workspace, Slack, Canva, QuickBooks Online, Zendesk, Dialpad, Asana, and Trello rather than a generic “CRM” item.
- Add minimum years of experience and multi-select functional expertise.
- Add minimum education level plus a “must have this level” switch.
- Replace the single language input with a searchable multi-select language list. Each chosen language gets a required proficiency rating from 1–5.
- Add Dialpad to day-to-day communication.
- Keep work style choices as **Proactive**, **Reactive**, and **Combination**.
- Add the reference availability controls: full-time/part-time, hours-per-week band, shift, start timing, and optional schedule notes. Shift choices include standard business hours, early hours, evening coverage, and flexible/split shifts.

## Matching rules and scoring
- Let each job choose what happens when a candidate misses a must-have item:
  - **Filter out** by default.
  - **Lower the score** as the alternative.
- Add adjustable scoring weights for Skills, Experience, Responsibilities, Assessment, and Education, with defaults of 40%, 25%, 20%, 10%, and 5%.
- Provide sliders plus numeric values, reset-to-defaults, a live total, and remaining-percentage feedback.
- Prevent any adjustment from taking the total above 100%; candidate matching uses the saved weights exactly.
- Extend the shared job profile, candidate sample data, URL handoff, and marketplace explanations for skill levels, functional expertise, education, multiple language proficiencies, availability/shift, must-have behavior, and custom weights.
- Continue showing strengths and gaps, including missing must-haves and education/language/availability differences.

## Technical details
- Add typed saved-job, skill requirement, language requirement, availability, education, must-have behavior, and scoring-weight models in the existing client-side data layer.
- Keep scoring and validation centralized in the shared matching module so the builder, saved-job table, and marketplace cannot drift.
- Add focused tests for the 100% cap, custom-weight scoring, filter-out versus lower-score behavior, language proficiency, education requirements, and shift compatibility.
- Verify creating, saving, listing, editing, and sending a job to the marketplace on desktop and mobile; confirm the preview has no build or runtime errors.
