export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskCategory = 'study' | 'quiz' | 'revision' | 'assignment' | 'personal'

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  category: TaskCategory
  dueDate: string // YYYY-MM-DD
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type TaskSortOption = 'dueDate' | 'priority' | 'title' | 'createdAt'

export interface TaskFilterOptions {
  search: string
  category: TaskCategory | 'all'
  priority: TaskPriority | 'all'
  status: 'all' | 'pending' | 'completed'
  sortBy: TaskSortOption
  sortOrder: 'asc' | 'desc'
}
