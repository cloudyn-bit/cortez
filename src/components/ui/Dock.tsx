import React, { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring, MotionValue } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface DockProps {
  items: {
    title: string
    icon: React.ElementType
    href: string
  }[]
  className?: string
}

function DockIcon({
  mouseX,
  icon: Icon,
  href,
}: {
  mouseX: MotionValue
  icon: React.ElementType
  href: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname.startsWith(href)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-100, 0, 100], [40, 60, 40])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={() => navigate(href)}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-full transition-colors",
        isActive 
          ? "bg-primary/20 text-primary border border-primary/30" 
          : "bg-secondary/50 text-muted-foreground hover:bg-secondary border border-transparent"
      )}
    >
      <Icon className="h-1/2 w-1/2" />
    </motion.button>
  )
}

export function Dock({ items, className }: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden",
        className
      )}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-16 items-end gap-2 rounded-2xl border border-border/40 bg-background/60 p-2 pb-2 shadow-xl backdrop-blur-xl"
      >
        {items.map((item) => (
          <DockIcon mouseX={mouseX} key={item.title} {...item} />
        ))}
      </motion.div>
    </div>
  )
}
