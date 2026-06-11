import { Link, useParams } from 'react-router-dom'
import { getTrack } from '../lib/catalog'
import { useNotes } from '../context/NotesContext'
import { ArrowLeft, ChevronRight } from '../components/Icons'
import { Rating } from '../components/Rating'

export function TrackPage() {
  const { trackId = '' } = useParams()
  const track = getTrack(trackId)
  const { notes } = useNotes()

  if (!track) {
    return (
      <>
        <Link to="/" className="backlink">
          <ArrowLeft /> All tracks
        </Link>
        <p className="center-note">That track doesn’t exist in your setups.</p>
      </>
    )
  }

  return (
    <>
      <Link to="/" className="backlink">
        <ArrowLeft /> All tracks
      </Link>

      <div className="pagehead">
        <p className="pagehead__eyebrow">
          {track.country || 'Circuit'}
          {track.round < 90 ? ` · Round ${track.round}` : ''}
        </p>
        <h1 className="pagehead__title">
          <span className="pagehead__flag" aria-hidden="true">
            {track.flag}
          </span>
          {track.name}
        </h1>
        <p className="pagehead__meta">
          {track.versions.length} version{track.versions.length === 1 ? '' : 's'} available
        </p>
      </div>

      <div className="vlist">
        {track.versions.map((v, i) => {
          const note = notes[`${track.id}::${v.version}`]
          const isLatest = i === 0
          return (
            <Link
              key={v.version}
              to={`/track/${track.id}/${encodeURIComponent(v.version)}`}
              className={`vrow ${isLatest ? 'vrow--latest' : ''}`}
            >
              <span className="vrow__ver">{v.version}</span>
              <div className="vrow__body">
                <div className="vrow__line1">
                  {isLatest && <span className="tag tag--latest">Latest</span>}
                  {note && note.rating > 0 && <Rating value={note.rating} />}
                </div>
                {note?.comment ? (
                  <p className="vrow__note">{note.comment}</p>
                ) : (
                  <p className="vrow__note vrow__note--empty">No notes yet</p>
                )}
              </div>
              <ChevronRight className="vrow__chev" />
            </Link>
          )
        })}
      </div>
    </>
  )
}
