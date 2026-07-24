import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { BlurFade } from '@/components/ui/BlurFade'
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
        <ShinyButton
          onClick={() => setIsTaskModalOpen(true)}
          className="gap-2 font-semibold text-xs py-2 px-4 h-9"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Task</span>
        </ShinyButton>
      }
    >
      <BlurFade delay={0.1}>
        <CortezAssistantCard
          onOpenTaskModal={() => setIsTaskModalOpen(true)}
          onOpenHabitModal={() => setIsHabitModalOpen(true)}
          onOpenGoalModal={() => setIsGoalModalOpen(true)}
          onOpenNoteModal={() => setIsNoteModalOpen(true)}
        />
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlurFade delay={0.2}>
          <ProductivityScoreWidget />
        </BlurFade>
        <BlurFade delay={0.3}>
          <DashboardPomodoroWidget />
        </BlurFade>
      </div>

      <BlurFade delay={0.4}>
        <FeaturedGoalWidget />
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BlurFade delay={0.5}>
          <TodayTasksWidget />
        </BlurFade>
        <BlurFade delay={0.6}>
          <TodayHabitsWidget />
        </BlurFade>
      </div>

      <BlurFade delay={0.7}>
        <RecentNotesWidget />
      </BlurFade>

      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <HabitModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
      <NoteEditorModal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} />
    </PageContainer>
  )
}
