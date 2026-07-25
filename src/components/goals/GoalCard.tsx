import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Goal, GoalCategory } from '@/types/goal'
import { useGoalStore } from '@/store/useGoalStore'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  Calendar,
  CheckSquare,
  Square,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Trophy,
  Tag
} from 'lucide-react'

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const { toggleMilestone, addMilestone, deleteMilestone, deleteGoal, editMilestone } = useGoalStore()
  
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null)
  const [editingMilestoneTitle, setEditingMilestoneTitle] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAddMilestone, setShowAddMilestone] = useState(false)

  const isCompleted = goal.progress === 100
  const completedMilestonesCount = goal.milestones.filter((m) => m.completed).length

  const categoryLabels: Record<GoalCategory, string> = {
    academic: 'Academic',
    career: 'Career',
    skill: 'Skill',
    personal: 'Personal'
  }

  // Format target date and days remaining
  const getTargetDateInfo = (targetDateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(targetDateStr)
    target.setHours(0, 0, 0, 0)

    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24))

    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true }
    if (diffDays === 0) return { text: 'Target is Today', isToday: true }
    return { text: `${diffDays} days left`, days: diffDays }
  }

  const dateInfo = getTargetDateInfo(goal.targetDate)

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMilestoneTitle.trim()) {
      addMilestone(goal.id, newMilestoneTitle.trim())
      setNewMilestoneTitle('')
      setShowAddMilestone(false)
    }
  }

  const handleSaveMilestoneEdit = (milestoneId: string) => {
    if (editingMilestoneTitle.trim()) {
      editMilestone(goal.id, milestoneId, editingMilestoneTitle.trim())
      setEditingMilestoneId(null)
    }
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
      className={`group relative p-5 flex flex-col justify-between ${
        isCompleted
          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-emerald-500/10'
          : 'bg-card/40 border-border/80 hover:border-indigo-500/40'
      }`}
    >
      <div className="space-y-4">
        {/* Header: Category Badge + Options Menu */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-2 bg-secondary/40 border-border/60 text-secondary-foreground"
            >
              <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
              {categoryLabels[goal.category] || goal.category}
            </Badge>

            {isCompleted && (
              <Badge variant="outline" className="text-[10px] py-0 px-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold gap-1">
                <Trophy className="h-3 w-3 text-emerald-400" />
                Goal Completed!
              </Badge>
            )}
          </div>

          <div className="relative">
            <MagneticButton
              variant="ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Goal options"
            >
              <MoreVertical className="h-4 w-4" />
            </MagneticButton>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded-lg border border-border bg-card p-1 shadow-xl z-30 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    onEdit(goal)
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    deleteGoal(goal.id)
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

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground group-hover:text-indigo-400 transition-colors flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
              {goal.title}
            </span>
          </h3>
          {goal.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {goal.description}
            </p>
          )}
        </div>

        {/* Target Date Banner */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            Target: {goal.targetDate}
          </span>
          <span
            className={`font-semibold text-[11px] px-2 py-0.5 rounded-full border ${
              dateInfo.isOverdue && !isCompleted
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : isCompleted
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-secondary/40 text-muted-foreground border-border/50'
            }`}
          >
            {isCompleted ? 'Finished' : dateInfo.text}
          </span>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-muted-foreground text-[11px]">Milestones Progress</span>
            <span className={isCompleted ? 'text-emerald-400 font-extrabold' : 'text-indigo-400 font-extrabold'}>
              {goal.progress}%
            </span>
          </div>

          <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
              }`}
            />
          </div>
        </div>

        {/* Milestone Checklist Section */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              Checklist ({completedMilestonesCount}/{goal.milestones.length})
            </span>

            <button
              onClick={() => setShowAddMilestone(!showAddMilestone)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Inline Add Milestone Form */}
          {showAddMilestone && (
            <form onSubmit={handleAddMilestoneSubmit} className="flex items-center gap-2 pt-1">
              <Input
                placeholder="New milestone..."
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="h-8 text-xs bg-background/50 border-input"
                autoFocus
              />
              <MagneticButton type="submit" variant="primary" className="h-8 text-xs px-3 rounded-lg">
                Save
              </MagneticButton>
            </form>
          )}

          {/* Milestone List */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {goal.milestones.map((milestone) => (
                <motion.div
                  key={milestone.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-background/40 hover:bg-background/80 transition-colors border border-border/40 text-xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleMilestone(goal.id, milestone.id)}
                      className="text-muted-foreground hover:text-indigo-400 focus:outline-none shrink-0"
                    >
                      {milestone.completed ? (
                        <CheckSquare className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>

                    {editingMilestoneId === milestone.id ? (
                      <Input
                        value={editingMilestoneTitle}
                        onChange={(e) => setEditingMilestoneTitle(e.target.value)}
                        onBlur={() => handleSaveMilestoneEdit(milestone.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveMilestoneEdit(milestone.id)
                        }}
                        className="h-7 text-xs bg-background border-input py-0 px-2"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`truncate font-medium ${
                          milestone.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}
                      >
                        {milestone.title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingMilestoneId(milestone.id)
                        setEditingMilestoneTitle(milestone.title)
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Edit milestone"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteMilestone(goal.id, milestone.id)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                      title="Delete milestone"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {goal.milestones.length === 0 && (
              <p className="text-[11px] text-muted-foreground text-center py-2 border border-dashed border-border/40 rounded-lg">
                No milestones yet. Click "Add" above to break this goal down!
              </p>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  )
}
