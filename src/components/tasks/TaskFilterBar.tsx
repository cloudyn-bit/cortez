import { useTaskStore } from '@/store/useTaskStore'
import { TaskCategory, TaskPriority, TaskSortOption } from '@/types/task'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react'

export function TaskFilterBar() {
  const { filters, setFilter, resetFilters } = useTaskStore()

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.sortBy !== 'dueDate'

  return (
    <div className="space-y-3 bg-card/30 p-4 rounded-xl border border-border/60 backdrop-blur-md">
      {/* Top Row: Search & Status Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="pl-9 bg-background/50 border-input text-xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 bg-secondary/50 p-1 rounded-lg border border-border/50 text-xs w-full md:w-auto justify-center">
          <button
            onClick={() => setFilter({ status: 'all' })}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filters.status === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter({ status: 'pending' })}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filters.status === 'pending'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter({ status: 'completed' })}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filters.status === 'completed'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Bottom Row: Category, Priority, Sort & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={filters.category}
            onChange={(e) => setFilter({ category: e.target.value as TaskCategory | 'all' })}
            className="h-8 rounded-md border border-input bg-background/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            <option value="study">Study Notes</option>
            <option value="quiz">Quiz Prep</option>
            <option value="revision">Revision</option>
            <option value="assignment">Assignment</option>
            <option value="personal">Personal</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={filters.priority}
            onChange={(e) => setFilter({ priority: e.target.value as TaskPriority | 'all' })}
            className="h-8 rounded-md border border-input bg-background/50 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-[11px] font-medium flex items-center gap-1">
            <ArrowUpDown className="h-3 w-3" /> Sort by:
          </span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter({ sortBy: e.target.value as TaskSortOption })}
            className="h-8 rounded-md border border-input bg-background/50 px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="createdAt">Date Created</option>
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-[11px] text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
