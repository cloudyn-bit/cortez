import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCircularProgressBarProps {
  max: number
  value: number
  min?: number
  gaugePrimaryColor?: string
  gaugeSecondaryColor?: string
  className?: string
  children?: React.ReactNode
}

export function AnimatedCircularProgressBar({
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryColor = 'hsl(var(--primary))',
  gaugeSecondaryColor = 'hsl(var(--secondary))',
  className,
  children
}: AnimatedCircularProgressBarProps) {
  const circumference = 2 * Math.PI * 45
  const percentPx = circumference / 100
  const currentPercent = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100)
  
  // Dynamic glow increases as we near completion (e.g. > 90%)
  const isAlmostDone = currentPercent > 90
  const glowIntensity = isAlmostDone ? 20 : 10

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        className
      )}
    >
      <svg
        fill="none"
        className="h-full w-full"
        strokeWidth="2"
        viewBox="0 0 100 100"
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={glowIntensity / 5} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="4"
          stroke={gaugeSecondaryColor}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-20"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="4"
          stroke={gaugePrimaryColor}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - currentPercent * percentPx }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="rotate(-90 50 50)"
          filter={isAlmostDone ? "url(#glow)" : undefined}
          style={{
            filter: `drop-shadow(0 0 ${glowIntensity}px ${gaugePrimaryColor})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
