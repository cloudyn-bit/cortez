
interface ArcReactorLogoProps {
  size?: number
  animate?: boolean
  glowIntensity?: 'low' | 'medium' | 'high'
  className?: string
}

export function ArcReactorLogo({ 
  size = 64, 
  animate = true, 
  glowIntensity = 'medium',
  className = ''
}: ArcReactorLogoProps) {
  
  const getGlowOpacity = () => {
    switch (glowIntensity) {
      case 'low': return 0.2
      case 'medium': return 0.4
      case 'high': return 0.7
      default: return 0.4
    }
  }

  // Dynamic stroke widths based on size
  const strokeInner = Math.max(1, size / 32)
  const strokeMid = Math.max(1.5, size / 24)
  const strokeOuter = Math.max(2, size / 16)

  return (
    <div 
      className={`relative inline-flex items-center justify-center group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* 
        Ambient Drop Glow behind the entire logo 
        Using CSS variable for personalization sync
      */}
      <div 
        className="absolute inset-0 rounded-full blur-[10px] bg-primary/30 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100"
        style={{ opacity: getGlowOpacity() }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>

          <filter id="bloom" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. OUTER RING (Rotating Clockwise) */}
        <g className={animate ? 'arc-rotate-slow origin-center' : ''}>
          <circle 
            cx="50" cy="50" r="44" 
            stroke="hsla(var(--primary)/0.2)" 
            strokeWidth={strokeOuter} 
            strokeDasharray="40 10 5 10" 
            className="transition-colors duration-500"
          />
          <circle 
            cx="50" cy="50" r="48" 
            stroke="hsla(var(--primary)/0.1)" 
            strokeWidth="0.5" 
          />
        </g>

        {/* 2. MIDDLE RING (Rotating Counter-Clockwise) */}
        <g className={animate ? 'arc-rotate-medium origin-center' : ''}>
          <circle 
            cx="50" cy="50" r="32" 
            stroke="hsla(var(--primary)/0.4)" 
            strokeWidth={strokeMid}
            strokeDasharray="12 8" 
          />
          {/* Energy Nodes on Middle Ring */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle
              key={angle}
              cx={50 + 32 * Math.cos((angle * Math.PI) / 180)}
              cy={50 + 32 * Math.sin((angle * Math.PI) / 180)}
              r="3"
              fill="hsl(var(--primary))"
              className={animate ? 'arc-node-pulse' : ''}
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </g>

        {/* 3. INNER RING (Rotating Fast) */}
        <g className={animate ? 'arc-rotate-fast origin-center' : ''}>
          <circle 
            cx="50" cy="50" r="20" 
            stroke="hsla(var(--primary)/0.6)" 
            strokeWidth={strokeInner}
            strokeDasharray="4 4"
          />
        </g>

        {/* 4. STATIC CROSSHAIRS (Precision tech feel) */}
        <g stroke="hsla(var(--primary)/0.3)" strokeWidth="0.5">
          <line x1="50" y1="2" x2="50" y2="10" />
          <line x1="50" y1="90" x2="50" y2="98" />
          <line x1="2" y1="50" x2="10" y2="50" />
          <line x1="90" y1="50" x2="98" y2="50" />
        </g>

        {/* 5. THE GLOWING ENERGY CORE */}
        <g filter="url(#bloom)" className={animate ? 'arc-core-pulse origin-center' : ''}>
          <circle cx="50" cy="50" r="12" fill="url(#core-glow)" />
          <circle cx="50" cy="50" r="4" fill="#ffffff" className="opacity-90" />
        </g>

      </svg>
    </div>
  )
}
