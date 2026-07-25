import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

import { HTMLMotionProps } from 'framer-motion'

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
  className?: string
  magneticPull?: number
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
}

export function MagneticButton({
  children,
  className,
  magneticPull = 0.2,
  variant = 'primary',
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current.getBoundingClientRect()
    
    // Calculate distance from center
    const xPos = (clientX - (left + width / 2)) * magneticPull
    const yPos = (clientY - (top + height / 2)) * magneticPull
    
    x.set(xPos)
    y.set(yPos)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add ripple
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const newRipple = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        id: Date.now()
      }
      setRipples(prev => [...prev, newRipple])
      
      // Cleanup ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }

    if (onClick) onClick(e)
  }

  const baseStyles = "relative overflow-hidden font-medium transition-all duration-300 outline-none flex items-center justify-center gap-2"
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border border-primary/20",
    secondary: "bg-secondary text-secondary-foreground shadow-sm border border-white/5",
    ghost: "bg-transparent hover:bg-white/5 text-foreground",
    danger: "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 border border-destructive/20",
    outline: "bg-transparent text-foreground border border-white/10 hover:bg-white/5 shadow-sm"
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {/* Glass Reflection Sweep */}
      <div 
        className={cn(
          "absolute inset-0 pointer-events-none transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[45deg] -translate-x-[150%]",
          isHovered && "translate-x-[150%]"
        )}
      />

      {/* Ripples */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.35 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
