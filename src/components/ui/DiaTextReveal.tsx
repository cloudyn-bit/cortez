import { motion } from 'framer-motion'

interface DiaTextRevealProps {
  text: string
  className?: string
  duration?: number
}

export function DiaTextReveal({ text, className = '' }: DiaTextRevealProps) {
  const characters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const child = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`flex space-x-1 ${className}`}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block relative text-transparent bg-clip-text"
          style={{
            backgroundImage: 'linear-gradient(to bottom, hsl(var(--foreground)), hsl(var(--foreground)/0.5))',
            textShadow: '0px 0px 30px hsl(var(--primary) / 0.5)'
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}
