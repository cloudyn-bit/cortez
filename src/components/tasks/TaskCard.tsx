import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task, TaskPriority, TaskCategory } from '@/types/task'
import { useTaskStore } from '@/store/useTaskStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare,
  Square,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  AlertCircle,
  Tag
} from 'lucide-react'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskComplete, deleteTask } = useTaskStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const priorityStyles: Record<TaskPriority, { label: string; badgeClass: string }> = {
    urgent: {
      label: 'Urgent',
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    },
    high: {
      label: 'High',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    medium: {
      label: 'Medium',
      badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
    },
    low: {
      label: 'Low',
      badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
    }
  }

  const categoryLabels: Record<TaskCategory, string> = {
    study: 'Study Notes',
    quiz: 'Quiz Prep',
    revision: 'Revision',
    assignment: 'Assignment',
    personal: 'Personal'
  }

  // Calculate due date status
  const getDueDateStatus = (dueDateStr: string) => {
    const today = new Date().toISOString().split('T')[0]
    if (dueDateStr < today) {
      return { label: 'Overdue', isOverdue: true, isToday: false }
    }
    if (dueDateStr === today) {
      return { label: 'Due Today', isOverdue: false, isToday: true }
    }
    return { label: dueDateStr, isOverdue: false, isToday: false }
  }

  const dueStatus = getDueDateStatus(task.dueDate)
  const priorityInfo = priorityStyles[task.priority]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative rounded-xl border p-4 transition-all duration-200 shadow-sm hover:shadow-md ${
        task.completed
          ? 'bg-card/20 border-border/40 opacity-75'
          : 'bg-card/50 border-border/80 hover:border-indigo-500/40 hover:bg-card/75'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox + Title / Description */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <button
            onClick={() => toggleTaskComplete(task.id)}
            className="mt-0.5 text-muted-foreground hover:text-indigo-400 transition-colors focus:outline-none"
            aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
          >
            {task.completed ? (
              <CheckSquare className="h-5 w-5 text-indigo-400" />
            ) : (
              <Square className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            )}
          </button>

          <div className="space-y-1 min-w-0 flex-1">
            <h4
              className={`text-sm font-semibold truncate transition-colors ${
                task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Badges & Metadata */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {/* Category */}
              <Badge variant="outline" className="text-[10px] py-0 px-2 bg-secondary/40 border-border/60 text-secondary-foreground">
                <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                {categoryLabels[task.category]}
              </Badge>

              {/* Priority */}
              <Badge variant="outline" className={`text-[10px] py-0 px-2 border ${priorityInfo.badgeClass}`}>
                {priorityInfo.label}
              </Badge>

              {/* Due Date */}
              <span
                className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  dueStatus.isOverdue
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold'
                    : dueStatus.isToday
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-secondary/30 text-muted-foreground border-border/50'
                }`}
              >
                {dueStatus.isOverdue ? (
                  <AlertCircle className="h-3 w-3 mr-1 text-rose-400" />
                ) : (
                  <Calendar className="h-3 w-3 mr-1" />
                )}
                {dueStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Task actions"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 rounded-lg border border-border bg-card p-1 shadow-xl z-30 animate-in fade-in duration-150">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onEdit(task)
                }}
                className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false)
                  deleteTask(task.id)
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
    </motion.div>
  )
}
