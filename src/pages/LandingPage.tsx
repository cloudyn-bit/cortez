import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DiaTextReveal } from '@/components/ui/DiaTextReveal'
import { ShinyButton } from '@/components/ui/ShinyButton'

// Persists during SPA navigation, resets on browser refresh
let hasSeenIntro = false


function ParticleSystem() {
  // Static random values to prevent hydration errors, but we are client-side so it's fine.
  // Using small array of particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ['0%', '-50%', '0%'],
            x: ['0%', '20%', '0%'],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

function PrecisionCore() {
  return (
    <motion.div 
      layoutId="auth-card" 
      className="relative w-64 h-64 flex items-center justify-center rounded-[40px] bg-black/0"
    >
      {/* Central Glowing Point -> Core */}
      <motion.div
        className="absolute w-4 h-4 bg-cyan-300 rounded-full shadow-[0_0_40px_20px_rgba(34,211,238,0.5)]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 1.2, 1], opacity: 1 }}
        transition={{ duration: 3, times: [0, 0.6, 0.8, 1], ease: "easeInOut" }}
      />

      {/* Ring 1 - Inner fast */}
      <motion.div
        className="absolute w-24 h-24 border border-cyan-500/40 rounded-full border-t-cyan-300 border-b-transparent"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 360 }}
        transition={{ scale: { delay: 1, duration: 2 }, rotate: { duration: 4, repeat: Infinity, ease: "linear" } }}
      />

      {/* Ring 2 - Middle slow */}
      <motion.div
        className="absolute w-36 h-36 border border-zinc-700/50 rounded-full border-l-cyan-400/60 border-r-transparent"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: -360 }}
        transition={{ scale: { delay: 1.5, duration: 2 }, rotate: { duration: 8, repeat: Infinity, ease: "linear" } }}
      />

      {/* Ring 3 - Outer geometric */}
      <motion.div
        className="absolute w-48 h-48 border border-white/5 rounded-full flex items-center justify-center"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 180 }}
        transition={{ scale: { delay: 2, duration: 2 }, rotate: { duration: 12, repeat: Infinity, ease: "linear" } }}
      >
        <div className="absolute w-full h-full border-[0.5px] border-cyan-900/40 rounded-full clip-path-polygon" />
        {/* Nodes */}
        <div className="absolute top-0 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]" />
        <div className="absolute bottom-0 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]" />
      </motion.div>
    </motion.div>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState(hasSeenIntro ? 4 : 0)

  // Orchestrate the timeline
  useEffect(() => {
    if (hasSeenIntro) return

    // Stage 0: Initial dark screen + glowing point starts (0s)
    const t1 = setTimeout(() => setStage(1), 3500) // Logo mostly assembled, start text "LifeOS"
    const t2 = setTimeout(() => setStage(2), 5000) // "One dashboard."
    const t3 = setTimeout(() => setStage(3), 6500) // "Total control."
    const t4 = setTimeout(() => {
      setStage(4)
      hasSeenIntro = true
    }, 8000) // Show Enter button

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [])

  return (
    <motion.div 
      className="relative w-full h-screen bg-[#020203] overflow-hidden flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-cyan-900/10 blur-[120px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4 }}
        />
      </div>

      <ParticleSystem />

      {/* Parallax Container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 6, ease: "easeOut" }}
      >
        <PrecisionCore />

        {/* Text Sequence */}
        <div className="mt-16 h-32 flex flex-col items-center justify-start text-center">
          <AnimatePresence>
            {stage >= 1 && (
              <DiaTextReveal text="LifeOS" className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2" />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stage >= 2 && (
              <motion.p 
                className="text-lg md:text-xl text-zinc-400 font-medium"
                initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                One dashboard.
              </motion.p>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {stage >= 3 && (
              <motion.p 
                className="text-lg md:text-xl text-zinc-400 font-medium"
                initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                Total control.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Enter Button */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              initial={hasSeenIntro ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              className="mt-8 z-20"
            >
              <ShinyButton onClick={() => navigate('/login')} className="px-8 h-12 w-48 bg-white/5 border border-white/10 text-white backdrop-blur-md">
                Enter LifeOS
              </ShinyButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
