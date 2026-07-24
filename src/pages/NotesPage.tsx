import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useNoteStore, getSortedAndFilteredNotes } from '@/store/useNoteStore'
import { Note } from '@/types/note'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteEditorModal } from '@/components/notes/NoteEditorModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  FileText,
  Pin,
  Tag,
  RotateCcw,
  Inbox
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

export function NotesPage() {
  const { notes } = useNoteStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const filteredNotes = getSortedAndFilteredNotes(notes, searchQuery, selectedTag)

  // Collect all unique tags across notes
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)))

  const pinnedNotes = filteredNotes.filter((n) => n.pinned)
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned)

  const handleEditNote = (note: Note) => {
    setNoteToEdit(note)
    setIsModalOpen(true)
  }

  const handleCreateNote = () => {
    setNoteToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <PageContainer
      title="Notes Workspace"
      description="Distraction-free Markdown note-taking with instant search, tagging, pinning, and autosave."
      action={
        <Button variant="glow" size="sm" onClick={handleCreateNote} className="gap-2 font-semibold shadow-md">
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </Button>
      }
    >
      {/* Search & Tag Filter Bar */}
      <div className="space-y-3 bg-card/30 p-4 rounded-xl border border-border/60 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 border-input text-xs"
            />
          </div>

          {/* Reset button */}
          {(searchQuery || selectedTag !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedTag('all')
              }}
              className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filter
            </Button>
          )}
        </div>

        {/* Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-border/40 text-xs">
            <span className="text-muted-foreground text-[11px] font-semibold flex items-center gap-1 shrink-0">
              <Tag className="h-3 w-3 text-indigo-400" /> Filter Tag:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedTag === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              All ({notes.length})
            </button>
            {allTags.map((tag) => {
              const count = notes.filter((n) => n.tags.includes(tag)).length
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {tag} ({count})
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Notes Display Section */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/20 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No notes found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {notes.length === 0
              ? 'Your notes workspace is empty. Click "New Note" to create your first Markdown study guide!'
              : 'No notes match your search or tag filter criteria.'}
          </p>
          <Button variant="outline" size="sm" onClick={handleCreateNote} className="gap-1.5 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            <span>Create Note</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Pin className="h-3.5 w-3.5 fill-amber-400/20" />
                Pinned Notes ({pinnedNotes.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {pinnedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} onEdit={handleEditNote} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* All / Unpinned Notes Section */}
          {unpinnedNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Other Notes ({unpinnedNotes.length})
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {unpinnedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} onEdit={handleEditNote} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        noteToEdit={noteToEdit}
      />
    </PageContainer>
  )
}
