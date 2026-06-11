import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { SetupNote } from '../types'
import { storage, noteKey, type NotesMap } from '../lib/storage'

interface NotesContextValue {
  notes: NotesMap
  getNote: (trackId: string, version: string) => SetupNote | undefined
  saveNote: (trackId: string, version: string, value: Pick<SetupNote, 'rating' | 'comment'>) => void
  clearNote: (trackId: string, version: string) => void
  importNotes: (map: NotesMap) => void
  exportNotes: () => string
}

const NotesContext = createContext<NotesContextValue | null>(null)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<NotesMap>(() => storage.getAll())

  const getNote = useCallback(
    (trackId: string, version: string) => notes[noteKey(trackId, version)],
    [notes],
  )

  const saveNote = useCallback(
    (trackId: string, version: string, value: Pick<SetupNote, 'rating' | 'comment'>) => {
      setNotes(storage.set(trackId, version, value))
    },
    [],
  )

  const clearNote = useCallback((trackId: string, version: string) => {
    setNotes(storage.remove(trackId, version))
  }, [])

  const importNotes = useCallback((map: NotesMap) => {
    setNotes(storage.replaceAll(map))
  }, [])

  const exportNotes = useCallback(() => storage.export(), [])

  const value = useMemo<NotesContextValue>(
    () => ({ notes, getNote, saveNote, clearNote, importNotes, exportNotes }),
    [notes, getNote, saveNote, clearNote, importNotes, exportNotes],
  )

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within a NotesProvider')
  return ctx
}
