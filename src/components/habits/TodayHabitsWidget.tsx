import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHabitStore } from '@/store/useHabitStore'
import { calculateStreakStats } from '@/lib/habits/streak'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Flame,
  Check,
  Plus,
  ArrowRight,
  Activity
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HabitModal } from './HabitModal'

export function TodayHabitsWidget() {
  const { habits, toggleHabitCompletion } = useHabitStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const completedTodayCount = habits.filter((h) =>
    calculateStreakStats(h.history, h.createdAt).completedToday
  ).length

  const completionPercentage =
    habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0

  return (
    <>
      <div className="h-full">
        <AnimatedCard layoutId="layout-habits" className="bg-card/40 border-border/80 hover:border-indigo-500/30 h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <Activity className="h-4 w-4 text-emerald-400" />
                Daily Habit Tracker
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {completedTodayCount} of {habits.length} habits completed today ({completionPercentage}%)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <MagneticButton
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="h-8 px-2.5 text-xs gap-1 border-border/60 rounded-lg"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </MagneticButton>
              <Link to="/habits">
                <MagneticButton variant="ghost" className="h-8 px-2 text-xs text-indigo-400 hover:text-indigo-300 gap-1 rounded-lg">
                  <span>All Habits</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </MagneticButton>
              </Link>
            </div>
          </CardHeader>

        <CardContent className="space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-secondary/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Habit Items */}
          {habits.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
              No habits created yet. Click "Add" to set up your first daily habit!
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <AnimatePresence mode="popLayout">
                {habits.slice(0, 4).map((habit) => {
                  const stats = calculateStreakStats(habit.history, habit.createdAt)
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      key={habit.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-black/20 hover:bg-black/40 shadow-inner transition-colors text-xs"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleHabitCompletion(habit.id)}
                          className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                            stats.completedToday
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                              : 'border-border/80 hover:border-indigo-400 text-transparent'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </motion.button>
                        <span
                          className={`truncate font-medium transition-colors duration-300 ${
                            stats.completedToday ? 'line-through text-muted-foreground/50' : 'text-foreground'
                          }`}
                        >
                          {habit.title}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 bg-amber-500/10 text-amber-300 border-transparent gap-1 font-bold"
                        >
                          <Flame className="h-3 w-3 fill-amber-400/20 text-amber-400" />
                          {stats.currentStreak}d
                        </Badge>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
        </AnimatedCard>
      </div>

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
