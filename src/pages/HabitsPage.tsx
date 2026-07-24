import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useHabitStore } from '@/store/useHabitStore'
import { Habit, HabitCategory } from '@/types/habit'
import { calculateStreakStats } from '@/lib/habits/streak'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitModal } from '@/components/habits/HabitModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Plus,
  Flame,
  CheckCircle2,
  Trophy,
  Activity,
  Inbox
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

export function HabitsPage() {
  const { habits } = useHabitStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all')

  const handleEditHabit = (habit: Habit) => {
    setHabitToEdit(habit)
    setIsModalOpen(true)
  }

  const handleCreateHabit = () => {
    setHabitToEdit(null)
    setIsModalOpen(true)
  }

  // Filter habits
  const filteredHabits = habits.filter((h) =>
    selectedCategory === 'all' ? true : h.category === selectedCategory
  )

  // Overall metrics calculation
  const totalHabits = habits.length
  const completedTodayCount = habits.filter((h) =>
    calculateStreakStats(h.history, h.createdAt).completedToday
  ).length

  const totalActiveStreaks = habits.reduce(
    (acc, h) => acc + calculateStreakStats(h.history, h.createdAt).currentStreak,
    0
  )

  const avgCompletionRate =
    habits.length > 0
      ? Math.round(
          habits.reduce(
            (acc, h) => acc + calculateStreakStats(h.history, h.createdAt).completionPercentage,
            0
          ) / habits.length
        )
      : 0

  return (
    <PageContainer
      title="Habit Tracker"
      description="Build consistent routines and maintain daily productivity streaks."
      layoutId="layout-habits"
      action={
        <Button variant="glow" size="sm" onClick={handleCreateHabit} className="gap-2 font-semibold shadow-md">
          <Plus className="h-4 w-4" />
          <span>New Habit</span>
        </Button>
      }
    >
      {/* Stat Cards Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Habits</span>
            <Activity className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-foreground">{totalHabits}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Completed Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {completedTodayCount} / {totalHabits}
          </p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Streaks</span>
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          </div>
          <p className="text-2xl font-black text-amber-400">{totalActiveStreaks} days</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Avg Consistency</span>
            <Trophy className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400">{avgCompletionRate}%</p>
        </Card>
      </div>

      {/* Category Filter Pills */}
      <div className="flex overflow-x-auto gap-2 border-b border-border/60 pb-2 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          All Categories ({habits.length})
        </button>
        {(['study', 'productivity', 'health', 'mindfulness', 'coding'] as HabitCategory[]).map(
          (cat) => {
            const count = habits.filter((h) => h.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                {cat} ({count})
              </button>
            )
          }
        )}
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/20 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No habits found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {habits.length === 0
              ? 'You have not set up any habits yet. Click "New Habit" to start building your streak!'
              : 'No habits match your selected category. Try selecting "All Categories".'}
          </p>
          <Button variant="outline" size="sm" onClick={handleCreateHabit} className="gap-1.5 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            <span>Create Habit</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredHabits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onEdit={handleEditHabit} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Habit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habitToEdit={habitToEdit}
      />
    </PageContainer>
  )
}
