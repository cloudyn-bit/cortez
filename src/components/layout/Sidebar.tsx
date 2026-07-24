import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { ArcReactorLogo } from '@/components/ui/ArcReactorLogo'
import {
  LayoutDashboard,
  Settings,
  CheckSquare,
  Flame,
  Target,
  FileText,
  Timer,
  BarChart3,
  Palette,
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { tasks } = useTaskStore()
  useHabitStore()
  const { goals } = useGoalStore()
  useNoteStore()
  const { isRunning } = usePomodoroStore()

  const pendingTaskCount = tasks.filter((t) => !t.completed).length
  const activeGoalCount = goals.filter((g) => g.progress < 100).length

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare, badge: pendingTaskCount > 0 ? pendingTaskCount : null },
    { label: 'Habits', path: '/habits', icon: Flame },
    { label: 'Goals', path: '/goals', icon: Target, badge: activeGoalCount > 0 ? activeGoalCount : null },
    { label: 'Notes', path: '/notes', icon: FileText },
    { label: 'Focus', path: '/pomodoro', icon: Timer, badge: isRunning ? 'Live' : null },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Appearance', path: '/personalization', icon: Palette },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  const content = (
    <div className="flex h-full flex-col justify-between py-4">
      <nav className="space-y-1 px-3">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between rounded-[var(--radius)] px-3 py-[calc(0.5rem*var(--density))] text-[13px] font-medium transition-all duration-[calc(200ms*var(--anim-speed))] group",
                isActive
                  ? "bg-primary/10 text-primary shadow-inner shadow-primary/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <div className="flex items-center space-x-3">
                {/* Active indicator — subtle left glow */}
                <div className="relative">
                  {isActive && (
                    <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
                  )}
                  <Icon className={cn("h-4 w-4 transition-colors duration-[calc(200ms*var(--anim-speed))]", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                </div>
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  item.badge === 'Live'
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "bg-white/[0.04] text-zinc-500"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer — just the logo, no chatbot status */}
      <div className="px-6 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center space-x-2.5">
          <ArcReactorLogo size={18} animate={true} glowIntensity="low" />
          <span className="text-[11px] text-zinc-600 font-medium">LifeOS v1.0</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[calc(14rem*var(--density))] flex-col border-r glass-panel shrink-0 rounded-none z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative z-50 w-64 max-w-[80vw] bg-[#0a0a0c] border-r border-white/[0.04] h-full shadow-2xl shadow-black/40">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
