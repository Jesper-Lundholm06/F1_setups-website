import { useRef } from 'react'
import { useNotes } from '../context/NotesContext'
import type { NotesMap } from '../lib/storage'
import { DownloadIcon } from './Icons'

export function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { notes, exportNotes, importNotes } = useNotes()
  const fileRef = useRef<HTMLInputElement>(null)
  const count = Object.keys(notes).length

  function handleExport() {
    const blob = new Blob([exportNotes()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `f1-setup-notes-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as NotesMap
        if (parsed && typeof parsed === 'object') {
          importNotes(parsed)
          onClose()
        } else {
          alert('That file did not contain valid notes.')
        }
      } catch {
        alert('That file could not be read as JSON.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="sheet-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Settings">
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h2 className="sheet__title">Your notes &amp; ratings</h2>
        <p className="sheet__text">
          Notes and ratings are saved in this browser. Back them up or move them to another device
          with export / import. You currently have {count} saved {count === 1 ? 'entry' : 'entries'}.
        </p>

        <div className="sheet__actions">
          <button className="iconbtn" style={{ height: 48, justifyContent: 'flex-start' }} onClick={handleExport}>
            <DownloadIcon />
            Export as JSON
          </button>

          <button
            className="iconbtn"
            style={{ height: 48, justifyContent: 'flex-start' }}
            onClick={() => fileRef.current?.click()}
          >
            <DownloadIcon style={{ transform: 'rotate(180deg)' }} />
            Import from JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleImportFile(f)
              e.target.value = ''
            }}
          />
        </div>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <button className="linklike" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
