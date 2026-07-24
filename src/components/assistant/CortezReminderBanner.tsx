import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { Bell, X, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CortezReminderBanner() {
  const { tasks } = useTaskStore()
  const { habits } = useHabitStore()
  const { goals } = useGoalStore()

  const [reminder, setReminder] = useState<{ title: string; link: string } | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0]

    // 1. Check due tasks today
    const dueTasksToday = tasks.filter((t) => !t.completed && t.dueDate === todayStr)
    if (dueTasksToday.length > 0) {
      setReminder({
        title: `Reminder: You have ${dueTasksToday.length} task${dueTasksToday.length > 1 ? 's' : ''} due today!`,
        link: '/tasks',
      })
      return
    }

    // 2. Check missed habits today
    const missedHabitsToday = habits.filter((h) => !h.history.includes(todayStr))
    if (missedHabitsToday.length > 0) {
      setReminder({
        title: `Reminder: ${missedHabitsToday.length} habit${missedHabitsToday.length > 1 ? 's' : ''} remaining for today!`,
        link: '/habits',
      })
      return
    }

    // 3. Check goals near completion
    const closeGoals = goals.filter((g) => g.progress >= 75 && g.progress < 100)
    if (closeGoals.length > 0) {
      setReminder({
        title: `Goal Target: "${closeGoals[0].title}" is ${closeGoals[0].progress}% complete!`,
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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-indigo-600/15 border-b border-indigo-500/30 px-4 py-2 text-xs text-indigo-200 flex items-center justify-between backdrop-blur-md"
      >
        <div className="flex items-center space-x-2.5 truncate">
          <Bell className="h-3.5 w-3.5 text-indigo-400 shrink-0 animate-bounce" />
          <span className="font-medium truncate">{reminder.title}</span>
          <Link to={reminder.link} className="underline font-bold hover:text-white flex items-center gap-0.5 shrink-0 ml-2">
            <span>View</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-indigo-300 hover:text-white p-0.5 rounded shrink-0"
          aria-label="Dismiss Reminder"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
