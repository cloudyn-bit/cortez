import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function PageContainer({
  children,
  title,
  description,
  action,
  className
}: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn("w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6", className)}
    >
      {(title || description || action) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div className="space-y-1">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-sm text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex items-center space-x-3">{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}
