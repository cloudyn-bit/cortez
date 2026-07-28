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
  title,
}: {
  mouseX: MotionValue
  icon: React.ElementType
  href: string
  title: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname.startsWith(href)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-100, 0, 100], [44, 62, 44])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={() => navigate(href)}
      aria-label={title}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-2xl min-w-[44px] min-h-[44px] transition-all shadow-sm",
        isActive 
          ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_12px_hsl(var(--primary)/0.3)]" 
          : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/40"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
    </motion.button>
  )
}

export function Dock({ items, className }: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <div
      className={cn(
        "fixed bottom-3 left-1/2 -translate-x-1/2 z-50 md:hidden max-w-[95vw] pb-safe",
        className
      )}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-16 items-center gap-2 rounded-2xl border border-border/60 bg-card/85 px-3 shadow-2xl backdrop-blur-2xl"
      >
        {items.map((item) => (
          <DockIcon mouseX={mouseX} key={item.title} {...item} />
        ))}
      </motion.div>
    </div>
  )
}
