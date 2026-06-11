# setups/

This folder is the **single source of truth** for the app. Everything on the
site is generated from whatever PDFs live here. There is **no code to edit** to
add setups.

## Structure

```
setups/
├── 1.0/
│   ├── F1 26 Monaco complete package.pdf
│   ├── F1 26 Bahrain complete setup package.pdf
│   └── ...
├── 1.1/
│   └── ... (same tracks, new files)
└── 1.2/
    └── ...
```

- **The folder name is the version** (`1.0`, `1.1`, `1.3`, …). Keep it numeric
  so versions sort correctly (`1.10` is treated as newer than `1.2`).
- **The filename decides the track.** The app looks for a known circuit name
  inside the filename (e.g. "Monaco", "Silverstone", "Spa"), so the supplier's
  naming like `F1 26 Monaco complete package.pdf` works as-is.

## Adding a new version

1. Create a new folder, e.g. `setups/1.3/`.
2. Drop the new PDFs in (same filenames as before is fine).
3. `git add . && git commit -m "Add 1.3" && git push`.

Netlify rebuilds on push, the build re-scans this folder, and version 1.3
appears automatically — marked as **Latest**.

## A track isn't showing up?

The track name in the filename isn't in the registry yet. Open
`src/lib/tracks.ts` and add an alias (e.g. add `'cota'` to the United States
entry). Unknown tracks still appear — they just use a name guessed from the
filename and a generic 🏁 flag.

> The PDFs currently in here are sample placeholders. Delete them and add your
> own.
