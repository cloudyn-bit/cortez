import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArcReactorLogo } from '@/components/ui/ArcReactorLogo'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Scene 1: Title reveal (0–25%)
  const titleOpacity = useTransform(scrollYProgress, [0, 0.08, 0.22, 0.3], [0, 1, 1, 0])
  const titleY = useTransform(scrollYProgress, [0, 0.08], [40, 0])
  const titleScale = useTransform(scrollYProgress, [0.22, 0.3], [1, 0.95])

  // Scene 2: Logo assembly (25–55%)
  const logoOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.52, 0.6], [0, 1, 1, 0])
  const logoScale = useTransform(scrollYProgress, [0.2, 0.35], [0.5, 1])
  const logoRotate = useTransform(scrollYProgress, [0.2, 0.5], [90, 0])

  // Ring stagger reveals
  const ring1Opacity = useTransform(scrollYProgress, [0.22, 0.3], [0, 1])
  const ring2Opacity = useTransform(scrollYProgress, [0.26, 0.34], [0, 1])
  const ring3Opacity = useTransform(scrollYProgress, [0.30, 0.38], [0, 1])

  // Scene 3: Tagline (50–75%)
  const taglineOpacity = useTransform(scrollYProgress, [0.48, 0.56, 0.72, 0.78], [0, 1, 1, 0])
  const taglineY = useTransform(scrollYProgress, [0.48, 0.56], [30, 0])

  // Scene 4: CTA / Login form (75–100%)
  const ctaOpacity = useTransform(scrollYProgress, [0.72, 0.82], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.72, 0.82], [40, 0])
  const ctaLogoScale = useTransform(scrollYProgress, [0.72, 0.85], [1.2, 1])

  return (
    <div
      ref={containerRef}
      className="relative bg-[#050506]"
      style={{ height: '500vh' }}
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'aurora-drift-1 50s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
            top: '60%',
            left: '30%',
            animation: 'aurora-drift-2 45s ease-in-out infinite',
          }}
        />
      </div>

      {/* ─── SCENE 1: Title Reveal ─── */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white leading-none">
            Life<span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">OS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 font-medium tracking-wide uppercase">
            Your productivity operating system
          </p>
        </motion.div>
      </div>

      {/* ─── SCENE 2: Logo Assembly ─── */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{
            opacity: logoOpacity,
            scale: logoScale,
            rotate: logoRotate,
          }}
          className="relative"
        >
          {/* Staggered ring reveals */}
          <motion.div style={{ opacity: ring1Opacity }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-[280px] h-[280px] rounded-full border border-indigo-500/20 animate-[arc-rotate-slow_60s_linear_infinite]" />
          </motion.div>
          <motion.div style={{ opacity: ring2Opacity }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-[200px] h-[200px] rounded-full border border-violet-500/25 animate-[arc-rotate-medium_40s_linear_infinite] border-dashed" />
          </motion.div>
          <motion.div style={{ opacity: ring3Opacity }} className="absolute inset-0 flex items-center justify-center">
            <div className="w-[120px] h-[120px] rounded-full border border-indigo-400/30 animate-[arc-rotate-fast_25s_linear_infinite]" />
          </motion.div>

          <ArcReactorLogo size={160} animate={true} glowIntensity="high" />
        </motion.div>
      </div>

      {/* ─── SCENE 3: Tagline ─── */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ opacity: taglineOpacity, y: taglineY }}
          className="text-center space-y-6 max-w-2xl px-6"
        >
          <p className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Focus. Track. Achieve.
          </p>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Tasks, habits, goals, notes, and deep work — unified in one elegant workspace.
          </p>
        </motion.div>
      </div>

      {/* ─── SCENE 4: Enter LifeOS ─── */}
      <div className="fixed inset-0 flex items-center justify-center">
        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="text-center space-y-8 max-w-md px-6"
        >
          <motion.div style={{ scale: ctaLogoScale }}>
            <ArcReactorLogo size={64} animate={true} glowIntensity="medium" className="mx-auto" />
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enter LifeOS
            </h2>
            <p className="text-sm text-zinc-500">
              Your productivity companion awaits.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="glow"
              size="lg"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-6 text-base font-bold gap-2 pointer-events-auto active:scale-[0.97] transition-transform"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>

            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="text-xs text-zinc-500 hover:text-zinc-300 gap-1.5 pointer-events-auto"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Try as Guest
              </Button>
            </div>
          </div>

          <p className="text-[10px] text-zinc-600 font-medium">
            No credit card required · Free forever
          </p>
        </motion.div>
      </div>

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [1, 1, 1, 0]),
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-zinc-700 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-zinc-500" />
          </motion.div>
          <span className="text-[10px] text-zinc-600 font-medium tracking-wider uppercase">Scroll</span>
        </div>
      </motion.div>
    </div>
  )
}
