import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  delay?: number
  inView?: boolean
  inViewMargin?: string
}

export function BlurFade({
  children,
  className,
  delay = 0,
  inView = true,
  inViewMargin = '-50px',
}: BlurFadeProps) {
  const variants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: {
        delay,
        duration: 0.5,
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView={inView ? "visible" : undefined}
      viewport={{ once: true, margin: inViewMargin as any }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
