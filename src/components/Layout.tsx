import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SlidersIcon } from './Icons'
import { SettingsSheet } from './SettingsSheet'

function BrandMark() {
  // A minimal speedometer arc — instrument-panel nod, not a race-game logo.
  return (
    <svg className="brand__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="var(--border-strong)" strokeWidth="2" />
      <path d="M16 16 23 9" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.4" fill="var(--accent)" />
      <path
        d="M6.5 21a11 11 0 0 1 19 0"
        stroke="var(--text-faint)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="1.5 3"
      />
    </svg>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <Link to="/" className="brand" aria-label="Setup Garage home">
            <BrandMark />
            <span>
              <span className="brand__name">Setup Garage</span>
              <span className="brand__sub"> · F1 26</span>
            </span>
          </Link>
          <button className="iconbtn" onClick={() => setSettingsOpen(true)} aria-label="Notes &amp; settings">
            <SlidersIcon />
          </button>
        </div>
      </header>

      <main className="main">{children}</main>

      {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
    </div>
  )
}
