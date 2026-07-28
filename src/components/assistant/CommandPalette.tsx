import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/context/ThemeProvider'
import { useTaskStore } from '@/store/useTaskStore'
import { useHabitStore } from '@/store/useHabitStore'
import { useGoalStore } from '@/store/useGoalStore'
import { useNoteStore } from '@/store/useNoteStore'
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
  X,
  Palette,
  ArrowRight,
  Star,
  Sparkles
} from 'lucide-react'
import { SecretNoteModal } from './SecretNoteModal'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenTaskModal?: () => void
  onOpenHabitModal?: () => void
  onOpenGoalModal?: () => void
  onOpenNoteModal?: () => void
}

type PaletteItemCategory = 'Favorites' | 'Recent' | 'Quick Actions' | 'Navigation' | 'Tasks' | 'Habits' | 'Goals' | 'Notes' | 'Commands' | 'Instant Create' | 'Secret'

interface PaletteItem {
  id: string
  title: string
  subtitle?: string
  category: PaletteItemCategory
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
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { setTheme } = useTheme()
  const { tasks, addTask } = useTaskStore()
  const { habits, addHabit } = useHabitStore()
  const { goals, addGoal } = useGoalStore()
  const { notes, addNote } = useNoteStore()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Execute and log recent
  const executeAction = (action: () => void, _queryText: string) => {
    action()
  }

