import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { evaluateCortezContext } from '@/lib/assistant/context'
import { getMotivationalMessage } from '@/lib/assistant/motivational'
import { computeAnalytics } from '@/lib/analytics/engine'
import { ArcReactorLogo } from '@/components/ui/ArcReactorLogo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  ChevronDown,
  Timer,
  CheckSquare,
  Flame,
  Target,
  FileText,
  BarChart3,
  Lightbulb,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface CortezAssistantCardProps {
  onOpenTaskModal?: () => void
  onOpenHabitModal?: () => void
  onOpenGoalModal?: () => void
  onOpenNoteModal?: () => void
}

export function CortezAssistantCard({
  onOpenTaskModal,
  onOpenHabitModal,
  onOpenGoalModal,
  onOpenNoteModal
}: CortezAssistantCardProps) {
  const navigate = useNavigate()
  const { tasks } = useTaskStore()
  const { habits } = useHabitStore()
  const { goals } = useGoalStore()
  const { notes } = useNoteStore()
  const { stats: pomodoroStats } = usePomodoroStore()

  const [isExpanded, setIsExpanded] = useState(true)

  const contextDataRef = useRef(evaluateCortezContext(tasks, habits, goals, notes, pomodoroStats))
  const analyticsRef = useRef(computeAnalytics(tasks, habits, goals, notes, pomodoroStats))

  const [message, setMessage] = useState('')

  useEffect(() => {
    const contextData = contextDataRef.current
    const analytics = analyticsRef.current

    const motivationalMessage = getMotivationalMessage({
      timeOfDay: contextData.timeOfDay,
      productivityScore: analytics.productivityScore,
      hasCompletedAllTasks: contextData.dueTasksCount === 0 && contextData.completedTasksTodayCount > 0,
      hasCompletedGoal: analytics.goalsCompleted > 0,
      hasMissedHabits: contextData.totalHabitsCount > 0 && contextData.habitsCompletedTodayCount < contextData.totalHabitsCount,
    }) || "Ready to make today count?"

    setMessage(`${contextData.greeting}. ${motivationalMessage}`)
  }, [])

  return (
    <Card className="relative overflow-hidden bg-[#0a0a0c]/80 border-indigo-500/10 hover:border-indigo-500/15 hover:translate-y-0 hover:shadow-xl">
      {/* Subtle ambient glow */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/10 via-violet-500/8 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center space-x-3">
          <ArcReactorLogo size={36} animate={true} glowIntensity="medium" />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Cortez</h3>
              <Badge variant="outline" className="text-[9px] bg-indigo-500/8 text-indigo-400 border-indigo-500/15 gap-1 font-semibold px-1.5">
                Active
              </Badge>
            </div>
            <p className="text-[11px] text-zinc-600 font-medium">Productivity companion</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-7 w-7 text-zinc-600 hover:text-white rounded-full"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 25 }}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.div>
        </Button>
      </div>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 pb-5 space-y-4 border-t border-white/[0.04] pt-3"
          >
            {/* Clean message — no typing indicator, no chatbot feel */}
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              {message}
            </p>

            {/* Context insights — clean grid */}
            {contextDataRef.current.insights.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-1.5">
                  <Lightbulb className="h-3 w-3 text-amber-400/70" />
                  Insights
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {contextDataRef.current.insights.map((insight, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-zinc-500 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-indigo-400/60 shrink-0" />
                      <span className="truncate">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions — subtle, minimal */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/pomodoro')}
                className="h-7 text-[11px] gap-1.5"
              >
                <Timer className="h-3 w-3 text-indigo-400" />
                Focus
              </Button>

              {onOpenTaskModal && (
                <Button variant="outline" size="sm" onClick={onOpenTaskModal} className="h-7 text-[11px] gap-1.5">
                  <CheckSquare className="h-3 w-3 text-emerald-400" />
                  Task
                </Button>
              )}

              {onOpenHabitModal && (
                <Button variant="outline" size="sm" onClick={onOpenHabitModal} className="h-7 text-[11px] gap-1.5">
                  <Flame className="h-3 w-3 text-amber-400" />
                  Habit
                </Button>
              )}

              {onOpenGoalModal && (
                <Button variant="outline" size="sm" onClick={onOpenGoalModal} className="h-7 text-[11px] gap-1.5">
                  <Target className="h-3 w-3 text-violet-400" />
                  Goal
                </Button>
              )}

              {onOpenNoteModal && (
                <Button variant="outline" size="sm" onClick={onOpenNoteModal} className="h-7 text-[11px] gap-1.5">
                  <FileText className="h-3 w-3 text-pink-400" />
                  Note
                </Button>
              )}

              <Link to="/analytics">
                <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5">
                  <BarChart3 className="h-3 w-3 text-cyan-400" />
                  Analytics
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
