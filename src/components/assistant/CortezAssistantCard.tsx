import { useState, useEffect, useRef } from 'react'
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
  const [isTyping, setIsTyping] = useState(true)

  // Memoize the context evaluation so the message doesn't change on every tiny rerender
  const contextDataRef = useRef(evaluateCortezContext(tasks, habits, goals, notes, pomodoroStats))
  const analyticsRef = useRef(computeAnalytics(tasks, habits, goals, notes, pomodoroStats))
  
  const [staticFullText, setStaticFullText] = useState('')

  useEffect(() => {
    // Generate one meaningful static message on mount or significant data change.
    const contextData = contextDataRef.current
    const analytics = analyticsRef.current
    
    const motivationalMessage = getMotivationalMessage({
      timeOfDay: contextData.timeOfDay,
      productivityScore: analytics.productivityScore,
      hasCompletedAllTasks: contextData.dueTasksCount === 0 && contextData.completedTasksTodayCount > 0,
      hasCompletedGoal: analytics.goalsCompleted > 0,
      hasMissedHabits: contextData.totalHabitsCount > 0 && contextData.habitsCompletedTodayCount < contextData.totalHabitsCount,
    }) || "Ready to crush your goals today?"

    const text = `${contextData.greeting}! Cortez here. ${motivationalMessage}`
    setStaticFullText(text)
  }, [])

  // Smooth animated typing effect that doesn't glitch
  useEffect(() => {
    if (!staticFullText) return
    
    let index = 0
    let isMounted = true
    setTypedMessage('')
    setIsTyping(true)

    const interval = setInterval(() => {
      if (!isMounted) return
      
      if (index < staticFullText.length) {
        setTypedMessage((prev) => prev + staticFullText.charAt(index))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 20)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [staticFullText])

  return (
    <Card className="relative overflow-hidden bg-card/60 border-indigo-500/30 shadow-xl backdrop-blur-xl transition-all duration-500 hover:shadow-indigo-500/10 hover:-translate-y-0.5">
      {/* Premium Floating Accent Glow */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/10 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center space-x-3">
          {/* Animated Avatar Aura */}
          <div className="relative group">
            <span className="absolute inline-flex h-full w-full rounded-xl bg-indigo-400 opacity-20 group-hover:animate-ping transition-all"></span>
            <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
              <div className="h-full w-full bg-[#09090B] rounded-[9px] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-foreground tracking-tight">Cortez</h3>
              <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-300 border-indigo-500/30 gap-1 font-bold">
                <Zap className="h-2.5 w-2.5" /> Productivity Companion
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Always active across LifeOS</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 text-muted-foreground hover:text-foreground transition-all hover:bg-white/5 rounded-full"
          aria-label={isExpanded ? 'Collapse Cortez' : 'Expand Cortez'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      {/* Expandable Assistant Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 pb-5 space-y-4 border-t border-border/40 pt-3"
          >
            {/* Animated Typing Indicator Message */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3.5 rounded-xl bg-background/50 border border-border/50 text-xs leading-relaxed text-foreground font-sans space-y-1.5 shadow-inner"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                <MessageSquare className="h-3 w-3" />
                Live Assistant Message
              </div>
              <p className="min-h-[36px] font-medium text-zinc-300">
                {typedMessage}
                {isTyping && <span className="inline-block w-1.5 h-3 bg-indigo-400 ml-1 animate-pulse" />}
              </p>
            </motion.div>

            {/* Verified True Context Insights */}
            {contextDataRef.current.insights.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-1.5"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Lightbulb className="h-3 w-3 text-amber-400" />
                  Verified Context Insights
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {contextDataRef.current.insights.map((insight, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-card/60 border border-border/40 text-muted-foreground flex items-center gap-2 hover:bg-card transition-colors shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      <span className="truncate">{insight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Action Triggers */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2 pt-1 border-t border-border/40"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <PlusCircle className="h-3 w-3" />
                Quick Actions
              </span>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/pomodoro')}
                  className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:-translate-y-[1px] transition-all shadow-sm"
                >
                  <Timer className="h-3.5 w-3.5 text-indigo-400" />
                  Start Focus Session
                </Button>

                {onOpenTaskModal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenTaskModal}
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:-translate-y-[1px] transition-all shadow-sm"
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
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-amber-500/10 hover:border-amber-500/40 hover:-translate-y-[1px] transition-all shadow-sm"
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
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-purple-500/10 hover:border-purple-500/40 hover:-translate-y-[1px] transition-all shadow-sm"
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
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-pink-500/10 hover:border-pink-500/40 hover:-translate-y-[1px] transition-all shadow-sm"
                  >
                    <FileText className="h-3.5 w-3.5 text-pink-400" />
                    Create Note
                  </Button>
                )}

                <Link to="/analytics">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5 border-border/60 bg-background/40 hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:-translate-y-[1px] transition-all shadow-sm"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
                    Go to Analytics
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
