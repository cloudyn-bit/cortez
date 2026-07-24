import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useTaskStore, getFilteredTasks } from '@/store/useTaskStore'
import { Task } from '@/types/task'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Plus,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox
} from 'lucide-react'
import { AnimatePresence } from 'framer-motion'

export function TasksPage() {
  const { tasks, filters } = useTaskStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  const filteredTasks = getFilteredTasks(tasks, filters)

  // Compute stat counters
  const totalCount = tasks.length
  const completedCount = tasks.filter((t) => t.completed).length
  const pendingCount = tasks.filter((t) => !t.completed).length
  const todayStr = new Date().toISOString().split('T')[0]
  const overdueCount = tasks.filter((t) => !t.completed && t.dueDate < todayStr).length

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
    setIsModalOpen(true)
  }

  const handleCreateTask = () => {
    setTaskToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <PageContainer
      title="Task Manager"
      description="Organize your study goals, quiz prep, assignments, and revision schedules."
      layoutId="layout-tasks"
      action={
        <Button variant="glow" size="sm" onClick={handleCreateTask} className="gap-2 font-semibold shadow-md">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      }
    >
      {/* Stat Cards Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Tasks</span>
            <ListTodo className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-foreground">{totalCount}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pending</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{completedCount}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Overdue</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400">{overdueCount}</p>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <TaskFilterBar />

      {/* Task List Grid */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/20 space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No tasks found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {tasks.length === 0
              ? 'Your task list is empty. Click "New Task" to create your first study item!'
              : 'No tasks match your current filter or search criteria. Try resetting filters.'}
          </p>
          <Button variant="outline" size="sm" onClick={handleCreateTask} className="gap-1.5 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </PageContainer>
  )
}
