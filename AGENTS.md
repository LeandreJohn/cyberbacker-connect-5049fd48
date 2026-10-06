# AGENTS.md
- Build is SPA mode (static shell, no runtime SSR) — the app must be deployable as static files to Azure Static Web Apps; avoid server functions and server-only loaders.
- Data comes from the typed mock layer in src/lib/data (api.ts/queries.ts) — swap point for the future FastAPI backend.
