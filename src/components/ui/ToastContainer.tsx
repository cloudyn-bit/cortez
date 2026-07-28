import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore, ToastItem } from '@/store/useToastStore'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  }

  const borders = {
    success: 'border-emerald-500/40 bg-card/95',
    error: 'border-red-500/40 bg-card/95',
    warning: 'border-amber-500/40 bg-card/95',
    info: 'border-sky-500/40 bg-card/95'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-xl transition-all",
        borders[toast.type]
      )}
    >
      {icons[toast.type]}
      <div className="flex-1 text-xs">
        {toast.title && <p className="font-semibold text-foreground">{toast.title}</p>}
        <p className="text-muted-foreground mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
