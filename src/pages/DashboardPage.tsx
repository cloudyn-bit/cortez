import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { CortezAssistantCard } from '@/components/assistant/CortezAssistantCard'
import { ProductivityScoreWidget } from '@/components/analytics/ProductivityScoreWidget'
import { DashboardPomodoroWidget } from '@/components/pomodoro/DashboardPomodoroWidget'
import { FeaturedGoalWidget } from '@/components/goals/FeaturedGoalWidget'
import { TodayTasksWidget } from '@/components/tasks/TodayTasksWidget'
import { TodayHabitsWidget } from '@/components/habits/TodayHabitsWidget'
import { RecentNotesWidget } from '@/components/notes/RecentNotesWidget'
import { TaskModal } from '@/components/tasks/TaskModal'
import { HabitModal } from '@/components/habits/HabitModal'
import { GoalModal } from '@/components/goals/GoalModal'
import { NoteEditorModal } from '@/components/notes/NoteEditorModal'
import { PlusCircle, Command } from 'lucide-react'

export function DashboardPage() {
  // Creation modals state for Cortez quick actions
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)

  return (
    <PageContainer
      title="LifeOS Dashboard"
      description="Your central productivity workspace powered by Cortez."
      action={
        <Button
          variant="glow"
          size="sm"
          onClick={() => setIsTaskModalOpen(true)}
          className="gap-2 font-semibold shadow-md"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      }
    >
      {/* Top Cortez Productivity Companion Card */}
      <CortezAssistantCard
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenHabitModal={() => setIsHabitModalOpen(true)}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
      />

      {/* Productivity Score Widget */}
      <ProductivityScoreWidget />

      {/* Pomodoro Timer Focus Widget */}
      <DashboardPomodoroWidget />

      {/* Featured Goal Focus Widget */}
      <FeaturedGoalWidget />

      {/* Today's Tasks & Habits Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TodayTasksWidget />
        <TodayHabitsWidget />
      </div>

      {/* Recent Notes Widget */}
      <RecentNotesWidget />

      {/* Footer shortcut helper hint */}
      <div className="rounded-xl border border-dashed border-border/70 p-4 text-center bg-card/20 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="flex items-center gap-1 font-semibold text-foreground">
          <Command className="h-3.5 w-3.5 text-indigo-400" /> Pro Tip:
        </span>
        <span>
          Press <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono text-[10px]">Cmd + K</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-secondary font-mono text-[10px]">Ctrl + K</kbd> anytime to open the Cortez Command Palette.
        </span>
      </div>

      {/* Creation Modals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <HabitModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
      <NoteEditorModal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} />
    </PageContainer>
  )
}
