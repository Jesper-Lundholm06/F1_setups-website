import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATALOG, latestVersion } from '../lib/catalog'
import { useNotes } from '../context/NotesContext'
import { noteKey } from '../lib/storage'
import { SearchIcon } from '../components/Icons'
import { Rating } from '../components/Rating'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { notes } = useNotes()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATALOG
    return CATALOG.filter(
      (t) => t.name.toLowerCase().includes(q) || t.country.toLowerCase().includes(q),
    )
  }, [query])

  if (CATALOG.length === 0) {
    return <EmptyCatalog />
  }

  return (
    <>
      <div className="pagehead">
        <p className="pagehead__eyebrow">{CATALOG.length} tracks</p>
        <h1 className="pagehead__title">Setups</h1>
        <p className="pagehead__meta">Pick a track to see every version, your notes and ratings.</p>
      </div>

      <div className="search">
        <SearchIcon className="search__icon" />
        <input
          className="search__input"
          type="search"
          inputMode="search"
          placeholder="Search a track…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tracks"
          autoComplete="off"
        />
        {query && <span className="search__count">{filtered.length}</span>}
      </div>

      {filtered.length === 0 ? (
        <p className="center-note">No track matches “{query}”.</p>
      ) : (
        <div className="grid">
          {filtered.map((track) => {
            const latest = latestVersion(track)
            const latestNote = latest ? notes[noteKey(track.id, latest)] : undefined
            return (
              <Link key={track.id} to={`/track/${track.id}`} className="card">
                <div className="card__top">
                  <span className="card__flag" aria-hidden="true">
                    {track.flag}
                  </span>
                  {track.round < 90 && <span className="card__round">R{track.round}</span>}
                </div>
                <div>
                  <h2 className="card__name">{track.name}</h2>
                  {track.country && <p className="card__country">{track.country}</p>}
                </div>
                <div className="card__foot">
                  <span className="card__versions">
                    {track.versions.length} ver{track.versions.length === 1 ? '' : 's'}
                    {latest ? ` · ${latest}` : ''}
                  </span>
                  {latestNote && latestNote.rating > 0 && <Rating value={latestNote.rating} />}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

function EmptyCatalog() {
  return (
    <div className="empty">
      <div className="empty__icon" aria-hidden="true">
        🅿️
      </div>
      <h1 className="empty__title">No setups found yet</h1>
      <p className="empty__text">
        Add your PDF packages under <code>/setups/&lt;version&gt;/</code> in the repository — for
        example <code>setups/1.0/F1 26 Monaco complete package.pdf</code> — then push to GitHub.
        Netlify rebuilds and they show up here automatically.
      </p>
    </div>
  )
}
