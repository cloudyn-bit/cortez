import { useState, useMemo } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useProfileStore } from '@/hooks/useProfile'
import { useAuth } from '@/context/AuthContext'
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

  const { profile } = useProfileStore()
  const { user } = useAuth()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    let timeOfDay = 'Evening'
    if (hour >= 5 && hour < 12) timeOfDay = 'Morning'
    else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon'
    
    let name = 'Guest'
    if (profile?.display_name) name = profile.display_name
    else if (profile?.username) name = profile.username
    else if (user?.user_metadata?.full_name) name = user.user_metadata.full_name
    else if (user?.email) name = user.email.split('@')[0]

    return `Good ${timeOfDay}, ${name}.`
  }, [profile, user])

  return (
    <PageContainer
      title={greeting}
      description="Welcome back. Here is your productivity overview."
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
