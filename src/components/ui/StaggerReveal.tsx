import React from 'react'
import { motion } from 'framer-motion'

interface StaggerRevealProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.05,
    },
  }),
}

const itemVariants = {
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

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.06,
}: StaggerRevealProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={staggerDelay}
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return (
          <motion.div variants={itemVariants}>
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
