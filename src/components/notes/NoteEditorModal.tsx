import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Note } from '@/types/note'
import { useNoteStore } from '@/store/useNoteStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  X,
  Check,
  Pin,
  Eye,
  Edit3,
  Tag,
  Plus,
  Cloud,
  Loader2,
  Trash2,
  Copy
} from 'lucide-react'

interface NoteEditorModalProps {
  isOpen: boolean
  onClose: () => void
  noteToEdit?: Note | null
}

export function NoteEditorModal({ isOpen, onClose, noteToEdit }: NoteEditorModalProps) {
  const { addNote, updateNote, deleteNote, duplicateNote } = useNoteStore()

  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [pinned, setPinned] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved')

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (noteToEdit) {
      setCurrentNoteId(noteToEdit.id)
      setTitle(noteToEdit.title)
      setContent(noteToEdit.content)
      setTags(noteToEdit.tags || [])
      setPinned(noteToEdit.pinned || false)
    } else {
      setCurrentNoteId(null)
      setTitle('')
      setContent('')
      setTags(['Study'])
      setPinned(false)
    }
    setMode('edit')
    setSaveStatus('saved')
    isInitialMount.current = true
  }, [noteToEdit, isOpen])

  // Autosave logic with 600ms debounce
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!isOpen) return

    setSaveStatus('saving')

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (currentNoteId) {
        updateNote(currentNoteId, {
          title: title.trim() || 'Untitled Note',
          content,
          tags,
          pinned,
        })
      } else if (title.trim() || content.trim()) {
        const created = addNote({
          title: title.trim() || 'Untitled Note',
          content,
          tags,
          pinned,
        })
        setCurrentNoteId(created.id)
      }
      setSaveStatus('saved')
    }, 600)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [title, content, tags, pinned])

  if (!isOpen) return null

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Editor Modal */}
      <Card className="relative z-50 w-full max-w-3xl h-[85vh] bg-card/95 border-border shadow-2xl backdrop-blur-xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50 space-y-0">
          <div className="flex items-center space-x-3">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center space-x-1 bg-secondary/50 p-1 rounded-lg border border-border/50 text-xs">
              <button
                type="button"
                onClick={() => setMode('edit')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                  mode === 'edit'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                  mode === 'preview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </button>
            </div>

            {/* Pin Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPinned(!pinned)}
              className={`h-8 px-2.5 text-xs gap-1.5 ${
                pinned ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'text-muted-foreground'
              }`}
            >
              <Pin className={`h-3.5 w-3.5 ${pinned ? 'fill-amber-400/30 text-amber-400' : ''}`} />
              <span>{pinned ? 'Pinned' : 'Pin'}</span>
            </Button>
          </div>

          {/* Right Header Actions: Autosave Indicator & Close */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Cloud className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Saved</span>
                </>
              )}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Editor Body */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Note Title Input */}
          <input
            type="text"
            placeholder="Note Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-black bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 tracking-tight"
          />

          {/* Tag Manager Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-border/40 text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-indigo-400" /> Tags:
            </span>
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-secondary/40 border-border/60 text-secondary-foreground gap-1 pr-1"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-400 text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            <form onSubmit={handleAddTag} className="inline-flex items-center gap-1">
              <Input
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="h-6 w-24 text-[11px] bg-background/50 border-input py-0 px-2"
              />
              <button type="submit" className="text-indigo-400 hover:text-indigo-300">
                <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Editor / Markdown Preview */}
          {mode === 'edit' ? (
            <textarea
              rows={15}
              placeholder="Write your study notes in Markdown... (e.g. # Chapter Title, **bold text**, - list items)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(100%-80px)] p-3 rounded-lg border border-border/50 bg-background/40 text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring resize-none leading-relaxed"
            />
          ) : (
            <div className="prose prose-invert max-w-none p-4 rounded-lg bg-background/40 border border-border/50 text-sm min-h-[300px]">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">No Markdown content to preview...</p>
              )}
            </div>
          )}
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="flex items-center justify-between border-t border-border/50 pt-3">
          <div className="flex items-center space-x-2">
            {currentNoteId && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    duplicateNote(currentNoteId)
                    onClose()
                  }}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Duplicate</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deleteNote(currentNoteId)
                    onClose()
                  }}
                  className="h-8 text-xs text-rose-400 hover:bg-rose-500/10 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </Button>
              </>
            )}
          </div>

          <Button variant="glow" size="sm" onClick={onClose} className="gap-1.5 font-semibold">
            <Check className="h-4 w-4" />
            <span>Done</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
