import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTaskStore } from '@/store/useTaskStore'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare,
  Square,
  Plus,
  ArrowRight,
  ListTodo
} from 'lucide-react'
import { motion } from 'framer-motion'
import { TaskModal } from './TaskModal'

export function TodayTasksWidget() {
  const { tasks, toggleTaskComplete } = useTaskStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]
  
  // Tasks due today or pending
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || (!t.completed && t.dueDate < todayStr))
  const displayTasks = todayTasks.length > 0 ? todayTasks.slice(0, 4) : tasks.slice(0, 4)

  const completedCount = tasks.filter((t) => t.completed).length
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <>
      <motion.div layoutId="layout-tasks" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      <Card className="bg-card/40 border-border/80 shadow-md hover:border-indigo-500/30 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <ListTodo className="h-4 w-4 text-indigo-400" />
              Today's Study Plan
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {tasks.length} tasks completed ({completionPercentage}%)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-8 px-2.5 text-xs gap-1 border-border/60"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </Button>
            <Link to="/tasks">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-indigo-400 hover:text-indigo-300 gap-1">
                <span>All Tasks</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-secondary/50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Task Items */}
          {displayTasks.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
              No tasks scheduled for today. Click "Add" to create one!
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {displayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-background/40 hover:bg-background/80 transition-colors text-xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="text-muted-foreground hover:text-indigo-400 focus:outline-none shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="h-4 w-4 text-indigo-400" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <span
                      className={`truncate font-medium ${
                        task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-[9px] py-0 px-1.5 ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : task.priority === 'high'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-secondary/40 text-muted-foreground'
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </motion.div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
