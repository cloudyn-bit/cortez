import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGoalStore } from '@/store/useGoalStore'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  CheckSquare,
  Square,
  ArrowRight,
  Plus,
  Trophy
} from 'lucide-react'
import { motion } from 'framer-motion'
import { GoalModal } from './GoalModal'

export function FeaturedGoalWidget() {
  const { goals, toggleMilestone } = useGoalStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Find featured goal: goal closest to completion (highest progress < 100%, or completed if all completed)
  const activeGoals = goals.filter((g) => g.progress < 100)
  const featuredGoal =
    activeGoals.length > 0
      ? activeGoals.sort((a, b) => b.progress - a.progress)[0]
      : goals[0]

  return (
    <>
      <motion.div layoutId="layout-goals" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="col-span-full">
      <Card className="bg-card/40 border-border/80 shadow-md hover:border-indigo-500/30 transition-all overflow-hidden relative">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Target className="h-4 w-4 text-indigo-400" />
              Focus Target Goal
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Track long-term academic & study milestones
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
              <span>Add Goal</span>
            </Button>
            <Link to="/goals">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-indigo-400 hover:text-indigo-300 gap-1">
                <span>All Goals</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!featuredGoal ? (
            <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
              No goals created yet. Click "Add Goal" to define your first study target!
            </div>
          ) : (
            <div className="space-y-3">
              {/* Featured Goal Title & Progress Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-background/40 p-3 rounded-xl border border-border/40">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-foreground truncate">
                      {featuredGoal.title}
                    </h4>
                    {featuredGoal.progress === 100 && (
                      <Badge variant="outline" className="text-[9px] bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold">
                        <Trophy className="h-3 w-3 mr-1 text-emerald-400" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  {featuredGoal.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {featuredGoal.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Target Date</span>
                    <p className="text-xs font-semibold text-foreground">{featuredGoal.targetDate}</p>
                  </div>
                  <span className="text-base font-extrabold text-indigo-400 px-2.5 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    {featuredGoal.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${featuredGoal.progress}%` }}
                />
              </div>

              {/* Quick Milestone Checklist */}
              {featuredGoal.milestones.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Milestone Checklist
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {featuredGoal.milestones.slice(0, 4).map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center space-x-2 p-2 rounded-lg bg-background/50 border border-border/30 text-xs"
                      >
                        <button
                          onClick={() => toggleMilestone(featuredGoal.id, milestone.id)}
                          className="text-muted-foreground hover:text-indigo-400 focus:outline-none shrink-0"
                        >
                          {milestone.completed ? (
                            <CheckSquare className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        <span
                          className={`truncate font-medium ${
                            milestone.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      </motion.div>

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
