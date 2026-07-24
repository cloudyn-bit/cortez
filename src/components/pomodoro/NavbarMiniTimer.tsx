import { Link } from 'react-router-dom'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { formatTime } from './CircularTimer'
import { Button } from '@/components/ui/button'
import { Play, Pause, Timer } from 'lucide-react'

export function NavbarMiniTimer() {
  const { mode, secondsLeft, isRunning, startTimer, pauseTimer } = usePomodoroStore()

  const modeLabels = {
    focus: 'Focus',
    short_break: 'Short Break',
    long_break: 'Long Break',
  }

  return (
    <div className="hidden lg:flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs">
      <Link to="/pomodoro" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <Timer className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
        <span className="font-bold text-foreground font-mono">
          {formatTime(secondsLeft)}
        </span>
        <span className="text-[10px] font-medium text-indigo-300">
          ({modeLabels[mode]})
        </span>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        onClick={isRunning ? pauseTimer : startTimer}
        className="h-5 w-5 text-indigo-300 hover:text-white p-0 hover:bg-transparent"
        title={isRunning ? 'Pause' : 'Start'}
      >
        {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      </Button>
    </div>
  )
}
