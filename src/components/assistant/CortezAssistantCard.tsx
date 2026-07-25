import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { useProfileStore } from '@/hooks/useProfile'
import { evaluateCortezContext } from '@/lib/assistant/context'
import { ArcReactorLogo } from '@/components/ui/ArcReactorLogo'
import { Button } from '@/components/ui/button'
import { TypingAnimation } from '@/components/ui/TypingAnimation'
import {
  ChevronDown,
  Lightbulb,
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
  const { profile } = useProfileStore()
  const { tasks } = useTaskStore()
  const { habits } = useHabitStore()
  const { goals } = useGoalStore()
  const { notes } = useNoteStore()
  const { stats: pomodoroStats } = usePomodoroStore()

  const [isExpanded, setIsExpanded] = useState(true)

  // Use memo to instantly compute context based on reactive data
  const contextData = useMemo(() => {
    return evaluateCortezContext(profile, tasks, habits, goals, notes, pomodoroStats)
  }, [profile, tasks, habits, goals, notes, pomodoroStats])

  const handleSuggestionClick = (action: string) => {
    switch (action) {
      case 'pomodoro': navigate('/pomodoro'); break;
      case 'tasks': onOpenTaskModal?.(); break;
      case 'habits': onOpenHabitModal?.(); break;
      case 'goals': onOpenGoalModal?.(); break;
      case 'notes': onOpenNoteModal?.(); break;
    }
  }

  return (
    <div className="relative overflow-hidden glass-panel border border-white/5 shadow-xl">
      {/* Floating ambient glow tied to accent color */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-primary/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center space-x-3">
          {/* Animated Avatar / Breathing Animation */}
          <motion.div
            animate={{ 
              y: [-1, 1, -1],
              scale: [1, 1.02, 1] 
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
            <ArcReactorLogo size={42} animate={true} glowIntensity="high" />
          </motion.div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Cortez</h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_8px_hsl(var(--cyan)/0.2)]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] font-semibold text-cyan-400 tracking-wide uppercase">Online</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Your intelligence companion.</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 text-zinc-500 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
            animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
            exit={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="px-5 pb-5 space-y-4 border-t border-white/[0.04] pt-4"
          >
            <div className="relative pl-3 border-l-2 border-primary/40 py-1 space-y-2">
              <div className="text-xs text-white font-bold leading-relaxed">
                <TypingAnimation 
                  text={contextData.greeting}
                  idKey={contextData.greeting}
                  speed={30}
                  className="text-xs font-bold text-white text-left block" 
                />
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                {contextData.message}
              </p>
            </div>

            {/* Context insights — clean grid */}
            {contextData.insights.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Lightbulb className="h-3 w-3 text-primary/70" />
                  Smart Insights
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {contextData.insights.map((insight, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-black/20 border border-white/5 shadow-inner text-zinc-400 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shadow-[0_0_5px_hsl(var(--primary)/0.5)] shrink-0" />
                      <span className="truncate">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable Suggestion */}
            {contextData.suggestion && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(contextData.suggestion!.action)}
                  className="w-full h-9 bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-primary transition-colors text-xs font-semibold shadow-[0_0_15px_hsl(var(--primary)/0.1)]"
                >
                  {contextData.suggestion.label}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
