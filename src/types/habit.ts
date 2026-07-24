export type HabitCategory = 'study' | 'quiz' | 'revision' | 'health' | 'mindfulness' | 'productivity' | 'coding'

export interface Habit {
  id: string
  title: string
  description?: string
  category: HabitCategory
  color: string // CSS hex or tailwind color (e.g. '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6')
  history: string[] // Array of completed date strings YYYY-MM-DD
  createdAt: string // YYYY-MM-DD or ISO timestamp
}

export interface HabitStats {
  currentStreak: number
  longestStreak: number
  completionPercentage: number
  totalCompletions: number
  completedToday: boolean
}

export interface HeatmapDay {
  date: string // YYYY-MM-DD
  dayName: string // e.g., 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  isCompleted: boolean
  isToday: boolean
}
