import { Link } from 'react-router-dom'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { computeAnalytics } from '@/lib/analytics/engine'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  ArrowRight,
  CheckSquare,
  Flame,
  Target,
  Timer,
} from 'lucide-react'
import { motion } from 'framer-motion'

export function ProductivityScoreWidget() {
  const { tasks } = useTaskStore()
  const { habits } = useHabitStore()
  const { goals } = useGoalStore()
  const { notes } = useNoteStore()
  const { stats: pomodoroStats } = usePomodoroStore()

  const summary = computeAnalytics(tasks, habits, goals, notes, pomodoroStats)

  // Color mapping based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    if (score >= 50) return 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10'
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10'
  }

  return (
    <motion.div layoutId="layout-analytics" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="h-full">
    <Card className="bg-card/40 border-border/80 shadow-md hover:border-indigo-500/30 transition-all h-full relative overflow-hidden">
      {/* Background decoration */}
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Zap className="h-4 w-4 text-amber-400 fill-amber-400/20" />
            Productivity Score & Overview
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Calculated in real-time from your active tasks, habit streaks, goals, and focus sessions.
          </p>
        </div>

        <Link to="/analytics">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-indigo-400 hover:text-indigo-300 gap-1">
            <span>Full Analytics</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-background/40 border border-border/50">
          {/* Score Badge */}
          <div className="flex items-center space-x-4">
            <div className={`h-16 w-16 rounded-2xl border flex items-center justify-center font-black text-2xl shadow-inner ${getScoreColorClass(summary.productivityScore)}`}>
              {summary.productivityScore}
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="text-[10px] bg-secondary/50 font-bold">
                Overall Efficiency Score
              </Badge>
              <h4 className="text-sm font-bold text-foreground">
                {summary.productivityScore >= 80 ? 'High Productivity' : summary.productivityScore >= 50 ? 'Steady Progress' : 'Needs Focus'}
              </h4>
              <p className="text-[11px] text-muted-foreground max-w-xs">
                Score factors task completion (30%), habits (25%), goal progress (25%), and focus minutes (20%).
              </p>
            </div>
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto text-xs">
            <div className="p-2.5 rounded-lg bg-card/60 border border-border/40 space-y-0.5">
              <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                <CheckSquare className="h-3 w-3 text-indigo-400" /> Today's Tasks
              </span>
              <p className="font-bold text-foreground">{summary.tasksCompletedToday} completed</p>
            </div>

            <div className="p-2.5 rounded-lg bg-card/60 border border-border/40 space-y-0.5">
              <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                <Flame className="h-3 w-3 text-amber-400" /> Habit Streak
              </span>
              <p className="font-bold text-foreground">{summary.currentHabitStreak} days streak</p>
            </div>

            <div className="p-2.5 rounded-lg bg-card/60 border border-border/40 space-y-0.5">
              <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                <Target className="h-3 w-3 text-emerald-400" /> Goal Progress
              </span>
              <p className="font-bold text-foreground">{summary.averageGoalProgress}% avg progress</p>
            </div>

            <div className="p-2.5 rounded-lg bg-card/60 border border-border/40 space-y-0.5">
              <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                <Timer className="h-3 w-3 text-purple-400" /> Focus Time
              </span>
              <p className="font-bold text-foreground">{summary.totalFocusMinutes} mins</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
