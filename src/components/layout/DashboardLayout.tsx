import React, { useState, useEffect } from 'react'
import { useOutlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { CortezReminderBanner } from '@/components/assistant/CortezReminderBanner'
import { CommandPalette } from '@/components/assistant/CommandPalette'
import { TaskModal } from '@/components/tasks/TaskModal'
import { HabitModal } from '@/components/habits/HabitModal'
import { GoalModal } from '@/components/goals/GoalModal'
import { NoteEditorModal } from '@/components/notes/NoteEditorModal'
import { Dock } from '@/components/ui/Dock'
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Target,
  FileText,
  Timer
} from 'lucide-react'

const dockItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'Tasks', icon: CheckSquare, href: '/tasks' },
  { title: 'Habits', icon: Flame, href: '/habits' },
  { title: 'Goals', icon: Target, href: '/goals' },
  { title: 'Notes', icon: FileText, href: '/notes' },
  { title: 'Pomodoro', icon: Timer, href: '/pomodoro' },
]

export function DashboardLayout() {
  const location = useLocation()
  const outlet = useOutlet()
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
    <motion.div 
      layoutId="auth-card"
      transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
      className="min-h-screen bg-[#020203] flex flex-col relative"
    >
      {/* Non-intrusive reminder banner */}
      <CortezReminderBanner />

      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
        onOpenCommandPalette={() => setIsPaletteOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden relative z-10 pb-16 md:pb-0">
        <div className="hidden md:block">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
        <main className="flex-1 overflow-y-auto relative">
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {outlet && React.cloneElement(outlet, { key: location.pathname })}
            </AnimatePresence>
          </LayoutGroup>
        </main>
      </div>

      <Dock items={dockItems} />

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
    </motion.div>
  )
}
