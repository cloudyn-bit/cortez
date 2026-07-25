import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

import { HTMLMotionProps } from 'framer-motion'

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  layoutId?: string
  onClick?: () => void
  tilt?: boolean
  parallax?: boolean
}

export function AnimatedCard({
  children,
  className,
  layoutId,
  onClick,
  tilt = true,
  parallax = true,
  ...props
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  // Smooth out the raw mouse values
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  // Transform coordinates into degrees for 3D rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  // Parallax background offset
  const backgroundX = useTransform(mouseXSpring, [-0.5, 0.5], ["-10%", "10%"])
  const backgroundY = useTransform(mouseYSpring, [-0.5, 0.5], ["-10%", "10%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !tilt) return
    const rect = ref.current.getBoundingClientRect()
    
    // Calculate normalized coordinates (-0.5 to 0.5)
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (tilt) {
      x.set(0)
      y.set(0)
    }
  }

  return (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative rounded-2xl border border-white/[0.05] bg-card/40 backdrop-blur-xl",
        "shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)]",
        "transition-shadow duration-500 overflow-hidden",
        onClick && "cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Glare / Reflection Effect */}
      <AnimatePresence>
        {isHovered && parallax && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ x: backgroundX, y: backgroundY }}
            className="pointer-events-none absolute -inset-[100%] z-0 rounded-[inherit] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_50%)]"
          />
        )}
      </AnimatePresence>
      
      {/* Content wrapper with z-index to stay above glare */}
      <div 
        className="relative z-10 w-full h-full"
        style={{ transform: tilt ? 'translateZ(20px)' : 'none' }}
      >
        {children}
      </div>
    </motion.div>
  )
}
