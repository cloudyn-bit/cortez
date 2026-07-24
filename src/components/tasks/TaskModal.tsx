import React, { useState, useEffect } from 'react'
import { Task, TaskPriority, TaskCategory } from '@/types/task'
import { useTaskStore } from '@/store/useTaskStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { X, Check, Calendar, AlertCircle, Tag, Flag } from 'lucide-react'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskToEdit?: Task | null
}

export function TaskModal({ isOpen, onClose, taskToEdit }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<TaskCategory>('study')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title)
      setDescription(taskToEdit.description || '')
      setCategory(taskToEdit.category)
      setPriority(taskToEdit.priority)
      setDueDate(taskToEdit.dueDate)
    } else {
      setTitle('')
      setDescription('')
      setCategory('study')
      setPriority('medium')
      setDueDate(new Date().toISOString().split('T')[0])
    }
    setError('')
  }, [taskToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Task title is required.')
      return
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate,
      })
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate,
        completed: false,
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
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
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
              <label className="text-xs font-semibold text-foreground">Task Title *</label>
              <Input
                placeholder="e.g., Read Chapter 3 on Quantum Mechanics"
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
                rows={3}
                placeholder="Additional instructions or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-md border border-input bg-background/50 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-indigo-400" /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="study">Study Notes</option>
                  <option value="quiz">Quiz Prep</option>
                  <option value="revision">Revision</option>
                  <option value="assignment">Assignment</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Flag className="h-3.5 w-3.5 text-amber-400" /> Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full h-9 rounded-md border border-input bg-background/50 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" /> Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-background/50 border-input text-xs"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50">
            <Button variant="outline" type="button" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="glow" type="submit" size="sm" className="gap-1.5 font-semibold">
              <Check className="h-4 w-4" />
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
