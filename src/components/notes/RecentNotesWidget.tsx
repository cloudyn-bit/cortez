import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNoteStore } from '@/store/useNoteStore'
import { Note } from '@/types/note'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  FileText,
  Plus,
  ArrowRight,
  Pin,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { NoteEditorModal } from './NoteEditorModal'

export function RecentNotesWidget() {
  const { notes } = useNoteStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null)

  // 3 most recently updated notes
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)

  const handleOpenNote = (note: Note) => {
    setNoteToEdit(note)
    setIsModalOpen(true)
  }

  const handleCreateNote = () => {
    setNoteToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <>
      <motion.div layoutId="layout-notes" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="col-span-1 md:col-span-2">
      <Card className="bg-card/40 border-border/80 shadow-md hover:border-indigo-500/30 transition-all h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <FileText className="h-4 w-4 text-indigo-400" />
              Recent Study Notes
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Quick access to your active notes & Markdown study guides
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateNote}
              className="h-8 px-2.5 text-xs gap-1 border-border/60"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Note</span>
            </Button>
            <Link to="/notes">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-indigo-400 hover:text-indigo-300 gap-1">
                <span>All Notes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent>
          {recentNotes.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
              No notes created yet. Click "New Note" to start writing!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleOpenNote(note)}
                  className="group relative p-3 rounded-xl border border-border/50 bg-background/40 hover:bg-background/80 hover:border-indigo-500/40 transition-all cursor-pointer space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                        {note.title || 'Untitled Note'}
                      </h4>
                      {note.pinned && (
                        <Pin className="h-3 w-3 text-amber-400 fill-amber-400/20 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                      {note.content.replace(/[#*`>_-]/g, '').trim()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="rounded bg-secondary/50 px-1.5 py-0.5 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </motion.div>

      <NoteEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        noteToEdit={noteToEdit}
      />
    </>
  )
}
