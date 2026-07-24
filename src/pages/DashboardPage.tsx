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
import { PlusCircle } from 'lucide-react'

export function DashboardPage() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)

  return (
    <PageContainer
      title="Dashboard"
      description="Your productivity overview."
      action={
        <Button
          variant="glow"
          size="sm"
          onClick={() => setIsTaskModalOpen(true)}
          className="gap-2 font-semibold"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      }
    >
      {/* Cortez Companion Card — full width */}
      <CortezAssistantCard
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenHabitModal={() => setIsHabitModalOpen(true)}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
      />

      {/* Productivity Score + Pomodoro — 2 column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductivityScoreWidget />
        <DashboardPomodoroWidget />
      </div>

      {/* Featured Goal — full width */}
      <FeaturedGoalWidget />

      {/* Tasks + Habits — 2 column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodayTasksWidget />
        <TodayHabitsWidget />
      </div>

      {/* Recent Notes — full width */}
      <RecentNotesWidget />

      {/* Creation Modals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <HabitModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
      <NoteEditorModal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} />
    </PageContainer>
  )
}
