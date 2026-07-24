import { Link } from 'react-router-dom'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { formatTime } from './CircularTimer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  BrainCircuit,
  Coffee,
  Sparkles
} from 'lucide-react'

export function DashboardPomodoroWidget() {
  const {
    mode,
    secondsLeft,
    isRunning,
    cycleCount,
    stats,
    startTimer,
    pauseTimer,
    resetTimer
  } = usePomodoroStore()

  const modeLabels = {
    focus: 'Focus Session',
    short_break: 'Short Break',
    long_break: 'Long Break',
  }

  const modeIcons = {
    focus: BrainCircuit,
    short_break: Coffee,
    long_break: Sparkles,
  }

  const Icon = modeIcons[mode]

  return (
    <Card className="bg-card/40 border-border/80 shadow-md hover:border-indigo-500/30 transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Timer className="h-4 w-4 text-indigo-400" />
            Pomodoro Focus Timer
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {stats.todayFocusSessions} sessions completed today ({stats.totalFocusMinutes} total mins)
          </p>
        </div>

        <Link to="/pomodoro">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-indigo-400 hover:text-indigo-300 gap-1">
            <span>Open Timer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border/50">
          <div className="space-y-1">
            <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-300 border-indigo-500/30 gap-1 font-bold">
              <Icon className="h-3 w-3" />
              {modeLabels[mode]}
            </Badge>

            <p className="text-3xl font-black font-mono text-foreground tracking-tight pt-1">
              {formatTime(secondsLeft)}
            </p>

            <span className="text-[11px] text-muted-foreground">
              Cycle {cycleCount} of 4 • Streak: {stats.streakDays} days
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="h-9 w-9 border-border/80 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="glow"
              size="sm"
              onClick={isRunning ? pauseTimer : startTimer}
              className="h-9 px-4 font-bold text-xs gap-1.5"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                  <span>Start</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
