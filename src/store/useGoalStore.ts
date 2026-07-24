import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Goal, Milestone } from '@/types/goal'
import { triggerCompletionCelebration } from '@/lib/goals/celebration'

interface GoalState {
  goals: Goal[]
  addGoal: (
    goalData: Omit<Goal, 'id' | 'progress' | 'milestones' | 'createdAt' | 'completedAt' | 'celebrateTriggered'>,
    milestoneTitles?: string[]
  ) => void
  editGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'progress' | 'milestones' | 'createdAt'>>) => void
  deleteGoal: (id: string) => void
  addMilestone: (goalId: string, title: string) => void
  editMilestone: (goalId: string, milestoneId: string, title: string) => void
  deleteMilestone: (goalId: string, milestoneId: string) => void
  toggleMilestone: (goalId: string, milestoneId: string) => void
  markCelebrateTriggered: (goalId: string) => void
}

// Compute progress percentage automatically
function calculateGoalProgress(milestones: Milestone[]): number {
  if (!milestones || milestones.length === 0) return 0
  const completedCount = milestones.filter((m) => m.completed).length
  return Math.round((completedCount / milestones.length) * 100)
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [],

      addGoal: (goalData, milestoneTitles = []) => {
        const milestones: Milestone[] = milestoneTitles
          .filter((t) => t.trim().length > 0)
          .map((t, idx) => ({
            id: `m-${Date.now()}-${idx}`,
            title: t.trim(),
            completed: false,
          }))

        const progress = calculateGoalProgress(milestones)

        const newGoal: Goal = {
          ...goalData,
          id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          progress,
          milestones,
          createdAt: new Date().toISOString(),
          completedAt: progress === 100 ? new Date().toISOString() : null,
          celebrateTriggered: false,
        }

        set((state) => ({
          goals: [newGoal, ...state.goals],
        }))
      },

      editGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        }))
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }))
      },

      addMilestone: (goalId, title) => {
        if (!title.trim()) return

        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal

            const newMilestone: Milestone = {
              id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              title: title.trim(),
              completed: false,
            }
            const updatedMilestones = [...goal.milestones, newMilestone]
            const progress = calculateGoalProgress(updatedMilestones)

            return {
              ...goal,
              milestones: updatedMilestones,
              progress,
              completedAt: progress === 100 ? new Date().toISOString() : null,
            }
          }),
        }))
      },

      editMilestone: (goalId, milestoneId, title) => {
        if (!title.trim()) return

        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal

            const updatedMilestones = goal.milestones.map((m) =>
              m.id === milestoneId ? { ...m, title: title.trim() } : m
            )

            return {
              ...goal,
              milestones: updatedMilestones,
            }
          }),
        }))
      },

      deleteMilestone: (goalId, milestoneId) => {
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal

            const updatedMilestones = goal.milestones.filter((m) => m.id !== milestoneId)
            const progress = calculateGoalProgress(updatedMilestones)

            return {
              ...goal,
              milestones: updatedMilestones,
              progress,
              completedAt: progress === 100 ? new Date().toISOString() : null,
            }
          }),
        }))
      },

      toggleMilestone: (goalId, milestoneId) => {
        set((state) => ({
          goals: state.goals.map((goal) => {
            if (goal.id !== goalId) return goal

            const updatedMilestones = goal.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            )

            const progress = calculateGoalProgress(updatedMilestones)
            const isJustCompleted = progress === 100 && goal.progress < 100

            // Trigger confetti if goal reached 100% and hasn't celebrated yet
            if (isJustCompleted && !goal.celebrateTriggered) {
              triggerCompletionCelebration()
            }

            return {
              ...goal,
              milestones: updatedMilestones,
              progress,
              completedAt: progress === 100 ? new Date().toISOString() : null,
              celebrateTriggered: isJustCompleted ? true : goal.celebrateTriggered && progress === 100,
            }
          }),
        }))
      },

      markCelebrateTriggered: (goalId) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId ? { ...goal, celebrateTriggered: true } : goal
          ),
        }))
      },
    }),
    {
      name: 'lifeos-goals-storage',
    }
  )
)
