import { useState } from 'react'
import { Note } from '@/types/note'
import { useNoteStore } from '@/store/useNoteStore'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { Badge } from '@/components/ui/badge'
import {
  Pin,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Tag,
  Clock,
  FileText
} from 'lucide-react'

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const { togglePin, duplicateNote, deleteNote } = useNoteStore()
  const [menuOpen, setMenuOpen] = useState(false)

  // Strip markdown symbols for clean card content preview
  const previewSnippet = note.content
    .replace(/[#*`>_-]/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim()

  // Format relative timestamp
  const getRelativeTime = (isoString: string) => {
    const now = new Date().getTime()
    const updated = new Date(isoString).getTime()
    const diffMin = Math.round((now - updated) / 60000)

    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHours = Math.round(diffMin / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.round(diffHours / 24)
    return `${diffDays}d ago`
  }

  return (
    <AnimatedCard
      layout
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      tilt={!menuOpen}
      parallax={!menuOpen}
      className={`group relative p-5 flex flex-col justify-between cursor-pointer ${
        note.pinned
          ? 'bg-card/70 border-indigo-500/40 shadow-indigo-500/10'
          : 'bg-card/40 border-border/80 hover:border-indigo-500/40'
      }`}
      onClick={() => onEdit(note)}
    >
      <div className="space-y-3">
        {/* Header: Title & Pin Badge / Menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
            <h3 className="text-base font-bold text-foreground truncate group-hover:text-indigo-400 transition-colors">
              {note.title || 'Untitled Note'}
            </h3>
          </div>

          <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <MagneticButton
              variant="ghost"
              onClick={() => togglePin(note.id)}
              className={`h-7 w-7 rounded-full transition-colors ${
                note.pinned
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100'
              }`}
              title={note.pinned ? 'Unpin note' : 'Pin note to top'}
            >
              <Pin className={`h-4 w-4 ${note.pinned ? 'fill-amber-400/20' : ''}`} />
            </MagneticButton>

            <div className="relative">
              <MagneticButton
                variant="ghost"
                onClick={() => setMenuOpen(!menuOpen)}
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                aria-label="Note options"
              >
                <MoreVertical className="h-4 w-4" />
              </MagneticButton>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 rounded-lg border border-border bg-card p-1 shadow-xl z-30 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit(note)
                    }}
                    className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      duplicateNote(note.id)
                    }}
                    className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      deleteNote(note.id)
                    }}
                    className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Preview Snippet */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-sans">
          {previewSnippet || 'No content...'}
        </p>
      </div>

      {/* Footer: Tags & Timestamp */}
      <div className="pt-4 border-t border-border/40 mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-[10px] py-0 px-2 bg-secondary/40 border-border/60 text-secondary-foreground"
            >
              <Tag className="h-2.5 w-2.5 mr-1 text-indigo-400" />
              {tag}
            </Badge>
          ))}
        </div>

        <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
          <Clock className="h-3 w-3" />
          {getRelativeTime(note.updatedAt)}
        </span>
      </div>
    </AnimatedCard>
  )
}
