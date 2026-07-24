import { HabitStats, HeatmapDay } from '@/types/habit'

// Helper to format Date object as YYYY-MM-DD
export function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get today's date key YYYY-MM-DD
export function getTodayKey(): string {
  return formatDateKey(new Date())
}

// Check if today is completed
export function isCompletedToday(history: string[]): boolean {
  return history.includes(getTodayKey())
}

// Calculate streak statistics accurately
export function calculateStreakStats(history: string[], createdAt: string): HabitStats {
  const todayKey = getTodayKey()
  const completedToday = history.includes(todayKey)

  // Sort completed dates ascending
  const uniqueHistory = Array.from(new Set(history)).sort()

  if (uniqueHistory.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      completionPercentage: 0,
      totalCompletions: 0,
      completedToday: false,
    }
  }

  // Calculate current streak
  let currentStreak = 0
  const checkDate = new Date()

  // If today is not completed yet, start checking from yesterday
  if (!completedToday) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  while (true) {
    const key = formatDateKey(checkDate)
    if (uniqueHistory.includes(key)) {
      currentStreak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 0
  let prevDate: Date | null = null

  for (const dateStr of uniqueHistory) {
    const currentDate = new Date(dateStr)

    if (prevDate) {
      const diffTime = currentDate.getTime() - prevDate.getTime()
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24))

      if (diffDays === 1) {
        tempStreak++
      } else if (diffDays > 1) {
        tempStreak = 1
      }
    } else {
      tempStreak = 1
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak
    }

    prevDate = currentDate
  }

  // Calculate completion percentage over total days since creation (or last 30 days min 1)
  const createdDate = new Date(createdAt)
  const todayDate = new Date()
  const daysSinceCreation = Math.max(
    1,
    Math.ceil((todayDate.getTime() - createdDate.getTime()) / (1000 * 3600 * 24))
  )

  const completionPercentage = Math.min(
    100,
    Math.round((uniqueHistory.length / daysSinceCreation) * 100)
  )

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, longestStreak),
    completionPercentage,
    totalCompletions: uniqueHistory.length,
    completedToday,
  }
}

// Generate last 7 days mini heatmap data
export function getMiniHeatmapData(history: string[], daysCount = 7): HeatmapDay[] {
  const todayKey = getTodayKey()
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const result: HeatmapDay[] = []

  for (let i = daysCount - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = formatDateKey(date)

    result.push({
      date: dateKey,
      dayName: dayNames[date.getDay()],
      isCompleted: history.includes(dateKey),
      isToday: dateKey === todayKey,
    })
  }

  return result
}
