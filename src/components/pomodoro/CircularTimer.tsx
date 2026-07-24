import { motion } from 'framer-motion'
import { TimerMode, PomodoroSettings } from '@/types/pomodoro'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AnimatedCircularProgressBar } from '@/components/ui/AnimatedCircularProgressBar'
import { ShinyButton } from '@/components/ui/ShinyButton'
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Sparkles,
  Coffee,
  BrainCircuit
} from 'lucide-react'

// Format seconds into MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function getModeTotalSeconds(mode: TimerMode, settings: PomodoroSettings): number {
  if (mode === 'focus') return settings.focusDuration * 60
  if (mode === 'short_break') return settings.shortBreakDuration * 60
  if (mode === 'long_break') return settings.longBreakDuration * 60
  return 25 * 60
}

export function CircularTimer() {
  const {
    mode,
    secondsLeft,
    isRunning,
    cycleCount,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession
  } = usePomodoroStore()

  const totalSeconds = getModeTotalSeconds(mode, settings)

  const modeConfig: Record<TimerMode, { title: string; colorClass: string; icon: typeof BrainCircuit }> = {
    focus: {
      title: 'Focus Session',
      colorClass: 'stroke-indigo-500 text-indigo-400',
      icon: BrainCircuit,
    },
    short_break: {
      title: 'Short Break',
      colorClass: 'stroke-emerald-500 text-emerald-400',
      icon: Coffee,
    },
    long_break: {
      title: 'Long Break',
      colorClass: 'stroke-purple-500 text-purple-400',
      icon: Sparkles,
    },
  }

  const currentModeInfo = modeConfig[mode]
  const Icon = currentModeInfo.icon

  // Extract color values based on mode class (a bit hacky but works for the UI)
  const getPrimaryColor = () => {
    if (mode === 'focus') return 'hsl(var(--primary))' // Indigo
    if (mode === 'short_break') return 'hsl(var(--emerald-500))'
    return 'hsl(var(--purple-500))'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Magic UI Animated Circular Progress */}
      <div className="relative flex items-center justify-center w-[280px] h-[280px]">
        <AnimatedCircularProgressBar
          max={totalSeconds}
          value={totalSeconds - secondsLeft}
          gaugePrimaryColor={getPrimaryColor()}
          gaugeSecondaryColor="hsl(var(--secondary) / 0.4)"
          className="absolute inset-0"
        >
          {/* Inner Content Readout */}
          <div className="flex flex-col items-center justify-center space-y-2 text-center z-10">
            <Badge
              variant="outline"
              className={`text-xs px-3 py-1 bg-background/60 backdrop-blur-md border-border/80 gap-1.5 font-bold ${currentModeInfo.colorClass}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{currentModeInfo.title}</span>
            </Badge>

            <motion.span
              key={secondsLeft}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-5xl sm:text-6xl font-black tracking-tight text-foreground font-mono"
            >
              {formatTime(secondsLeft)}
            </motion.span>

            <span className="text-xs font-semibold text-muted-foreground">
              Cycle {cycleCount} of 4
            </span>
          </div>
        </AnimatedCircularProgressBar>
      </div>

      {/* Primary Control Buttons */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="h-11 w-11 rounded-full border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground"
          title="Reset timer"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <ShinyButton
          onClick={isRunning ? pauseTimer : startTimer}
          className="h-14 px-8"
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current ml-0.5" />
              <span>{secondsLeft === totalSeconds ? 'Start Session' : 'Resume'}</span>
            </>
          )}
        </ShinyButton>

        <Button
          variant="outline"
          size="icon"
          onClick={skipSession}
          className="h-11 w-11 rounded-full border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground"
          title="Skip session"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
