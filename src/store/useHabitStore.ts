import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Habit } from '@/types/habit'
import { getTodayKey, formatDateKey } from '@/lib/habits/streak'

interface HabitState {
  habits: Habit[]
  addHabit: (habitData: Omit<Habit, 'id' | 'history' | 'createdAt'>) => void
  editHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'history' | 'createdAt'>>) => void
  deleteHabit: (id: string) => void
  toggleHabitCompletion: (id: string, targetDateStr?: string) => void
}

// Generate past completed date strings for seed habits to demonstrate realistic streaks
const generateSeedHistory = (daysAgoList: number[]): string[] => {
  return daysAgoList.map((daysAgo) => {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return formatDateKey(date)
  })
}

const defaultSeedHabits: Habit[] = [
  {
    id: 'habit-1',
    title: 'Daily Active Recall Study Session',
    description: '30 minutes of focused active recall notes review.',
    category: 'study',
    color: '#6366f1', // Indigo
    history: generateSeedHistory([0, 1, 2, 3, 4]), // 5-day active streak
    createdAt: generateSeedHistory([14])[0],
  },
  {
    id: 'habit-2',
    title: 'Review 15 Flashcards',
    description: 'Flip through flashcards across current topics.',
    category: 'revision',
    color: '#10b981', // Emerald
    history: generateSeedHistory([0, 1, 2, 4, 5]), // Active today
    createdAt: generateSeedHistory([14])[0],
  },
  {
    id: 'habit-3',
    title: 'Take 1 Quiz / Practice Test',
    description: 'Test comprehension with auto-generated quiz questions.',
    category: 'quiz',
    color: '#f59e0b', // Amber
    history: generateSeedHistory([1, 2, 3]), // Pending today
    createdAt: generateSeedHistory([14])[0],
  },
]

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: defaultSeedHabits,

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          history: [],
          createdAt: getTodayKey(),
        }
        set((state) => ({
          habits: [newHabit, ...state.habits],
        }))
      },

      editHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
        }))
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        }))
      },

      toggleHabitCompletion: (id, targetDateStr) => {
        const dateKey = targetDateStr || getTodayKey()

        set((state) => ({
          habits: state.habits.map((habit) => {
            if (habit.id !== id) return habit

            const isAlreadyCompleted = habit.history.includes(dateKey)
            const updatedHistory = isAlreadyCompleted
              ? habit.history.filter((d) => d !== dateKey)
              : [...habit.history, dateKey]

            return {
              ...habit,
              history: updatedHistory,
            }
          }),
        }))
      },
    }),
    {
      name: 'cortez-habits-storage',
    }
  )
)
