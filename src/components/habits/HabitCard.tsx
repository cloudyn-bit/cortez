import { useState } from 'react'
import { Habit, HabitCategory } from '@/types/habit'
import { useHabitStore } from '@/store/useHabitStore'
import { calculateStreakStats, getMiniHeatmapData } from '@/lib/habits/streak'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { Badge } from '@/components/ui/badge'
import {
  Flame,
  Check,
  MoreVertical,
  Edit2,
  Trash2,
  Trophy,
  Tag
} from 'lucide-react'

interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const { toggleHabitCompletion, deleteHabit } = useHabitStore()
  const [menuOpen, setMenuOpen] = useState(false)

  const stats = calculateStreakStats(habit.history, habit.createdAt)
  const heatmapDays = getMiniHeatmapData(habit.history, 7)

  const categoryLabels: Record<HabitCategory, string> = {
    study: 'Study',
    quiz: 'Quiz Prep',
    revision: 'Revision',
    health: 'Health',
    mindfulness: 'Mindfulness',
    productivity: 'Productivity',
    coding: 'Coding'
  }

  // Circular progress SVG parameters
  const radius = 24
  const strokeWidth = 4
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (stats.completionPercentage / 100) * circumference

  const habitColor = habit.color || '#6366f1'

  return (
    <AnimatedCard
      layout
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      tilt={!menuOpen}
      parallax={!menuOpen}
      className="group relative bg-card/40 p-5 hover:border-indigo-500/40 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Category Pill & Menu */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <Badge
            variant="outline"
            className="text-[10px] py-0 px-2 bg-secondary/40 border-border/60 text-secondary-foreground"
          >
            <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
            {categoryLabels[habit.category] || habit.category}
          </Badge>

          <div className="relative">
            <MagneticButton
              variant="ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Habit options"
            >
              <MoreVertical className="h-4 w-4" />
            </MagneticButton>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded-lg border border-border bg-card p-1 shadow-xl z-30 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    onEdit(habit)
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    deleteHabit(habit.id)
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Middle Body: Habit Title + Circular Progress Ring */}
        <div className="flex items-center justify-between gap-4 py-1">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground truncate group-hover:text-indigo-400 transition-colors">
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                {habit.description}
              </p>
            )}
          </div>

          {/* Circular Progress Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={strokeWidth}
                className="text-secondary/60"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={habitColor}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <span className="absolute text-[10px] font-extrabold text-foreground">
              {stats.completionPercentage}%
            </span>
          </div>
        </div>

        {/* Streaks Banner */}
        <div className="flex items-center space-x-3 my-3 p-2 rounded-xl bg-secondary/30 border border-border/40 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <Flame className="h-4 w-4 fill-amber-400/20 text-amber-400 animate-pulse" />
            <span>{stats.currentStreak} day streak</span>
          </div>

          <div className="flex items-center space-x-1 text-muted-foreground text-[11px]">
            <Trophy className="h-3 w-3 text-indigo-400" />
            <span>Best: {stats.longestStreak}</span>
          </div>
        </div>

        {/* Mini 7-Day Heatmap */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Past 7 Days
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {heatmapDays.map((day, idx) => (
              <div
                key={idx}
                title={`${day.date}: ${day.isCompleted ? 'Completed' : 'Missed'}`}
                className={`flex flex-col items-center justify-center py-1 rounded-md text-[10px] font-bold transition-all ${
                  day.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                    : day.isToday
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-secondary/40 text-muted-foreground/60 border border-border/30'
                }`}
              >
                <span>{day.dayName}</span>
                <div
                  className={`h-1.5 w-1.5 rounded-full mt-0.5 ${
                    day.isCompleted
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                      : 'bg-muted-foreground/30'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Today Completion Button */}
      <div className="pt-4 border-t border-border/50 mt-4">
        <MagneticButton
          onClick={() => toggleHabitCompletion(habit.id)}
          className={`w-full py-5 text-xs font-bold gap-2 rounded-xl transition-all duration-300 ${
            stats.completedToday
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500'
              : 'bg-transparent border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-600/10 text-foreground'
          }`}
        >
          {stats.completedToday ? (
            <>
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Completed Today!</span>
            </>
          ) : (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center" />
              <span>Mark as Done Today</span>
            </>
          )}
        </MagneticButton>
      </div>
    </AnimatedCard>
  )
}
