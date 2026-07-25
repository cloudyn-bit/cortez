import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TextAnimate } from '@/components/ui/TextAnimate'

interface PageContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
  layoutId?: string
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
      type: "spring", stiffness: 300, damping: 30
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 20,
    transition: { duration: 0.15, ease: "easeOut" },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8
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
    <motion.main
      layout
      layoutId={layoutId || "page-container"}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn("w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8", className)}
    >
      {(title || description || action) && (
        <motion.div
          layout="position"
          variants={childVariants}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-6 border-b border-white/[0.04]"
        >
          <div className="space-y-1.5">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                <TextAnimate text={title} animation="blurInUp" by="character" once />
              </h1>
            )}
            {description && (
              <div className="text-[13px] text-zinc-500 max-w-2xl leading-relaxed">
                <TextAnimate text={description} animation="blurInUp" by="word" once />
              </div>
            )}
          </div>
          {action && <div className="flex items-center space-x-3 shrink-0">{action}</div>}
        </motion.div>
      )}

      <div className="space-y-6">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child
          return (
            <motion.div layout="position" variants={childVariants} key={`child-${index}`}>
              {child}
            </motion.div>
          )
        })}
      </div>
    </motion.main>
  )
}
