// Domain types for the setup catalog.

export interface TrackMeta {
  /** Stable slug used in URLs, e.g. "monaco". */
  id: string
  /** Display name, e.g. "Monaco". */
  name: string
  /** Country / locale, e.g. "Monaco" or "Great Britain". */
  country: string
  /** Emoji flag for quick visual scanning. */
  flag: string
  /** Calendar position, used for default sort order. */
  round: number
}

export interface SetupVersion {
  /** Raw version string from the folder name, e.g. "1.3". */
  version: string
  /** Public URL Vite emits for the PDF asset. */
  pdfUrl: string
  /** Original PDF filename, kept for the "download" affordance. */
  fileName: string
}

export interface Track extends TrackMeta {
  /** Versions sorted newest-first. */
  versions: SetupVersion[]
}

export interface SetupNote {
  /** 0 = unrated, 1–5 stars. */
  rating: number
  /** Free-text note. */
  comment: string
  /** ISO timestamp of the last edit. */
  updatedAt: string
}
