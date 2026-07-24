import React, { useState, useEffect } from 'react'
import { Habit, HabitCategory } from '@/types/habit'
import { useHabitStore } from '@/store/useHabitStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { X, Check, Tag, Palette, AlertCircle } from 'lucide-react'

interface HabitModalProps {
  isOpen: boolean
  onClose: () => void
  habitToEdit?: Habit | null
}

const COLOR_OPTIONS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Cyan', value: '#06b6d4' },
]

export function HabitModal({ isOpen, onClose, habitToEdit }: HabitModalProps) {
  const { addHabit, editHabit } = useHabitStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<HabitCategory>('study')
  const [color, setColor] = useState('#6366f1')
  const [error, setError] = useState('')

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title)
      setDescription(habitToEdit.description || '')
      setCategory(habitToEdit.category)
      setColor(habitToEdit.color || '#6366f1')
    } else {
      setTitle('')
      setDescription('')
      setCategory('study')
      setColor('#6366f1')
    }
    setError('')
  }, [habitToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Habit title is required.')
      return
    }

    if (habitToEdit) {
      editHabit(habitToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        color,
      })
    } else {
      addHabit({
        title: title.trim(),
        description: description.trim(),
        category,
        color,
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <Card className="relative z-50 w-full max-w-lg bg-card/95 border-border shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
          <CardTitle className="text-lg font-bold text-foreground">
            {habitToEdit ? 'Edit Habit' : 'Create New Habit'}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Habit Name *</label>
              <Input
                placeholder="e.g., Read 20 pages of textbook"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/50 border-input text-xs"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Description (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g., Focus on Active Recall techniques..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-md border border-input bg-background/50 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-indigo-400" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="study">Study</option>
                <option value="quiz">Quiz Prep</option>
                <option value="revision">Revision</option>
                <option value="productivity">Productivity</option>
                <option value="health">Health</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="coding">Coding</option>
              </select>
            </div>

            {/* Color Accent Picker */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Palette className="h-3.5 w-3.5 text-purple-400" /> Color Accent
              </label>
              <div className="flex items-center space-x-3 pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${
                      color === c.value
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
            <Button variant="outline" type="button" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="glow" type="submit" size="sm" className="gap-1.5 font-semibold">
              <Check className="h-4 w-4" />
              <span>{habitToEdit ? 'Save Changes' : 'Create Habit'}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
