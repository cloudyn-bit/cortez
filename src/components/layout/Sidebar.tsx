import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { useProfileStore } from '@/hooks/useProfile'
import { UserAvatar } from '@/components/profile/UserAvatar'
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
  const { profile } = useProfileStore()

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
            <MagneticNavItem 
              key={item.path} 
              item={item} 
              isActive={isActive} 
              onClose={onClose} 
              Icon={Icon}
            />
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/[0.04]">
        <div className="flex items-center space-x-3">
          {profile ? (
            <>
              <UserAvatar
                avatarUrl={profile.avatar_url}
                username={profile.username}
                displayName={profile.display_name}
                size="md"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm text-foreground font-semibold truncate">
                  {profile.display_name || profile.username}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  @{profile.username}
                </span>
              </div>
            </>
          ) : (
            <>
              <ArcReactorLogo size={18} animate={true} glowIntensity="low" />
              <span className="text-[11px] text-zinc-600 font-medium">LifeOS v1.0</span>
            </>
          )}
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

// Custom Magnetic Nav Item
function MagneticNavItem({ item, isActive, onClose, Icon }: any) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <Link
      ref={ref}
      to={item.path}
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center justify-between overflow-hidden rounded-[var(--radius)] px-3 py-[calc(0.5rem*var(--density))] text-[13px] font-medium transition-colors duration-[calc(200ms*var(--anim-speed))] group",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {/* Magnetic Hover Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(40px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 100%)`
          ) as any,
        }}
      />

      {isActive && (
        <motion.div
          layoutId="sidebar-active-bg"
          className="absolute inset-0 rounded-[var(--radius)] bg-primary/10 shadow-inner shadow-primary/20 pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <div className="relative z-10 flex items-center space-x-3">
        {/* Active indicator — subtle left glow */}
        <div className="relative">
          {isActive && (
            <motion.div 
              layoutId="sidebar-left-bar"
              className="absolute -left-[18px] top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]" 
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <motion.div 
            animate={{ 
              scale: isActive ? 1.1 : (isHovered ? 1.05 : 1),
              x: isHovered && !isActive ? 2 : 0
            }} 
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Icon className={cn("h-4 w-4 transition-colors duration-[calc(200ms*var(--anim-speed))]", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
          </motion.div>
        </div>
        <motion.span 
          animate={{ 
            fontWeight: isActive ? 700 : 500,
            x: isHovered && !isActive ? 2 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {item.label}
        </motion.span>
      </div>
      {item.badge !== null && item.badge !== undefined && (
        <motion.span 
          whileHover={{ scale: 1.1 }}
          className={cn(
            "relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
            item.badge === 'Live'
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-white/[0.04] text-zinc-500"
          )}
        >
          {item.badge}
        </motion.span>
      )}
    </Link>
  )
}
