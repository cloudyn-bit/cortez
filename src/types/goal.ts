export interface Milestone {
  id: string
  title: string
  completed: boolean
}

export type GoalCategory = 'academic' | 'career' | 'skill' | 'personal'

export interface Goal {
  id: string
  title: string
  description?: string
  category: GoalCategory
  targetDate: string // YYYY-MM-DD
  progress: number // 0 to 100, automatically computed
  milestones: Milestone[]
  createdAt: string
  completedAt: string | null
  celebrateTriggered?: boolean
}

export interface GoalStats {
  totalGoals: number
  inProgressCount: number
  completedCount: number
  approachingTargetCount: number
}