  const allItems = useMemo(() => {
    const items: PaletteItem[] = []

    const qLower = query.toLowerCase().trim()

    // 1. Instant Create Mode
    if (qLower.startsWith('task ')) {
      const title = query.slice(5).trim()
      if (title) {
        items.push({
          id: 'instant-task',
          title: `Create Task: "${title}"`,
          category: 'Instant Create',
          icon: Plus,
          action: () => {
            addTask({
              title,
              description: '',
              priority: 'medium',
              category: 'personal',
              dueDate: new Date().toISOString().split('T')[0],
              completed: false,
            })
            onClose()
          }
        })
      }
    } else if (qLower.startsWith('note ')) {
      const title = query.slice(5).trim()
      if (title) {
        items.push({
          id: 'instant-note',
          title: `Create Note: "${title}"`,
          category: 'Instant Create',
          icon: Plus,
          action: () => {
            addNote({
              title,
              content: '',
              tags: [],
              pinned: false
            })
            onClose()
          }
        })
      }
    } else if (qLower.startsWith('goal ')) {
      const title = query.slice(5).trim()
      if (title) {
        items.push({
          id: 'instant-goal',
          title: `Create Goal: "${title}"`,
          category: 'Instant Create',
          icon: Plus,
          action: () => {
            addGoal({
              title,
              description: '',
              category: 'personal',
              targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] // 30 days default
            })
            onClose()
          }
        })
      }
    } else if (qLower.startsWith('habit ')) {
      const title = query.slice(6).trim()
      if (title) {
        items.push({
          id: 'instant-habit',
          title: `Create Habit: "${title}"`,
          category: 'Instant Create',
          icon: Plus,
          action: () => {
            addHabit({
              title,
              description: '',
              category: 'productivity',
              color: '#6366f1' // default indigo
            })
            onClose()
          }
        })
      }
    } else if (qLower.startsWith('>')) {
      // 2. Command Mode
      const cmd = qLower.slice(1).trim()
      const commands: PaletteItem[] = [
        { id: 'cmd-theme-dark', title: 'Theme: Dark', category: 'Commands', icon: Palette, action: () => { setTheme('dark'); onClose() } },
        { id: 'cmd-theme-light', title: 'Theme: Light', category: 'Commands', icon: Palette, action: () => { setTheme('light'); onClose() } },
        { id: 'cmd-focus', title: 'Start Focus', category: 'Commands', icon: Timer, action: () => { navigate('/pomodoro'); onClose() } },
        { id: 'cmd-dashboard', title: 'Go to Dashboard', category: 'Commands', icon: LayoutDashboard, action: () => { navigate('/dashboard'); onClose() } }
      ]
      items.push(...commands.filter(c => c.title.toLowerCase().includes(cmd)))
    } else {
      // 3. Normal Search Mode

      // Navigation & Quick Actions
      const coreItems: PaletteItem[] = [
        { id: 'fav-focus', title: 'Start Focus Session', category: 'Favorites', icon: Star, action: () => { navigate('/pomodoro'); onClose() } },
        { id: 'fav-task', title: 'New Task', category: 'Favorites', icon: Star, action: () => { onClose(); onOpenTaskModal?.() } },
        { id: 'nav-dashboard', title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => { navigate('/dashboard'); onClose() } },
        { id: 'nav-analytics', title: 'Go to Analytics', category: 'Navigation', icon: BarChart3, action: () => { navigate('/analytics'); onClose() } },
        { id: 'nav-settings', title: 'Go to Settings', category: 'Navigation', icon: Settings, action: () => { navigate('/settings'); onClose() } },
        { id: 'action-task', title: 'Create New Task', category: 'Quick Actions', icon: Plus, action: () => { onClose(); onOpenTaskModal?.() } },
        { id: 'action-habit', title: 'Create New Habit', category: 'Quick Actions', icon: Plus, action: () => { onClose(); onOpenHabitModal?.() } },
        { id: 'action-goal', title: 'Create New Goal', category: 'Quick Actions', icon: Plus, action: () => { onClose(); onOpenGoalModal?.() } },
        { id: 'action-note', title: 'Create New Note', category: 'Quick Actions', icon: Plus, action: () => { onClose(); onOpenNoteModal?.() } },
      ]

      if (qLower) {
        const secretKeywords = ['secret', 'secret note', 'about developer', 'developer', 'creator']
        const matchesSecret = secretKeywords.includes(qLower) || 
          ['secret', 'developer', 'creator'].some(term => qLower.length >= 4 && qLower.includes(term))

        if (matchesSecret) {
          items.push({
            id: 'secret-note-command',
            title: '📜 Secret Note from the Developer',
            category: 'Secret',
            icon: Sparkles,
            action: () => {
              onClose()
              setIsSecretModalOpen(true)
            }
          })
        }

        items.push(...coreItems.filter(i => i.title.toLowerCase().includes(qLower)))
        
        // Search through Data Stores
        tasks.forEach(t => {
          if (t.title.toLowerCase().includes(qLower)) {
            items.push({ id: `task-${t.id}`, title: t.title, subtitle: t.dueDate, category: 'Tasks', icon: CheckSquare, action: () => { navigate('/tasks'); onClose() } })
          }
        })
        habits.forEach(h => {
          if (h.title.toLowerCase().includes(qLower)) {
            items.push({ id: `habit-${h.id}`, title: h.title, category: 'Habits', icon: Flame, action: () => { navigate('/habits'); onClose() } })
          }
        })
        goals.forEach(g => {
          if (g.title.toLowerCase().includes(qLower)) {
            items.push({ id: `goal-${g.id}`, title: g.title, subtitle: `${g.progress}% completed`, category: 'Goals', icon: Target, action: () => { navigate('/goals'); onClose() } })
          }
        })
        notes.forEach(n => {
          if (n.title.toLowerCase().includes(qLower)) {
            items.push({ id: `note-${n.id}`, title: n.title, category: 'Notes', icon: FileText, action: () => { navigate('/notes'); onClose() } })
          }
        })
      } else {
        // Empty query -> Show Favorites and Quick Actions
        items.push(...coreItems.filter(i => i.category === 'Favorites' || i.category === 'Quick Actions'))
      }
    }

    return items
  }, [query, tasks, habits, goals, notes, navigate, onClose, onOpenTaskModal, onOpenHabitModal, onOpenGoalModal, onOpenNoteModal, setTheme])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (allItems[selectedIndex]) {
        executeAction(allItems[selectedIndex].action, query)
      }
    } else if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (allItems[selectedIndex] && query.trim() !== '') {
        setQuery(allItems[selectedIndex].title)
      }
    }
  }

  // Effect to keep selected index in bounds when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query, allItems.length])

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 0 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 30, mass: 0.8 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pt-[5vh] pb-[15vh] p-4 pointer-events-auto">
          {/* Backdrop Blur */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-background/50 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Command Palette Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-50 w-full max-w-2xl bg-card/95 backdrop-blur-3xl border border-border/60 rounded-2xl shadow-[0_0_80px_rgba(var(--primary),0.15)] overflow-hidden"
          >
            {/* Search Input Header */}
            <div className="flex items-center px-4 border-b border-border/40 relative bg-background/50">
              <Search className="h-5 w-5 text-primary mr-3 shrink-0" />
              <Input
                ref={inputRef}
                aria-label="Command Palette Search"
                placeholder="Type a command, search routes, or 'task ...' to create"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-16 border-none bg-transparent text-lg focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/60 text-foreground"
              />
              {query && (
                <button 
                  onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                  className="mr-2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="px-2 py-1 bg-secondary rounded text-[10px] font-mono text-muted-foreground font-semibold border border-border/50">
                ESC
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-[50vh] overflow-y-auto p-2 scrollbar-none">
              <AnimatePresence mode="popLayout">
                {allItems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, filter: 'blur(4px)' }} 
                    animate={{ opacity: 1, filter: 'blur(0px)' }} 
                    exit={{ opacity: 0 }}
                    className="p-10 text-center flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">No results found for "{query}"</p>
                      <p className="text-xs text-muted-foreground mt-1">Try creating something instantly instead</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      <button onClick={() => setQuery('task ' + query)} className="text-[11px] px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20">
                        Create Task
                      </button>
                      <button onClick={() => setQuery('note ' + query)} className="text-[11px] px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-colors border border-pink-500/20">
                        Create Note
                      </button>
                      <button onClick={() => setQuery('goal ' + query)} className="text-[11px] px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 transition-colors border border-violet-500/20">
                        Create Goal
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-1">
                    {(() => {
                      let lastCategory = '';
                      return allItems.map((item, idx) => {
                        const showCategory = item.category !== lastCategory;
                        lastCategory = item.category;
                        const Icon = item.icon
                        const isSelected = idx === selectedIndex
                        
                        return (
                          <div key={item.id}>
                            {showCategory && (
                              <div className="px-3 py-2 mt-2 first:mt-0 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                {item.category}
                              </div>
                            )}
                            <motion.button
                              layout
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.15 }}
                              onClick={() => executeAction(item.action, query)}
                              onMouseEnter={() => setSelectedIndex(idx)}
                              className={`group relative w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-all outline-none ${
                                isSelected ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {/* Animated selection highlight */}
                              {isSelected && (
                                <motion.div
                                  layoutId="palette-highlight"
                                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl z-0 shadow-sm backdrop-blur-md"
                                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                              )}
                              
                              <div className="relative z-10 flex items-center space-x-3">
                                <Icon className={`h-4 w-4 shrink-0 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                <div className="flex flex-col items-start">
                                  <span>{item.title}</span>
                                  {item.subtitle && (
                                    <span className="text-[10px] text-muted-foreground font-normal">{item.subtitle}</span>
                                  )}
                                </div>
                              </div>
                              <span className={`relative z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </motion.button>
                          </div>
                        )
                      })
                    })()}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer shortcuts helper */}
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-t border-border/40 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium">
                <Command className="h-3.5 w-3.5" /> Pro tip: Type <kbd className="px-1 py-0.5 bg-background/50 rounded font-mono">&gt;</kbd> for commands or <kbd className="px-1 py-0.5 bg-background/50 rounded font-mono">task</kbd> to create.
              </span>
              <span className="font-medium tracking-wide flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-background/50 rounded border border-border/50">↑</kbd> 
                <kbd className="px-1 py-0.5 bg-background/50 rounded border border-border/50">↓</kbd> to navigate • 
                <kbd className="px-1 py-0.5 bg-background/50 rounded border border-border/50">↵</kbd> to execute
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    <SecretNoteModal
      isOpen={isSecretModalOpen}
      onClose={() => setIsSecretModalOpen(false)}
    />
    </>
  )
}
