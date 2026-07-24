import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useGoalStore } from '@/store/useGoalStore'
import { Goal, GoalCategory } from '@/types/goal'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalModal } from '@/components/goals/GoalModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Plus,
  Target,
  Trophy,
  Clock,
  Calendar,
  Inbox
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

export function GoalsPage() {
  const { goals } = useGoalStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in_progress' | 'completed'>('all')
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'all'>('all')

  const handleEditGoal = (goal: Goal) => {
    setGoalToEdit(goal)
    setIsModalOpen(true)
  }

  const handleCreateGoal = () => {
    setGoalToEdit(null)
    setIsModalOpen(true)
  }

  // Filter goals
  const filteredGoals = goals.filter((g) => {
    if (selectedFilter === 'in_progress' && g.progress === 100) return false
    if (selectedFilter === 'completed' && g.progress < 100) return false
    if (selectedCategory !== 'all' && g.category !== selectedCategory) return false
    return true
  })

  // Stat metrics
  const totalGoals = goals.length
  const completedGoalsCount = goals.filter((g) => g.progress === 100).length
  const inProgressGoalsCount = goals.filter((g) => g.progress < 100).length

  // Goals target date within 14 days
  const today = new Date()
  const approachingTargetCount = goals.filter((g) => {
    if (g.progress === 100) return false
    const target = new Date(g.targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24))
    return diffDays >= 0 && diffDays <= 14
  }).length

  return (
    <PageContainer
      title="Goal Management"
      description="Set long-term objectives, break them into milestones, and track your overall progress."
      layoutId="layout-goals"
      action={
        <Button variant="glow" size="sm" onClick={handleCreateGoal} className="gap-2 font-semibold shadow-md">
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </Button>
      }
    >
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Goals</span>
            <Target className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-foreground">{totalGoals}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>In Progress</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{inProgressGoalsCount}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Completed</span>
            <Trophy className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{completedGoalsCount}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Due Soon (&lt;14d)</span>
            <Calendar className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400">{approachingTargetCount}</p>
        </Card>
      </div>

      {/* Filter Tabs & Category Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border/60 pb-3 text-xs">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1 bg-secondary/50 p-1 rounded-lg border border-border/50 w-full sm:w-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({goals.length})
          </button>
          <button
            onClick={() => setSelectedFilter('in_progress')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              selectedFilter === 'in_progress'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            In Progress ({inProgressGoalsCount})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              selectedFilter === 'completed'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed ({completedGoalsCount})
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <span className="text-muted-foreground text-[11px] font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as GoalCategory | 'all')}
            className="h-8 rounded-md border border-input bg-background/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="career">Career</option>
            <option value="skill">Skill</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/20 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No goals found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {goals.length === 0
              ? 'You have not set up any long-term goals yet. Click "New Goal" to define your targets!'
              : 'No goals match your current filter settings. Try clearing the filter.'}
          </p>
          <Button variant="outline" size="sm" onClick={handleCreateGoal} className="gap-1.5 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            <span>Create Goal</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={handleEditGoal} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goalToEdit={goalToEdit}
      />
    </PageContainer>
  )
}
