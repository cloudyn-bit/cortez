import { useEffect, useState } from 'react'

export function AuroraBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background transition-colors duration-[calc(500ms*var(--anim-speed))]">
      {/* 
        Glassmorphism 2.0 Mesh Background
        Uses variables injected by PersonalizationProvider
      */}
      <div 
        className="absolute inset-0 opacity-[var(--bg-intensity)] transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(circle at 15% 50%, hsla(var(--primary)/0.4), transparent 50%),
            radial-gradient(circle at 85% 30%, hsla(var(--primary)/0.6), transparent 50%),
            radial-gradient(circle at 50% 80%, hsla(var(--primary)/0.3), transparent 50%)
          `,
          filter: 'blur(60px)'
        }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 mix-blend-screen [animation:aurora-drift-1_calc(45s*var(--anim-speed))_infinite_alternate_ease-in-out] will-change-transform" />
        <div className="absolute top-[20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-primary/30 mix-blend-screen [animation:aurora-drift-2_calc(55s*var(--anim-speed))_infinite_alternate_ease-in-out] will-change-transform" />
        <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-primary/10 mix-blend-screen [animation:aurora-drift-3_calc(65s*var(--anim-speed))_infinite_alternate_ease-in-out] will-change-transform" />
      </div>

      {/* Subtle particle dust overlay */}
      <div 
        className="absolute inset-0 opacity-[calc(var(--bg-intensity)*0.5)] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none mix-blend-overlay"
      />
    </div>
  )
}
