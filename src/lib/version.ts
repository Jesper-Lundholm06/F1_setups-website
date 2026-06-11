/**
 * Compare two version strings like "1.0", "1.10", "2.1" by numeric segments.
 * Returns a negative number if a < b, positive if a > b, 0 if equal.
 *
 * Plain string sorting would put "1.10" before "1.2", so we compare each
 * dot-separated segment as a number. Non-numeric segments fall back to a
 * locale string compare so e.g. "1.0-rc1" still orders sensibly.
 */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.')
  const pb = b.split('.')
  const len = Math.max(pa.length, pb.length)

  for (let i = 0; i < len; i++) {
    const sa = pa[i] ?? '0'
    const sb = pb[i] ?? '0'
    const na = Number(sa)
    const nb = Number(sb)

    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      if (na !== nb) return na - nb
    } else {
      const cmp = sa.localeCompare(sb, undefined, { numeric: true })
      if (cmp !== 0) return cmp
    }
  }
  return 0
}
