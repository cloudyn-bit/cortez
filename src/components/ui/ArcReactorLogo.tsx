import React from 'react'
import { cn } from '@/lib/utils'

interface ArcReactorLogoProps {
  size?: number
  animate?: boolean
  glowIntensity?: 'low' | 'medium' | 'high'
  className?: string
}

export function ArcReactorLogo({
  size = 40,
  animate = true,
  glowIntensity = 'medium',
  className
}: ArcReactorLogoProps) {
  const center = 50
  const glowOpacity = { low: 0.3, medium: 0.5, high: 0.8 }[glowIntensity]

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center group',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible"
      >
        <defs>
          {/* Core glow gradient */}
          <radialGradient id="arc-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={glowOpacity} />
            <stop offset="40%" stopColor="#6366f1" stopOpacity={glowOpacity * 0.6} />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </radialGradient>

          {/* Ring gradient */}
          <linearGradient id="arc-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
          </linearGradient>

          {/* Outer ring gradient */}
          <linearGradient id="arc-outer-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
          </linearGradient>

          {/* Node glow filter */}
          <filter id="arc-node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Core bloom filter */}
          <filter id="arc-core-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient glow behind everything */}
        <circle
          cx={center}
          cy={center}
          r="38"
          fill="url(#arc-core-glow)"
          className={animate ? 'arc-pulse' : ''}
          filter="url(#arc-core-bloom)"
        />

        {/* Outer ring — slowest rotation */}
        <g className={animate ? 'arc-rotate-slow' : ''} style={{ transformOrigin: '50px 50px' }}>
          <circle
            cx={center}
            cy={center}
            r="40"
            fill="none"
            stroke="url(#arc-outer-gradient)"
            strokeWidth="0.8"
            strokeDasharray="8 12"
          />
        </g>

        {/* Middle ring — medium rotation */}
        <g className={animate ? 'arc-rotate-medium' : ''} style={{ transformOrigin: '50px 50px' }}>
          <circle
            cx={center}
            cy={center}
            r="30"
            fill="none"
            stroke="url(#arc-ring-gradient)"
            strokeWidth="1"
            strokeDasharray="6 8"
          />

          {/* 6 energy nodes on middle ring */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x = center + 30 * Math.cos(rad)
            const y = center + 30 * Math.sin(rad)
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill="#818cf8"
                opacity={0.7 + (i % 2) * 0.3}
                filter="url(#arc-node-glow)"
                className={animate ? 'arc-node-pulse' : ''}
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            )
          })}
        </g>

        {/* Inner ring — fastest rotation (counter-clockwise) */}
        <g className={animate ? 'arc-rotate-fast' : ''} style={{ transformOrigin: '50px 50px' }}>
          <circle
            cx={center}
            cy={center}
            r="18"
            fill="none"
            stroke="#818cf8"
            strokeWidth="0.6"
            strokeOpacity="0.4"
            strokeDasharray="4 6"
          />

          {/* 3 inner accent nodes */}
          {[0, 120, 240].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x = center + 18 * Math.cos(rad)
            const y = center + 18 * Math.sin(rad)
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill="#a78bfa"
                opacity="0.6"
                filter="url(#arc-node-glow)"
              />
            )
          })}
        </g>

        {/* Core energy center */}
        <circle
          cx={center}
          cy={center}
          r="6"
          fill="#09090b"
          stroke="#6366f1"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        <circle
          cx={center}
          cy={center}
          r="3"
          fill="#818cf8"
          className={animate ? 'arc-core-pulse' : ''}
          filter="url(#arc-node-glow)"
        />

        {/* Cross-hair precision lines */}
        {[0, 90].map((angle) => {
          const rad = (angle * Math.PI) / 180
          const x1 = center + 8 * Math.cos(rad)
          const y1 = center + 8 * Math.sin(rad)
          const x2 = center + 15 * Math.cos(rad)
          const y2 = center + 15 * Math.sin(rad)
          const x3 = center - 8 * Math.cos(rad)
          const y3 = center - 8 * Math.sin(rad)
          const x4 = center - 15 * Math.cos(rad)
          const y4 = center - 15 * Math.sin(rad)
          return (
            <React.Fragment key={angle}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.3" />
              <line x1={x3} y1={y3} x2={x4} y2={y4} stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.3" />
            </React.Fragment>
          )
        })}
      </svg>
    </div>
  )
}
