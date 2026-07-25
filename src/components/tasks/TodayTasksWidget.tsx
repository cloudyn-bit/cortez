import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTaskStore } from '@/store/useTaskStore'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare,
  Square,
  Plus,
  ArrowRight,
  ListTodo
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <AnimatedCard layoutId="layout-tasks" className="bg-card/40 border-border/80 hover:border-indigo-500/30">
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
            <MagneticButton
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="h-8 px-2.5 text-xs gap-1 border-border/60 rounded-lg"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </MagneticButton>
            <Link to="/tasks">
              <MagneticButton variant="ghost" className="h-8 px-2 text-xs text-indigo-400 hover:text-indigo-300 gap-1 rounded-lg">
                <span>All Tasks</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </MagneticButton>
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
              <AnimatePresence mode="popLayout">
                {displayTasks.map((task) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-black/20 hover:bg-black/40 transition-colors text-xs shadow-inner"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTaskComplete(task.id)}
                        className="text-muted-foreground hover:text-indigo-400 focus:outline-none shrink-0"
                      >
                        {task.completed ? (
                          <CheckSquare className="h-4 w-4 text-indigo-400" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                      </motion.button>
                      <span
                        className={`truncate font-medium transition-colors duration-300 ${
                          task.completed ? 'line-through text-muted-foreground/50' : 'text-foreground'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[9px] py-0 px-1.5 border-transparent ${
                          task.priority === 'urgent'
                            ? 'bg-rose-500/15 text-rose-300'
                            : task.priority === 'high'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-white/5 text-muted-foreground'
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </AnimatedCard>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
