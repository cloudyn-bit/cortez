import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArcReactorLogo } from '@/components/ui/ArcReactorLogo'

interface SecretNoteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SecretNoteModal({ isOpen, onClose }: SecretNoteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 15 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 350, 
        damping: 25, 
        mass: 0.8 
      } 
    },
    exit: { opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.15 } }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-auto">
          {/* Backdrop Blur */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-background/65 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Card with Soft Glow & Glassmorphism */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-[210] w-full max-w-lg p-6 sm:p-8 bg-card/90 dark:bg-card/80 backdrop-blur-3xl border border-border/80 rounded-3xl shadow-[0_0_100px_rgba(var(--primary),0.25)] overflow-hidden text-foreground transition-all duration-300"
          >
            {/* Soft Ambient Glow Effects */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 border border-white/10 dark:border-white/5 rounded-3xl pointer-events-none" />

            {/* Top Bar: Arc Reactor Logo & Confidential Badge */}
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <ArcReactorLogo size={48} animate={true} glowIntensity="high" />
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Subtle Confidential Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-widest bg-primary/15 text-primary border border-primary/30 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>Confidential</span>
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Elegant Typography Content Body */}
            <div className="space-y-4 text-sm sm:text-base leading-relaxed relative z-10 font-sans text-foreground/95">
              <p className="text-lg sm:text-xl font-bold tracking-tight text-foreground pb-1">
                Congrats! You've found the secret note.
              </p>
              
              <p className="text-muted-foreground font-light leading-relaxed">
                This project was built by me, Mohammed Ayaan, during my first year of college. It's the result of many hours of learning, experimenting, debugging, and improving.
              </p>

              <p className="text-muted-foreground font-light leading-relaxed">
                This entire project was made possible through the knowledge and guidance I gained from the Prompt Engineering course conducted by Mr. Sai Nitin and Mr. Dhruv Patel at our college. I'm sincerely grateful for their mentorship and the opportunity to learn.
              </p>

              <p className="text-muted-foreground font-light leading-relaxed">
                Thank you for taking the time to explore my project. I hope you enjoy using it as much as I enjoyed building it.
              </p>

              <div className="pt-4 border-t border-border/40 mt-6 flex items-center justify-end">
                <p className="text-sm sm:text-base font-medium italic tracking-wide text-foreground">
                  — Mohammed Ayaan
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
