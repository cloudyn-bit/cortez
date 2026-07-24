import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
import { CommandPalette } from '@/components/assistant/CommandPalette'
import { CortezReminderBanner } from '@/components/assistant/CortezReminderBanner'
import { TaskModal } from '@/components/tasks/TaskModal'
import { HabitModal } from '@/components/habits/HabitModal'
import { GoalModal } from '@/components/goals/GoalModal'
import { NoteEditorModal } from '@/components/notes/NoteEditorModal'

export function DashboardLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  // Creation modals state triggered from Command Palette
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)

  // Global Cmd + K / Ctrl + K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsPaletteOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-[#050506] flex flex-col relative">
      {/* Ambient aurora background */}
      <AuroraBackground />

      {/* Non-intrusive reminder banner */}
      <CortezReminderBanner />

      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenHabitModal={() => setIsHabitModalOpen(true)}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
        onOpenNoteModal={() => setIsNoteModalOpen(true)}
      />

      {/* Creation Modals */}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <HabitModal isOpen={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
      <NoteEditorModal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} />
    </div>
  )
}
