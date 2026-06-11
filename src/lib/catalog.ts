import type { Track, SetupVersion } from '../types'
import { matchTrack, UNKNOWN_TRACK_ROUND } from './tracks'
import { compareVersions } from './version'

/**
 * Auto-discover every setup PDF in the repository.
 *
 * `import.meta.glob` is resolved by Vite at *build time*. Every file matching
 * `/setups/**​/*.pdf` is emitted as a hashed asset and we get back its public
 * URL. The practical upshot — and the whole point of this app:
 *
 *   1. Drop a new folder under /setups (e.g. "1.3") with the PDFs.
 *   2. Push to GitHub.
 *   3. Netlify rebuilds → this glob re-runs → the new version appears.
 *
 * No code changes are ever needed to add a version. `eager: true` means the
 * map is populated synchronously, so the rest of the app can treat the catalog
 * as plain in-memory data.
 */
const pdfModules = import.meta.glob('/setups/**/*.pdf', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** Title-case a raw string for display. */
function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/** Turn an arbitrary string into a URL-safe slug. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Best-effort name when a filename doesn't match a known circuit. Strips the
 * boilerplate the supplier wraps around the track name.
 */
function guessName(fileName: string): string {
  const noise = /\b(f1|26|complete|setup|setups|package|pdf|the|full|final)\b/gi
  const cleaned = fileName
    .replace(/\.pdf$/i, '')
    .replace(noise, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned ? titleCase(cleaned) : titleCase(fileName.replace(/\.pdf$/i, ''))
}

interface ParsedFile {
  version: string
  fileName: string
  pdfUrl: string
}

/** Split a glob path into its version folder + filename. */
function parsePath(path: string, url: string): ParsedFile | null {
  // path looks like "/setups/1.0/F1 26 Monaco complete package.pdf"
  const segments = path.split('/').filter(Boolean) // ["setups","1.0","F1 26 ...pdf"]
  if (segments.length < 3) return null
  const version = segments[1]
  const fileName = segments[segments.length - 1]
  return { version, fileName, pdfUrl: url }
}

function buildCatalog(): Track[] {
  // Group discovered files by resolved track id.
  const byTrack = new Map<string, Track>()

  for (const [path, url] of Object.entries(pdfModules)) {
    const parsed = parsePath(path, url)
    if (!parsed) continue

    const match = matchTrack(parsed.fileName)
    const id = match ? match.id : slugify(guessName(parsed.fileName))
    if (!id) continue

    let track = byTrack.get(id)
    if (!track) {
      track = match
        ? { ...match, versions: [] }
        : {
            id,
            name: guessName(parsed.fileName),
            country: '',
            flag: '🏁',
            round: UNKNOWN_TRACK_ROUND,
            versions: [],
          }
      byTrack.set(id, track)
    }

    const version: SetupVersion = {
      version: parsed.version,
      pdfUrl: parsed.pdfUrl,
      fileName: parsed.fileName,
    }
    track.versions.push(version)
  }

  const tracks = Array.from(byTrack.values())

  // Newest version first within each track.
  for (const track of tracks) {
    track.versions.sort((a, b) => compareVersions(b.version, a.version))
  }

  // Calendar order, then alphabetical as a tiebreaker.
  tracks.sort((a, b) => a.round - b.round || a.name.localeCompare(b.name))

  return tracks
}

/** The fully-resolved catalog. Computed once at module load. */
export const CATALOG: Track[] = buildCatalog()

/** Every distinct version string across all tracks, newest first. */
export const ALL_VERSIONS: string[] = Array.from(
  new Set(CATALOG.flatMap((t) => t.versions.map((v) => v.version))),
).sort((a, b) => compareVersions(b, a))

export function getTrack(id: string): Track | undefined {
  return CATALOG.find((t) => t.id === id)
}

export function getVersion(trackId: string, version: string): SetupVersion | undefined {
  return getTrack(trackId)?.versions.find((v) => v.version === version)
}

/** The newest version string for a track, or undefined if it has none. */
export function latestVersion(track: Track): string | undefined {
  return track.versions[0]?.version
}
