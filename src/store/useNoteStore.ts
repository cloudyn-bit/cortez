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

const defaultSeedNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Roman Republic Law & Senate Structure',
    content: `# Roman Republic Governance

The Roman Republic operated on a complex system of checks and balances between magistrate assemblies, the Senate, and tribunes.

## Key Executive Roles:
- **Consuls**: Two elected chief executives holding civil and military imperium.
- **Praetors**: Judicial commanders presiding over courts.
- **Tribunes**: Plebeian champions holding sacred veto power (*intercessio*).

> "The Senate proposed, the assemblies enacted, the magistrates executed."`,
    tags: ['History', 'Roman Empire', 'Law'],
    pinned: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Quantum Wave Mechanics & Schrödinger Equation',
    content: `# Quantum Wave Mechanics

The time-dependent Schrödinger equation governs how physical wavefunctions evolve over time:

\`\`\`physics
iħ (∂Ψ/∂t) = ĤΨ
\`\`\`

### Fundamental Postulates:
1. **Wavefunction**: State of a particle represented by complex value \`Ψ(x,t)\`.
2. **Probability Density**: Probability of finding particle is \`|Ψ(x,t)|²\`.
3. **Superposition**: Linear combination of eigen-states.`,
    tags: ['Physics', 'Quantum'],
    pinned: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'note-3',
    title: 'Organic Chemistry SN1 vs SN2 Reactions',
    content: `# Nucleophilic Substitutions

Comparing Bimolecular (SN2) and Unimolecular (SN1) reaction mechanisms.

## SN2 Mechanism:
- Concerted one-step reaction
- Inversion of stereochemistry (Walden inversion)
- Favored by strong nucleophiles and polar aprotic solvents

## SN1 Mechanism:
- Two-step mechanism via carbocation intermediate
- Racemization of stereocenter
- Favored by tertiary substrates and polar protic solvents`,
    tags: ['Chemistry', 'SN1/SN2'],
    pinned: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
]

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: defaultSeedNotes,

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
      name: 'cortez-notes-storage',
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
