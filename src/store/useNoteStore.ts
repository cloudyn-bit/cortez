import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Note } from '@/types/note'

interface NoteState {
  notes: Note[]
  addNote: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void
  deleteNote: (id: string) => void
  duplicateNote: (id: string) => void
  togglePin: (id: string) => void
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (noteData) => {
        const now = new Date().toISOString()
        const newNote: Note = {
          ...noteData,
          id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          // If pinned, insert at top of pinned notes; otherwise after pinned notes
          notes: [newNote, ...state.notes],
        }))

        return newNote
      },

      updateNote: (id, updates) => {
        const now = new Date().toISOString()
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: now }
              : note
          ),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }))
      },

      duplicateNote: (id) => {
        const target = get().notes.find((n) => n.id === id)
        if (!target) return

        const now = new Date().toISOString()
        const duplicate: Note = {
          ...target,
          id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: `${target.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          notes: [duplicate, ...state.notes],
        }))
      },

      togglePin: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, pinned: !note.pinned } : note
          ),
        }))
      },
    }),
    {
      name: 'lifeos-notes-storage',
    }
  )
)

export const getSortedAndFilteredNotes = (
  notes: Note[],
  searchQuery: string,
  selectedTag: string
): Note[] => {
  return notes
    .filter((note) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = note.title.toLowerCase().includes(q)
        const matchContent = note.content.toLowerCase().includes(q)
        const matchTags = note.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchTitle && !matchContent && !matchTags) return false
      }

      // Tag filter
      if (selectedTag !== 'all' && !note.tags.includes(selectedTag)) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Pinned notes always come first
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      // Secondary sort: most recently updated
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
}
