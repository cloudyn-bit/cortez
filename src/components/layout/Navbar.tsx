import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeProvider'
import { useProfileStore } from '@/hooks/useProfile'
import { NavbarMiniTimer } from '@/components/pomodoro/NavbarMiniTimer'
import { UserAvatar } from '@/components/profile/UserAvatar'
import { ArcReactorLogo } from '@/components/ui/ArcReactorLogo'
import { Button } from '@/components/ui/button'
import {
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ChevronRight,
  Command,
  Search
} from 'lucide-react'

interface NavbarProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
  onOpenCommandPalette?: () => void
}

export function Navbar({ onToggleSidebar, isSidebarOpen, onOpenCommandPalette }: NavbarProps) {
  const { user, signOut, isDemoUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { profile } = useProfileStore()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/analytics') return 'Analytics'
    if (path === '/notes') return 'Notes'
    if (path === '/goals') return 'Goals'
    if (path === '/tasks') return 'Tasks'
    if (path === '/habits') return 'Habits'
    if (path === '/pomodoro') return 'Focus'
    if (path === '/settings') return 'Settings'
    return ''
  }

  const breadcrumb = getBreadcrumb()

  return (
    <header className="sticky top-0 z-40 w-full border-b glass-panel rounded-none">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Logo + Breadcrumb */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-zinc-500 hover:text-white"
              onClick={onToggleSidebar}
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          <Link to="/" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
            <ArcReactorLogo size={28} animate={true} glowIntensity="low" />
            <span className="text-sm font-extrabold text-white tracking-tight">
              LifeOS
            </span>
          </Link>

          {breadcrumb && (
            <div className="hidden sm:flex items-center text-xs text-zinc-600 space-x-1.5 pl-3 border-l border-white/[0.06]">
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-zinc-400">{breadcrumb}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center space-x-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-xs text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 hover:border-white/[0.1] transition-all duration-200"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Search</span>
              <kbd className="pointer-events-none rounded border border-white/[0.06] bg-white/[0.02] px-1.5 font-mono text-[10px] text-zinc-600 flex items-center gap-0.5">
                <Command className="h-2.5 w-2.5" /> K
              </kbd>
            </button>
          )}

          <NavbarMiniTimer />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-zinc-500 hover:text-white h-8 w-8"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 pr-3 hover:bg-white/[0.04] transition-all duration-200 text-xs font-medium focus:outline-none"
              >
                <UserAvatar
                  avatarUrl={profile?.avatar_url}
                  username={profile?.username}
                  displayName={profile?.display_name}
                  email={user.email}
                  size="sm"
                />
                <span className="max-w-[120px] truncate text-zinc-500 hidden sm:inline">
                  {isDemoUser 
                    ? 'Guest' 
                    : (profile?.display_name || profile?.username || user.email?.split('@')[0])}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-52 rounded-xl border border-white/[0.06] bg-[#0a0a0c] p-1.5 shadow-2xl shadow-black/40 z-50"
                  >
                    <div className="px-3 py-2.5 border-b border-white/[0.04] text-xs mb-1">
                      <p className="font-semibold text-white truncate">
                        {isDemoUser 
                          ? 'Guest User' 
                          : (profile?.display_name || profile?.username || user.email?.split('@')[0] || 'LifeOS User')}
                      </p>
                      <p className="text-zinc-600 truncate text-[11px]">{user.email}</p>
                      {isDemoUser && (
                        <span className="mt-1.5 inline-block rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/15">
                          Demo Mode
                        </span>
                      )}
                    </div>

                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-colors"
                    >
                      <UserIcon className="h-3.5 w-3.5" />
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        signOut()
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/8 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="glow" className="text-xs">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
