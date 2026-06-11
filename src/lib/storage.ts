import type { SetupNote } from '../types'

/**
 * Persistence for per-version notes + ratings.
 *
 * Backed by localStorage so the app stays a zero-backend static site that
 * deploys to Netlify with nothing to configure. Data lives in the browser it
 * was written in. If you later want notes synced across devices, this is the
 * single file to swap for a Firebase/Supabase implementation — keep the same
 * function signatures and nothing else in the app changes.
 */

const STORAGE_KEY = 'f1-setup-manager:notes:v1'

export type NotesMap = Record<string, SetupNote>

/** Key for a specific track + version pair. */
export function noteKey(trackId: string, version: string): string {
  return `${trackId}::${version}`
}

function readAll(): NotesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as NotesMap) : {}
  } catch {
    return {}
  }
}

function writeAll(map: NotesMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch (err) {
    // Quota or privacy-mode failure — surface in console, don't crash the UI.
    console.error('Could not save notes', err)
  }
}

export const storage = {
  getAll(): NotesMap {
    return readAll()
  },

  get(trackId: string, version: string): SetupNote | undefined {
    return readAll()[noteKey(trackId, version)]
  },

  set(trackId: string, version: string, note: Pick<SetupNote, 'rating' | 'comment'>): NotesMap {
    const map = readAll()
    map[noteKey(trackId, version)] = {
      rating: note.rating,
      comment: note.comment,
      updatedAt: new Date().toISOString(),
    }
    writeAll(map)
    return map
  },

  remove(trackId: string, version: string): NotesMap {
    const map = readAll()
    delete map[noteKey(trackId, version)]
    writeAll(map)
    return map
  },

  /** Replace the entire store (used by import). */
  replaceAll(map: NotesMap): NotesMap {
    writeAll(map)
    return map
  },

  /** Serialize everything for backup/export. */
  export(): string {
    return JSON.stringify(readAll(), null, 2)
  },
}
