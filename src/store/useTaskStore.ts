import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, TaskFilterOptions, TaskPriority } from '@/types/task'

interface TaskState {
  tasks: Task[]
  filters: TaskFilterOptions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  setFilter: (filters: Partial<TaskFilterOptions>) => void
  resetFilters: () => void
}

const initialFilters: TaskFilterOptions = {
  search: '',
  category: 'all',
  priority: 'all',
  status: 'all',
  sortBy: 'dueDate',
  sortOrder: 'asc',
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      filters: initialFilters,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      toggleTaskComplete: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        }))
      },

      setFilter: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }))
      },

      resetFilters: () => {
        set({ filters: initialFilters })
      },
    }),
    {
      name: 'cortez-tasks-storage',
    }
  )
)

export const getFilteredTasks = (tasks: Task[], filters: TaskFilterOptions): Task[] => {
  return tasks
    .filter((task) => {
      // Search text match
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(query)
        const matchesDesc = task.description?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesDesc) return false
      }

      // Category filter
      if (filters.category !== 'all' && task.category !== filters.category) {
        return false
      }

      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false
      }

      // Completion status filter
      if (filters.status === 'completed' && !task.completed) return false
      if (filters.status === 'pending' && task.completed) return false

      return true
    })
    .sort((a, b) => {
      let result = 0

      if (filters.sortBy === 'dueDate') {
        result = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else if (filters.sortBy === 'priority') {
        const priorityOrder: Record<TaskPriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1,
        }
        result = priorityOrder[b.priority] - priorityOrder[a.priority]
      } else if (filters.sortBy === 'title') {
        result = a.title.localeCompare(b.title)
      } else if (filters.sortBy === 'createdAt') {
        result = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }

      return filters.sortOrder === 'asc' ? result : -result
    })
}
