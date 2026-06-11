# Setup Garage — F1 26

A fast, mobile-first web app for organizing your F1 26 setup packages. Browse
tracks, compare versions, open the PDFs, and keep your own private rating + notes
for every track/version.

Built with **React 19 + Vite + TypeScript**, deployed as a static site on
**Netlify**. No backend, no database — and crucially: **adding a new setup
version never requires touching code.**

---

## How it works (the important part)

The whole catalog is generated from the files under [`setups/`](./setups). At
build time, `src/lib/catalog.ts` uses Vite's `import.meta.glob` to scan every
`setups/<version>/*.pdf`, work out the track from the filename and the version
from the folder name, and build the in-memory structure the UI renders.

Your update loop:

```
1. Create a new folder        →  setups/1.3/
2. Drop the PDFs in           →  setups/1.3/F1 26 Monaco complete package.pdf …
3. git add . && git push
```

Netlify rebuilds on push → the glob re-runs → **version 1.3 shows up, marked
Latest.** That's it.

See [`setups/README.md`](./setups/README.md) for naming rules.

---

## Notes & ratings

Each track/version can have a 1–5 star rating and a free-text note. These are
saved in the browser via `localStorage` (so the site stays backend-free and
deploys anywhere). Use the sliders button (top right) to **export/import** your
notes as JSON — handy for backups or moving to another device.

Want notes synced across devices automatically? `src/lib/storage.ts` is the only
file you'd swap — keep the same function signatures and point them at Firebase /
Supabase. The rest of the app is unaffected.

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Requires Node 18+.

---

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from GitHub** and pick the repo.
3. Netlify reads [`netlify.toml`](./netlify.toml), so the defaults are correct:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Every future `git push` triggers a rebuild that auto-detects new
   setup folders.

The SPA redirect (`/* → /index.html`) is configured in both `netlify.toml` and
`public/_redirects`, so deep links like `/track/monaco/1.3` work on refresh.

---

## Project structure

```
src/
├── lib/
│   ├── catalog.ts      # PDF auto-discovery + track/version structure (core)
│   ├── tracks.ts       # circuit registry: filename → name, flag, order
│   ├── version.ts      # numeric version comparison (1.10 > 1.2)
│   └── storage.ts      # notes/ratings persistence (localStorage; swappable)
├── context/
│   └── NotesContext.tsx
├── components/         # Layout, Rating, SettingsSheet, Icons
├── pages/              # HomePage, TrackPage, VersionPage
├── types.ts
├── App.tsx             # routes
└── main.tsx
setups/                 # ← your PDFs live here (source of truth)
```

---

## Adding a circuit that isn't recognized

Unknown tracks still appear (with a guessed name and a 🏁 flag). To give one a
proper name/flag/order, add a row — or just an alias — to `TRACK_REGISTRY` in
`src/lib/tracks.ts`.
