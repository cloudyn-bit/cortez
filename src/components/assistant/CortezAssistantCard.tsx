import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { evaluateCortezContext } from '@/lib/assistant/context'
import { getMotivationalMessage } from '@/lib/assistant/motivational'
import { computeAnalytics } from '@/lib/analytics/engine'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Timer,
  PlusCircle,
  CheckSquare,
  Flame,
  Target,
  FileText,
  BarChart3,
  Lightbulb,
  Zap,
  MessageSquare
} from 'lucide-react'

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
  const [typedMessage, setTypedMessage] = useState('')

  const contextData = evaluateCortezContext(tasks, habits, goals, notes, pomodoroStats)
  const analytics = computeAnalytics(tasks, habits, goals, notes, pomodoroStats)

  const motivationalMessage = getMotivationalMessage({
    timeOfDay: contextData.timeOfDay,
    productivityScore: analytics.productivityScore,
    hasCompletedAllTasks: contextData.dueTasksCount === 0 && contextData.completedTasksTodayCount > 0,
    hasCompletedGoal: analytics.goalsCompleted > 0,
    hasMissedHabits: contextData.totalHabitsCount > 0 && contextData.habitsCompletedTodayCount < contextData.totalHabitsCount,
  })

  const fullText = `${contextData.greeting}! Cortez here. ${motivationalMessage}`

  // Animated typing effect
  useEffect(() => {
    let index = 0
    setTypedMessage('')

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedMessage((prev) => prev + fullText.charAt(index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 18)

    return () => clearInterval(interval)
  }, [fullText])

  return (
    <Card className="relative overflow-hidden bg-card/60 border-indigo-500/30 shadow-xl backdrop-blur-xl transition-all duration-300">
      {/* Floating Accent Glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center space-x-3">
          {/* Animated Avatar Aura */}
          <div className="relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-indigo-400 opacity-30"></span>
            <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-[#09090B] rounded-[9px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black text-foreground tracking-tight">Cortez</h3>
              <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-300 border-indigo-500/30 gap-1 font-bold">
                <Zap className="h-2.5 w-2.5" /> Productivity Companion
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Always active across LifeOS</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={isExpanded ? 'Collapse Cortez' : 'Expand Cortez'}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Expandable Assistant Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="px-5 pb-5 space-y-4 border-t border-border/40 pt-3"
          >
            {/* Animated Typing Indicator Message */}
            <div className="p-3.5 rounded-xl bg-background/50 border border-border/50 text-xs leading-relaxed text-foreground font-sans space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                <MessageSquare className="h-3 w-3" />
                Live Assistant Message
              </div>
              <p className="min-h-[36px]">
                {typedMessage}
                <span className="inline-block w-1.5 h-3 bg-indigo-400 ml-1 animate-pulse" />
              </p>
            </div>

            {/* Verified True Context Insights */}
            {contextData.insights.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Lightbulb className="h-3 w-3 text-amber-400" />
                  Verified Context Insights
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {contextData.insights.map((insight, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-card/60 border border-border/40 text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="truncate">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Triggers */}
            <div className="space-y-2 pt-1 border-t border-border/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <PlusCircle className="h-3 w-3" />
                Quick Actions
              </span>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/pomodoro')}
                  className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-indigo-500/10 hover:border-indigo-500/40"
                >
                  <Timer className="h-3.5 w-3.5 text-indigo-400" />
                  Start Focus Session
                </Button>

                {onOpenTaskModal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenTaskModal}
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-indigo-500/10 hover:border-indigo-500/40"
                  >
                    <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                    Create Task
                  </Button>
                )}

                {onOpenHabitModal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenHabitModal}
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-indigo-500/10 hover:border-indigo-500/40"
                  >
                    <Flame className="h-3.5 w-3.5 text-amber-400" />
                    Create Habit
                  </Button>
                )}

                {onOpenGoalModal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenGoalModal}
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-indigo-500/10 hover:border-indigo-500/40"
                  >
                    <Target className="h-3.5 w-3.5 text-purple-400" />
                    Create Goal
                  </Button>
                )}

                {onOpenNoteModal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenNoteModal}
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-indigo-500/10 hover:border-indigo-500/40"
                  >
                    <FileText className="h-3.5 w-3.5 text-pink-400" />
                    Create Note
                  </Button>
                )}

                <Link to="/analytics">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-indigo-500/10 hover:border-indigo-500/40"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                    Go to Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
