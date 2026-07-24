import { Task } from '@/types/task'
import { Habit } from '@/types/habit'
import { Goal } from '@/types/goal'
import { Note } from '@/types/note'
import { PomodoroStats } from '@/types/pomodoro'
import { calculateStreakStats } from '@/lib/habits/streak'

export interface CortezContext {
  insights: string[]
  greeting: string
  timeOfDay: 'morning' | 'afternoon' | 'evening'
  dueTasksCount: number
  completedTasksTodayCount: number
  habitsCompletedTodayCount: number
  totalHabitsCount: number
  maxStreak: number
  focusMinutesToday: number
  closestGoalTitle?: string
  remainingMilestonesCount?: number
}

export function evaluateCortezContext(
  tasks: Task[],
  habits: Habit[],
  goals: Goal[],
  notes: Note[],
  pomodoroStats: PomodoroStats
): CortezContext {
  const todayStr = new Date().toISOString().split('T')[0]
  const hour = new Date().getHours()

  let timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning'
  let greeting = 'Good morning'

  if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon'
    greeting = 'Good afternoon'
  } else if (hour >= 17 || hour < 5) {
    timeOfDay = 'evening'
    greeting = 'Good evening'
  }

  // 1. Tasks analysis
  const tasksDueToday = tasks.filter((t) => !t.completed && t.dueDate === todayStr)
  const completedTasksToday = tasks.filter((t) => t.completed && t.updatedAt.startsWith(todayStr))
  const allTasksToday = tasks.filter((t) => t.dueDate === todayStr)

  // 2. Habits analysis
  const totalHabits = habits.length
  const habitsCompletedToday = habits.filter((h) => h.history.includes(todayStr))

  let maxStreak = 0
  habits.forEach((h) => {
    const { currentStreak } = calculateStreakStats(h.history, h.createdAt)
    if (currentStreak > maxStreak) maxStreak = currentStreak
  })

  // 3. Goal analysis
  const activeGoals = goals.filter((g) => g.progress < 100)
  const closestGoal = [...activeGoals].sort((a, b) => b.progress - a.progress)[0]
  let remainingMilestonesCount = 0
  if (closestGoal) {
    remainingMilestonesCount = closestGoal.milestones.filter((m) => !m.completed).length
  }

  // 4. Pomodoro focus
  const focusMinutesToday = (pomodoroStats.todayFocusSessions || 0) * 25

  // 5. Notes analysis
  const notesCreatedToday = notes.filter((n) => n.createdAt.startsWith(todayStr))

  // Build verified true insights list
  const insights: string[] = []

  if (tasksDueToday.length > 0) {
    insights.push(`You have ${tasksDueToday.length} task${tasksDueToday.length > 1 ? 's' : ''} due today.`)
  } else if (allTasksToday.length > 0 && completedTasksToday.length === allTasksToday.length) {
    insights.push('Great work! You completed every task scheduled for today.')
  }

  if (totalHabits > 0 && habitsCompletedToday.length === totalHabits) {
    insights.push("You've completed every habit today!")
  } else if (maxStreak >= 3) {
    insights.push(`You're on a ${maxStreak}-day habit streak! 🔥`)
  }

  if (closestGoal && remainingMilestonesCount > 0) {
    insights.push(
      `Only ${remainingMilestonesCount} milestone${remainingMilestonesCount > 1 ? 's' : ''} remain for "${closestGoal.title}".`
    )
  }

  if (focusMinutesToday > 0) {
    insights.push(`You've focused for ${focusMinutesToday} minutes today.`)
  }

  if (notesCreatedToday.length === 0) {
    insights.push("You haven't written any notes today.")
  } else {
    insights.push(`You created ${notesCreatedToday.length} new note${notesCreatedToday.length > 1 ? 's' : ''} today.`)
  }

  return {
    insights,
    greeting,
    timeOfDay,
    dueTasksCount: tasksDueToday.length,
    completedTasksTodayCount: completedTasksToday.length,
    habitsCompletedTodayCount: habitsCompletedToday.length,
    totalHabitsCount: totalHabits,
    maxStreak,
    focusMinutesToday,
    closestGoalTitle: closestGoal?.title,
    remainingMilestonesCount,
  }
}
