import React, { useState, useEffect } from 'react'
import { Goal, GoalCategory } from '@/types/goal'
import { useGoalStore } from '@/store/useGoalStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { X, Check, Calendar, Tag, AlertCircle, Plus, Trash2 } from 'lucide-react'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  goalToEdit?: Goal | null
}

export function GoalModal({ isOpen, onClose, goalToEdit }: GoalModalProps) {
  const { addGoal, editGoal } = useGoalStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<GoalCategory>('academic')
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  })
  const [initialMilestones, setInitialMilestones] = useState<string[]>(['', ''])
  const [error, setError] = useState('')

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title)
      setDescription(goalToEdit.description || '')
      setCategory(goalToEdit.category)
      setTargetDate(goalToEdit.targetDate)
      setInitialMilestones([])
    } else {
      setTitle('')
      setDescription('')
      setCategory('academic')
      const d = new Date()
      d.setDate(d.getDate() + 14)
      setTargetDate(d.toISOString().split('T')[0])
      setInitialMilestones(['Review core lecture notes', 'Complete practice exam'])
    }
    setError('')
  }, [goalToEdit, isOpen])

  if (!isOpen) return null

  const handleAddMilestoneField = () => {
    setInitialMilestones([...initialMilestones, ''])
  }

  const handleRemoveMilestoneField = (index: number) => {
    setInitialMilestones(initialMilestones.filter((_, idx) => idx !== index))
  }

  const handleMilestoneChange = (index: number, value: string) => {
    const updated = [...initialMilestones]
    updated[index] = value
    setInitialMilestones(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Goal title is required.')
      return
    }

    if (goalToEdit) {
      editGoal(goalToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        targetDate,
      })
    } else {
      addGoal(
        {
          title: title.trim(),
          description: description.trim(),
          category,
          targetDate,
        },
        initialMilestones
      )
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
            {goalToEdit ? 'Edit Goal' : 'Create New Goal'}
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
          <CardContent className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Goal Title *</label>
              <Input
                placeholder="e.g., Master Organic Chemistry Reactions"
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
                placeholder="Specific outcome or target objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-md border border-input bg-background/50 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              />
            </div>

            {/* Category & Target Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-indigo-400" /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GoalCategory)}
                  className="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="academic">Academic</option>
                  <option value="career">Career</option>
                  <option value="skill">Skill</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              {/* Target Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" /> Target Date
                </label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-background/50 border-input text-xs"
                />
              </div>
            </div>

            {/* Initial Milestones Builder (Only when creating new goal) */}
            {!goalToEdit && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Initial Milestones Checklist
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMilestoneField}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {initialMilestones.map((mTitle, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        placeholder={`Milestone ${idx + 1}...`}
                        value={mTitle}
                        onChange={(e) => handleMilestoneChange(idx, e.target.value)}
                        className="bg-background/50 border-input text-xs"
                      />
                      {initialMilestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestoneField(idx)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
            <Button variant="outline" type="button" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="glow" type="submit" size="sm" className="gap-1.5 font-semibold">
              <Check className="h-4 w-4" />
              <span>{goalToEdit ? 'Save Changes' : 'Create Goal'}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
