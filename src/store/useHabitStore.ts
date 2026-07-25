import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getNamespacedStorage } from '@/lib/storage'
import { Habit } from '@/types/habit'
import { getTodayKey } from '@/lib/habits/streak'

interface HabitState {
  habits: Habit[]
  addHabit: (habitData: Omit<Habit, 'id' | 'history' | 'createdAt'>) => void
  editHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'history' | 'createdAt'>>) => void
  deleteHabit: (id: string) => void
  toggleHabitCompletion: (id: string, targetDateStr?: string) => void
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],

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
      name: 'lifeos-habits-storage',
      storage: getNamespacedStorage(),
    }
  )
)
