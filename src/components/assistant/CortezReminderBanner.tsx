import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { X, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TypingAnimation } from '@/components/ui/TypingAnimation'

export function CortezReminderBanner() {
  const { tasks } = useTaskStore()
  const { habits } = useHabitStore()
  const { goals } = useGoalStore()

  const [reminder, setReminder] = useState<{ title: string; link: string } | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0]

    const dueTasksToday = tasks.filter((t) => !t.completed && t.dueDate === todayStr)
    if (dueTasksToday.length > 0) {
      setReminder({
        title: `${dueTasksToday.length} task${dueTasksToday.length > 1 ? 's' : ''} due today`,
        link: '/tasks',
      })
      return
    }

    const missedHabitsToday = habits.filter((h) => !h.history.includes(todayStr))
    if (missedHabitsToday.length > 0) {
      setReminder({
        title: `${missedHabitsToday.length} habit${missedHabitsToday.length > 1 ? 's' : ''} remaining`,
        link: '/habits',
      })
      return
    }

    const closeGoals = goals.filter((g) => g.progress >= 75 && g.progress < 100)
    if (closeGoals.length > 0) {
      setReminder({
        title: `"${closeGoals[0].title}" is ${closeGoals[0].progress}% complete`,
        link: '/goals',
      })
      return
    }

    setReminder(null)
  }, [tasks, habits, goals])

  if (!reminder || isDismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className="bg-indigo-500/[0.06] border-b border-indigo-500/10 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3 truncate">
          <div className="h-1 w-1 rounded-full bg-indigo-400 shrink-0" />
          <TypingAnimation text={reminder.title} idKey={reminder.title} className="font-medium truncate" speed={40} />
          <Link to={reminder.link} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 shrink-0 font-semibold transition-colors">
            <span>View</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-zinc-600 hover:text-zinc-400 p-0.5 rounded shrink-0 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
