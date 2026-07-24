import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
    { id: 'nav-dashboard', title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => { navigate('/dashboard'); onClose() } },
    { id: 'nav-tasks', title: 'Go to Tasks', category: 'Navigation', icon: CheckSquare, action: () => { navigate('/tasks'); onClose() } },
    { id: 'nav-habits', title: 'Go to Habits', category: 'Navigation', icon: Flame, action: () => { navigate('/habits'); onClose() } },
    { id: 'nav-goals', title: 'Go to Goals', category: 'Navigation', icon: Target, action: () => { navigate('/goals'); onClose() } },
    { id: 'nav-notes', title: 'Go to Notes Workspace', category: 'Navigation', icon: FileText, action: () => { navigate('/notes'); onClose() } },
    { id: 'nav-pomodoro', title: 'Go to Pomodoro Timer', category: 'Navigation', icon: Timer, action: () => { navigate('/pomodoro'); onClose() } },
    { id: 'nav-analytics', title: 'Go to Analytics', category: 'Navigation', icon: BarChart3, action: () => { navigate('/analytics'); onClose() } },
    { id: 'nav-settings', title: 'Go to Settings', category: 'Navigation', icon: Settings, action: () => { navigate('/settings'); onClose() } },

    // Action items
    { id: 'action-task', title: 'Create New Task', category: 'Actions', icon: Plus, action: () => { onClose(); onOpenTaskModal?.() } },
    { id: 'action-habit', title: 'Create New Habit', category: 'Actions', icon: Plus, action: () => { onClose(); onOpenHabitModal?.() } },
    { id: 'action-goal', title: 'Create New Goal', category: 'Actions', icon: Plus, action: () => { onClose(); onOpenGoalModal?.() } },
    { id: 'action-note', title: 'Create New Note', category: 'Actions', icon: Plus, action: () => { onClose(); onOpenNoteModal?.() } },
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

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-background/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Command Palette Card */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-50 w-full max-w-xl shadow-[0_0_80px_rgba(var(--primary),0.15)] overflow-hidden"
            style={{
              backgroundColor: 'hsl(var(--background) / 0.6)',
              backdropFilter: 'blur(40px)',
              borderRadius: 'calc(var(--radius) * 2)',
              border: '1px solid hsl(var(--border) / 0.5)',
            }}
          >
            {/* Search input header */}
            <div className="flex items-center px-4 border-b border-border/40 relative bg-background/20">
              <Search className="h-5 w-5 text-primary/70 mr-3 shrink-0" />
              <Input
                ref={inputRef}
                placeholder="Type a command or search route..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                className="h-14 border-none bg-transparent text-base focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/50 text-foreground"
              />
              <button 
                onClick={onClose} 
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <AnimatePresence mode="popLayout">
                {filteredItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="p-8 text-center text-sm text-muted-foreground"
                  >
                    No matching commands or routes found for "{query}".
                  </motion.div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const Icon = item.icon
                    const isSelected = idx === selectedIndex
                    return (
                      <motion.button
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group relative w-full flex items-center justify-between px-3 py-3 rounded-[calc(var(--radius)-2px)] text-sm font-medium transition-colors outline-none ${
                          isSelected ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {/* Animated selection highlight */}
                        {isSelected && (
                          <motion.div
                            layoutId="palette-highlight"
                            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-[calc(var(--radius)-2px)] z-0 shadow-sm"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        <div className="relative z-10 flex items-center space-x-3">
                          <Icon className={`h-4 w-4 shrink-0 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                          <span>{item.title}</span>
                        </div>
                        <span className={`relative z-10 text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors ${isSelected ? 'bg-primary/20 text-primary' : 'text-muted-foreground/60 bg-secondary/50'}`}>
                          {item.category}
                        </span>
                      </motion.button>
                    )
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer shortcuts helper */}
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/20 border-t border-border/40 text-[11px] text-muted-foreground backdrop-blur-xl">
              <span className="flex items-center gap-1.5 font-medium">
                <Command className="h-3.5 w-3.5" /> Navigation & Action Shortcuts
              </span>
              <span className="font-medium tracking-wide">Use <kbd className="px-1 py-0.5 bg-background/50 rounded border border-border/50">↑</kbd> <kbd className="px-1 py-0.5 bg-background/50 rounded border border-border/50">↓</kbd> to navigate • <kbd className="px-1 py-0.5 bg-background/50 rounded border border-border/50">↵</kbd> to select • <kbd className="px-1 py-0.5 bg-background/50 rounded border border-border/50">Esc</kbd> to exit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
