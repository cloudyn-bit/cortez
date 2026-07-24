import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ShinyButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
  className?: string
}

export function ShinyButton({ children, className, disabled, onClick, ...props }: ShinyButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-full px-6 py-3 font-semibold text-white transition-all duration-300",
        "bg-primary shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {!disabled && (
        <>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:animate-shine" />
          <div className="absolute inset-0 z-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        </>
      )}
    </motion.button>
  )
}
