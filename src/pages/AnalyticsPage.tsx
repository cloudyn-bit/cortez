import { PageContainer } from '@/components/layout/PageContainer'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { computeAnalytics } from '@/lib/analytics/engine'
import {
  WeeklyProductivityChart,
  TasksPerDayChart,
  TaskStatusPieChart,
  FocusTimeAreaChart,
  HabitRadialChart
} from '@/components/analytics/AnalyticsCharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare,
  Flame,
  Target,
  Timer,
  FileText,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Inbox
} from 'lucide-react'

export function AnalyticsPage() {
  const { tasks } = useTaskStore()
  const { habits } = useHabitStore()
  const { goals } = useGoalStore()
  const { notes } = useNoteStore()
  const { stats: pomodoroStats } = usePomodoroStore()

  const summary = computeAnalytics(tasks, habits, goals, notes, pomodoroStats)

  const hasData =
    tasks.length > 0 || habits.length > 0 || goals.length > 0 || notes.length > 0 || pomodoroStats.totalFocusMinutes > 0

  return (
    <PageContainer
      title="Productivity Analytics"
      description="Real-time performance metrics, trend visualizations, and automated rule-based productivity insights."
    >
      {/* Productivity Score & Algorithm Breakdown Header Card */}
      <Card className="bg-card/70 border-indigo-500/40 p-6 shadow-xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="h-20 w-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex flex-col items-center justify-center text-indigo-400 font-black text-3xl shadow-inner">
              <span>{summary.productivityScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Score</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 gap-1 text-xs font-bold">
                  <Sparkles className="h-3 w-3" /> Real-time Evaluation
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-foreground">Productivity Efficiency Score</h3>
              <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                Calculated from task completion rates (30%), habit consistency (25%), goal milestones (25%), and focus session ratios (20%).
              </p>
            </div>
          </div>

          {/* Quick Score Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
            <div className="px-3 py-2 rounded-lg bg-background/50 border border-border/60 text-center">
              <span className="text-muted-foreground block text-[10px]">Tasks Rate</span>
              <span className="font-bold text-emerald-400">{summary.taskCompletionRate}%</span>
            </div>
            <div className="px-3 py-2 rounded-lg bg-background/50 border border-border/60 text-center">
              <span className="text-muted-foreground block text-[10px]">Habits Today</span>
              <span className="font-bold text-amber-400">{summary.habitCompletionPercentage}%</span>
            </div>
            <div className="px-3 py-2 rounded-lg bg-background/50 border border-border/60 text-center">
              <span className="text-muted-foreground block text-[10px]">Goal Avg</span>
              <span className="font-bold text-purple-400">{summary.averageGoalProgress}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-card/40 border-border/80 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <CheckSquare className="h-3.5 w-3.5 text-indigo-400" /> Tasks Today
          </span>
          <p className="text-xl font-black text-foreground">{summary.tasksCompletedToday}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Tasks / Week
          </span>
          <p className="text-xl font-black text-emerald-400">{summary.tasksCompletedThisWeek}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" /> Habit Streak
          </span>
          <p className="text-xl font-black text-amber-400">{summary.currentHabitStreak} days</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-purple-400" /> Goals Done
          </span>
          <p className="text-xl font-black text-purple-400">{summary.goalsCompleted}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Timer className="h-3.5 w-3.5 text-cyan-400" /> Focus Minutes
          </span>
          <p className="text-xl font-black text-cyan-400">{summary.totalFocusMinutes}m</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-3 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-pink-400" /> Notes Created
          </span>
          <p className="text-xl font-black text-pink-400">{summary.notesCreated}</p>
        </Card>
      </div>

      {/* Rule-Based Insights Card */}
      <Card className="bg-card/40 border-border/80 p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          Productivity Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {summary.insights.map((insight, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-background/40 border border-border/50 text-muted-foreground leading-relaxed">
              {insight}
            </div>
          ))}
        </div>
      </Card>

      {/* Recharts Visualizations Grid */}
      {!hasData ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/20 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No analytics data recorded yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Start adding tasks, habits, goals, notes, or run a Pomodoro focus timer to populate your charts!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 1: Weekly Trend (Line) & Tasks Per Day (Bar) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <WeeklyProductivityChart data={summary.weeklyTrend} />
            <TasksPerDayChart data={summary.tasksPerDay} />
          </div>

          {/* Row 2: Task Status (Pie), Focus Minutes (Area), Habit Gauges (Radial) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TaskStatusPieChart data={summary.taskStatusPie} />
            <FocusTimeAreaChart data={summary.focusTimeArea} />
            <HabitRadialChart data={summary.habitRadial} />
          </div>
        </div>
      )}
    </PageContainer>
  )
}
