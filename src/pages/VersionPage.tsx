import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTrack } from '../lib/catalog'
import { useNotes } from '../context/NotesContext'
import { ArrowLeft, ExternalIcon, DownloadIcon, CheckIcon } from '../components/Icons'
import { Rating } from '../components/Rating'

type SaveState = 'idle' | 'editing' | 'saved'

export function VersionPage() {
  const { trackId = '', version: rawVersion = '' } = useParams()
  const version = decodeURIComponent(rawVersion)
  const navigate = useNavigate()
  const track = getTrack(trackId)
  const setup = track?.versions.find((v) => v.version === version)
  const { getNote, saveNote } = useNotes()

  const stored = track ? getNote(track.id, version) : undefined
  const [rating, setRating] = useState(stored?.rating ?? 0)
  const [comment, setComment] = useState(stored?.comment ?? '')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const debounce = useRef<number | undefined>(undefined)

  // Re-sync local state if the user navigates between versions in place.
  useEffect(() => {
    setRating(stored?.rating ?? 0)
    setComment(stored?.comment ?? '')
    setSaveState('idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, version])

  if (!track || !setup) {
    return (
      <>
        <Link to={`/track/${trackId}`} className="backlink">
          <ArrowLeft /> Back
        </Link>
        <p className="center-note">That version doesn’t exist.</p>
      </>
    )
  }

  const isLatest = track.versions[0]?.version === version

  function persist(nextRating: number, nextComment: string) {
    saveNote(track!.id, version, { rating: nextRating, comment: nextComment })
    setSaveState('saved')
  }

  function onRating(next: number) {
    setRating(next)
    persist(next, comment) // ratings save immediately
  }

  function onComment(next: string) {
    setComment(next)
    setSaveState('editing')
    window.clearTimeout(debounce.current)
    debounce.current = window.setTimeout(() => persist(rating, next), 600)
  }

  return (
    <>
      <Link to={`/track/${track.id}`} className="backlink">
        <ArrowLeft /> {track.name}
      </Link>

      <div className="pagehead">
        <p className="pagehead__eyebrow">
          {track.flag} {track.name}
        </p>
        <h1 className="pagehead__title">
          Version {version}
          {isLatest && <span className="tag tag--latest">Latest</span>}
        </h1>
      </div>

      {/* Quick hop between versions of this track */}
      {track.versions.length > 1 && (
        <div className="vswitch" role="tablist" aria-label="Versions">
          {track.versions.map((v) => {
            const active = v.version === version
            return (
              <button
                key={v.version}
                role="tab"
                aria-selected={active}
                className={`vswitch__chip ${active ? 'vswitch__chip--active' : ''}`}
                onClick={() =>
                  navigate(`/track/${track.id}/${encodeURIComponent(v.version)}`)
                }
              >
                {v.version === track.versions[0].version && <span className="vswitch__dot" />}
                {v.version}
              </button>
            )
          })}
        </div>
      )}

      <div className="actions" style={{ marginBottom: 18 }}>
        <a className="btn btn--primary" href={setup.pdfUrl} target="_blank" rel="noopener noreferrer">
          <ExternalIcon /> Open PDF
        </a>
        <a className="btn btn--ghost" href={setup.pdfUrl} download={setup.fileName}>
          <DownloadIcon /> Download
        </a>
      </div>

      <section className="panel">
        <h2 className="panel__title">Preview</h2>
        <iframe className="pdfframe" src={setup.pdfUrl} title={`${track.name} setup ${version}`} />
        <p className="pdf-hint">
          On some phones the inline preview is limited — use “Open PDF” for the full document.
        </p>
      </section>

      <section className="panel">
        <h2 className="panel__title">Your rating</h2>
        <div className="rating-row">
          <span className="rating-row__label">{rating > 0 ? `${rating} / 5` : 'Unrated'}</span>
          <Rating value={rating} onChange={onRating} size="lg" />
          {rating > 0 && (
            <button className="rating-clear" onClick={() => onRating(0)}>
              Clear
            </button>
          )}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel__title">Your notes</h2>
        <textarea
          className="noteinput"
          placeholder="What works, what to change, conditions you tested in…"
          value={comment}
          onChange={(e) => onComment(e.target.value)}
        />
        <div className={`savestate ${saveState === 'saved' ? 'savestate--saved' : ''}`}>
          {saveState === 'saved' && (
            <>
              <CheckIcon /> Saved
            </>
          )}
          {saveState === 'editing' && (
            <>
              <span className="savedot" /> Saving…
            </>
          )}
          {saveState === 'idle' && stored?.updatedAt && (
            <span>Last edited {new Date(stored.updatedAt).toLocaleDateString()}</span>
          )}
        </div>
      </section>
    </>
  )
}
