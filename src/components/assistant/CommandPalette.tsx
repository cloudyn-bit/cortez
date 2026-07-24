import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Flame,
  Target,
  FileText,
  Timer,
  BarChart3,
  Settings,
  Plus,
  Command,
  X
} from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenTaskModal?: () => void
  onOpenHabitModal?: () => void
  onOpenGoalModal?: () => void
  onOpenNoteModal?: () => void
}

interface PaletteItem {
  id: string
  title: string
  category: 'Navigation' | 'Actions'
  icon: any
  action: () => void
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenTaskModal,
  onOpenHabitModal,
  onOpenGoalModal,
  onOpenNoteModal
}: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const paletteItems: PaletteItem[] = [
    // Navigation items
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => {
        navigate('/dashboard')
        onClose()
      },
    },
    {
      id: 'nav-tasks',
      title: 'Go to Tasks',
      category: 'Navigation',
      icon: CheckSquare,
      action: () => {
        navigate('/tasks')
        onClose()
      },
    },
    {
      id: 'nav-habits',
      title: 'Go to Habits',
      category: 'Navigation',
      icon: Flame,
      action: () => {
        navigate('/habits')
        onClose()
      },
    },
    {
      id: 'nav-goals',
      title: 'Go to Goals',
      category: 'Navigation',
      icon: Target,
      action: () => {
        navigate('/goals')
        onClose()
      },
    },
    {
      id: 'nav-notes',
      title: 'Go to Notes Workspace',
      category: 'Navigation',
      icon: FileText,
      action: () => {
        navigate('/notes')
        onClose()
      },
    },
    {
      id: 'nav-pomodoro',
      title: 'Go to Pomodoro Timer',
      category: 'Navigation',
      icon: Timer,
      action: () => {
        navigate('/pomodoro')
        onClose()
      },
    },
    {
      id: 'nav-analytics',
      title: 'Go to Analytics',
      category: 'Navigation',
      icon: BarChart3,
      action: () => {
        navigate('/analytics')
        onClose()
      },
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      category: 'Navigation',
      icon: Settings,
      action: () => {
        navigate('/settings')
        onClose()
      },
    },

    // Action items
    {
      id: 'action-task',
      title: 'Create New Task',
      category: 'Actions',
      icon: Plus,
      action: () => {
        onClose()
        onOpenTaskModal?.()
      },
    },
    {
      id: 'action-habit',
      title: 'Create New Habit',
      category: 'Actions',
      icon: Plus,
      action: () => {
        onClose()
        onOpenHabitModal?.()
      },
    },
    {
      id: 'action-goal',
      title: 'Create New Goal',
      category: 'Actions',
      icon: Plus,
      action: () => {
        onClose()
        onOpenGoalModal?.()
      },
    },
    {
      id: 'action-note',
      title: 'Create New Note',
      category: 'Actions',
      icon: Plus,
      action: () => {
        onClose()
        onOpenNoteModal?.()
      },
    },
  ]

  const filteredItems = paletteItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase().trim())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

      {/* Command Palette Card */}
      <div className="relative z-50 w-full max-w-xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search input header */}
        <div className="flex items-center px-4 border-b border-border/50">
          <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Type a command or search route... (e.g. Tasks, Note, Pomodoro)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            className="h-12 border-none bg-transparent text-sm focus-visible:ring-0 placeholder:text-muted-foreground/60"
          />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matching commands or routes found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1.5 py-0.5 rounded bg-secondary/50">
                    {item.category}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 py-2 bg-secondary/30 border-t border-border/40 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Command className="h-3 w-3" /> Navigation & Action Shortcuts
          </span>
          <span>Use ↑ ↓ to navigate • ↵ to select • Esc to exit</span>
        </div>
      </div>
    </div>
  )
}
