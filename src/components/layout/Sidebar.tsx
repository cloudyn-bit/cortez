import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import {
  LayoutDashboard,
  Settings,
  PlusCircle,
  Clock,
  Home,
  BookOpenCheck,
  ChevronRight,
  CheckSquare,
  Flame,
  Target,
  FileText,
  Timer,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { tasks } = useTaskStore()
  const { habits } = useHabitStore()
  const { goals } = useGoalStore()
  const { notes } = useNoteStore()
  const { isRunning } = usePomodoroStore()

  const pendingTaskCount = tasks.filter((t) => !t.completed).length
  const activeHabitCount = habits.length
  const activeGoalCount = goals.filter((g) => g.progress < 100).length
  const totalNotesCount = notes.length

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Pomodoro', path: '/pomodoro', icon: Timer, badge: isRunning ? 'Active' : null },
    { label: 'Notes', path: '/notes', icon: FileText, badge: totalNotesCount > 0 ? totalNotesCount : null },
    { label: 'Goals', path: '/goals', icon: Target, badge: activeGoalCount > 0 ? activeGoalCount : null },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare, badge: pendingTaskCount > 0 ? pendingTaskCount : null },
    { label: 'Habits', path: '/habits', icon: Flame, badge: activeHabitCount > 0 ? activeHabitCount : null },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  const recentSessions = [
    { id: 'roman-history', title: 'Roman Empire History', date: 'Just now' },
    { id: 'quantum-physics', title: 'Quantum Physics Basics', date: 'Yesterday' },
    { id: 'organic-chemistry', title: 'Organic Chemistry Reactions', date: '3 days ago' },
  ]

  const content = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* New Session CTA */}
        <div>
          <Link to="/dashboard" onClick={onClose}>
            <Button variant="glow" className="w-full justify-start gap-2 text-sm font-semibold shadow-md">
              <PlusCircle className="h-4 w-4" />
              <span>New Session</span>
            </Button>
          </Link>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "text-muted-foreground")} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Recent Sessions
            </p>
          </div>

          <div className="space-y-1 pt-1">
            {recentSessions.map((session) => (
              <Link
                key={session.id}
                to={`/session/${session.id}`}
                onClick={onClose}
                className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <BookOpenCheck className="h-3.5 w-3.5 shrink-0 text-indigo-400/70 group-hover:text-indigo-400" />
                  <span className="truncate">{session.title}</span>
                </div>
                <ChevronRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / System Status */}
      <div className="border-t border-border/60 pt-4 px-2">
        <div className="rounded-lg bg-card/60 p-3 border border-border/50 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Gemini 1.5 Engine</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Cortez active productivity engine
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-card/30 backdrop-blur-xl shrink-0">
        {content}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-50 w-72 max-w-[80vw] bg-card border-r border-border h-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
