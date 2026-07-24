import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ChevronRight,
  BookOpen
} from 'lucide-react'

interface NavbarProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const { user, signOut, isDemoUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Format breadcrumb path
  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path.startsWith('/session')) return 'Workspace Session'
    if (path === '/settings') return 'Settings'
    return ''
  }

  const breadcrumb = getBreadcrumb()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left side: Hamburger button + Logo / Breadcrumbs */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={onToggleSidebar}
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          <Link to="/" className="flex items-center space-x-2 font-bold text-foreground hover:opacity-90 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <div className="h-full w-full bg-background rounded-[7px] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-indigo-400" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-extrabold tracking-tight">
              StudyPilot <span className="text-indigo-400">AI</span>
            </span>
          </Link>

          {breadcrumb && (
            <div className="hidden sm:flex items-center text-xs text-muted-foreground space-x-1 pl-2 border-l border-border/60">
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{breadcrumb}</span>
            </div>
          )}
        </div>

        {/* Right side: Actions & User Dropdown */}
        <div className="flex items-center space-x-2">
          {/* New Session CTA button if authenticated */}
          {user && (
            <Link to="/dashboard">
              <Button size="sm" variant="glow" className="hidden sm:inline-flex gap-1.5 text-xs font-semibold">
                <BookOpen className="h-3.5 w-3.5" />
                New Session
              </Button>
            </Link>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </Button>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 rounded-full border border-border/80 bg-secondary/50 p-1 pl-2 pr-3 hover:bg-secondary transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="h-6 w-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-semibold text-xs border border-indigo-500/40">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate text-muted-foreground hidden sm:inline">
                  {isDemoUser ? 'Demo User' : user.email?.split('@')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card p-1 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-border/50 text-xs">
                    <p className="font-semibold text-foreground truncate">
                      {user.user_metadata?.full_name || 'StudyPilot Student'}
                    </p>
                    <p className="text-muted-foreground truncate">{user.email}</p>
                    {isDemoUser && (
                      <span className="mt-1 inline-block rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
                        Demo Mode
                      </span>
                    )}
                  </div>

                  <Link
                    to="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      signOut()
                    }}
                    className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="default" className="text-xs">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
