import { Task } from '@/types/task'
import { Habit } from '@/types/habit'
import { Goal } from '@/types/goal'
import { Note } from '@/types/note'
import { PomodoroStats } from '@/types/pomodoro'
import { calculateStreakStats } from '@/lib/habits/streak'
import { UserProfile } from '@/hooks/useProfile'

export interface CortezSuggestion {
  label: string
  action: 'pomodoro' | 'tasks' | 'habits' | 'goals' | 'notes'
}

export interface CortezContext {
  greeting: string
  message: string
  insights: string[]
  suggestion: CortezSuggestion | null
}

export function evaluateCortezContext(
  profile: UserProfile | null,
  tasks: Task[],
  habits: Habit[],
  goals: Goal[],
  notes: Note[],
  pomodoroStats: PomodoroStats
): CortezContext {
  const now = new Date()
  const hour = now.getHours()
  const todayStr = now.toISOString().split('T')[0]

  // 1. Determine Greeting
  let timeGreeting = ''
  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Good morning'
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon'
  } else if (hour >= 17 && hour < 22) {
    timeGreeting = 'Good evening'
  } else {
    timeGreeting = 'Working late tonight'
  }

  let name = ''
  if (profile) {
    name = profile.display_name || profile.username || ''
  }
  
  if (!name && profile) {
    // Edge case if username is somehow empty (shouldn't be, but just in case)
    // we don't have email in profile, so we'll fallback to nothing.
  }

  let greeting = name ? `${timeGreeting}, ${name}.` : `${timeGreeting}.`
  if (timeGreeting === 'Working late tonight') {
    greeting = name ? `${timeGreeting}, ${name}?` : `${timeGreeting}?`
  }

  // 2. Data Analysis
  const tasksDueToday = tasks.filter((t) => !t.completed && t.dueDate === todayStr)
  const tasksOverdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr)
  
  const totalHabits = habits.length
  const habitsCompletedToday = habits.filter((h) => h.history.includes(todayStr))
  
  let maxCurrentStreak = 0
  habits.forEach((h) => {
    const { currentStreak } = calculateStreakStats(h.history, h.createdAt)
    if (currentStreak > maxCurrentStreak) maxCurrentStreak = currentStreak
  })

  const focusSessionsToday = pomodoroStats.todayFocusSessions || 0

  const notesCreatedToday = notes.filter((n) => n.createdAt.startsWith(todayStr))

  const hasData = tasks.length > 0 || habits.length > 0 || goals.length > 0 || notes.length > 0

  let message = ''
  let suggestion: CortezSuggestion | null = null
  const insights: string[] = []

  // 3. Dynamic Message & Suggestion Engine
  if (!hasData) {
    // Empty State
    message = "Welcome to LifeOS. Your workspace is perfectly clean."
    suggestion = { label: "Let's build your first task", action: 'tasks' }
  } else {
    // Build context-aware message
    const messageParts: string[] = []

    if (focusSessionsToday > 0) {
      messageParts.push(`You completed ${focusSessionsToday} focus session${focusSessionsToday > 1 ? 's' : ''} today.`)
    } else if (tasksOverdue.length > 0) {
      messageParts.push(`You have ${tasksOverdue.length} overdue task${tasksOverdue.length > 1 ? 's' : ''}.`)
    } else if (notesCreatedToday.length === 0) {
      messageParts.push("You haven't written any notes today.")
    } else {
      messageParts.push("Great progress today.")
    }

    if (tasksDueToday.length > 0) {
      messageParts.push(`Only ${tasksDueToday.length} task${tasksDueToday.length > 1 ? 's' : ''} remain.`)
    } else if (tasksOverdue.length > 0) {
      messageParts.push("Completing them now will restore your momentum.")
    } else if (habitsCompletedToday.length === totalHabits && totalHabits > 0) {
      messageParts.push("You completed every habit.")
    } else if (notesCreatedToday.length === 0) {
      messageParts.push("Capture ideas before they disappear.")
    }

    if (maxCurrentStreak > 0 && messageParts.length < 2) {
      messageParts.push(`You're on a ${maxCurrentStreak}-day habit streak.`)
    }

    // Pick top 2 parts to avoid walls of text
    message = messageParts.slice(0, 2).join(' ')

    // Determine suggestion
    if (tasksOverdue.length > 0) {
      suggestion = { label: 'Complete your overdue task', action: 'tasks' }
    } else if (tasksDueToday.length > 0) {
      suggestion = { label: 'Finish remaining tasks', action: 'tasks' }
    } else if (habitsCompletedToday.length < totalHabits) {
      suggestion = { label: 'Complete your daily habits', action: 'habits' }
    } else if (focusSessionsToday === 0) {
      suggestion = { label: 'Start your first focus session', action: 'pomodoro' }
    } else if (notesCreatedToday.length === 0) {
      suggestion = { label: 'Write your first note', action: 'notes' }
    } else {
      suggestion = { label: 'Review your goals', action: 'goals' }
    }

    // 4. Smart Insights
    // "Most tasks are completed before 4PM."
    const completedTasksWithTime = tasks.filter(t => t.completed && t.updatedAt)
    if (completedTasksWithTime.length > 3) {
      let morningCompletions = 0
      let afternoonCompletions = 0
      completedTasksWithTime.forEach(t => {
        const d = new Date(t.updatedAt)
        if (d.getHours() < 12) morningCompletions++
        else if (d.getHours() < 16) afternoonCompletions++
      })
      
      if (morningCompletions > afternoonCompletions && morningCompletions > completedTasksWithTime.length * 0.4) {
        insights.push("Your productivity is highest in the morning.")
      } else if (afternoonCompletions > morningCompletions && afternoonCompletions > completedTasksWithTime.length * 0.4) {
        insights.push("Most tasks are completed before 4PM.")
      }
    }

    if (habitsCompletedToday.length >= totalHabits && totalHabits > 0) {
      insights.push("You're highly consistent with your habits today.")
    }
  }

  return {
    greeting,
    message,
    insights,
    suggestion
  }
}
