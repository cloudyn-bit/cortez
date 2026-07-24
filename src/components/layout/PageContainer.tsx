import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
  layoutId?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.2 },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
}

export function PageContainer({
  children,
  title,
  description,
  action,
  className,
  layoutId
}: PageContainerProps) {
  return (
    <motion.div
      layoutId={layoutId}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn("w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8", className)}
    >
      {(title || description || action) && (
        <motion.div
          variants={childVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-6 border-b border-white/[0.04]"
        >
          <div className="space-y-1.5">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-[13px] text-zinc-500 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex items-center space-x-3 shrink-0">{action}</div>}
        </motion.div>
      )}

      <div className="space-y-6">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child
          return (
            <motion.div variants={childVariants}>
              {child}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
