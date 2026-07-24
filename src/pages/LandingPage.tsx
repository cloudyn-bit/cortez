import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArcReactorLogo } from '@/components/ui/ArcReactorLogo'
import { Button } from '@/components/ui/button'
import { ShieldCheck, ArrowRight } from 'lucide-react'

export function LandingPage() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress over a 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // ---------------------------------------------------------------------------
  // Scene 1: Energy Gathers & Light Moves (0% to 25%)
  // ---------------------------------------------------------------------------
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0])
  const scene1Scale = useTransform(scrollYProgress, [0, 0.25], [1, 1.2])
  const scene1Blur = useTransform(scrollYProgress, [0.15, 0.25], [0, 20])

  // ---------------------------------------------------------------------------
  // Scene 2: Glass Layers Separate (25% to 50%)
  // ---------------------------------------------------------------------------
  const scene2Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.5], [0, 1, 1, 0])
  const glassLeftX = useTransform(scrollYProgress, [0.25, 0.45], ["0%", "-50%"])
  const glassRightX = useTransform(scrollYProgress, [0.25, 0.45], ["0%", "50%"])
  const glassLayerOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1])

  // ---------------------------------------------------------------------------
  // Scene 3: The Core Assembles & Rings Rotate (45% to 75%)
  // ---------------------------------------------------------------------------
  const scene3Opacity = useTransform(scrollYProgress, [0.45, 0.55, 0.7, 0.75], [0, 1, 1, 0])
  const logoScale = useTransform(scrollYProgress, [0.5, 0.7], [0.5, 1.5])
  const logoRotate = useTransform(scrollYProgress, [0.5, 0.7], [-90, 0])

  // ---------------------------------------------------------------------------
  // Scene 4: Logo Locks & Final Reveal (75% to 100%)
  // ---------------------------------------------------------------------------
  const scene4Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1])
  const scene4Y = useTransform(scrollYProgress, [0.75, 0.85], [50, 0])
  const finalLogoScale = useTransform(scrollYProgress, [0.75, 0.85], [1.5, 1])

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#050506]">
      {/* Fixed viewport container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background ambient glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-primary mix-blend-screen filter blur-[120px]" />
        </div>

        {/* --- SCENE 1: Energy Gathers --- */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ opacity: scene1Opacity, scale: scene1Scale, filter: `blur(${scene1Blur}px)` }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-1 h-1 rounded-full bg-primary shadow-[0_0_50px_20px_hsl(var(--primary))]"
          />
          <p className="mt-8 text-sm font-medium tracking-[0.3em] text-primary/70 uppercase">Energy Gathers</p>
        </motion.div>

        {/* --- SCENE 2: Glass Layers Separate --- */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: scene2Opacity }}
        >
          <div className="relative w-[300px] h-[400px]">
            <motion.div 
              className="absolute inset-0 glass-panel border-r-0 rounded-r-none"
              style={{ x: glassLeftX, opacity: glassLayerOpacity }}
            />
            <motion.div 
              className="absolute inset-0 glass-panel border-l-0 rounded-l-none"
              style={{ x: glassRightX, opacity: glassLayerOpacity }}
            />
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium tracking-[0.3em] text-white/70 uppercase whitespace-nowrap">
              Systems Online
            </p>
          </div>
        </motion.div>

        {/* --- SCENE 3: Core Assembles --- */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ opacity: scene3Opacity }}
        >
          <motion.div style={{ scale: logoScale, rotate: logoRotate }}>
            <ArcReactorLogo size={120} animate={true} glowIntensity="high" />
          </motion.div>
        </motion.div>

        {/* --- SCENE 4: Logo Locks & Reveal --- */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
          style={{ opacity: scene4Opacity, y: scene4Y }}
        >
          <motion.div style={{ scale: finalLogoScale }} className="mb-8 pointer-events-none">
            <ArcReactorLogo size={80} animate={true} glowIntensity="medium" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            LifeOS
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-lg text-center mb-10 leading-relaxed font-medium">
            Your premium productivity companion. <br/> Focus. Track. Achieve.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
            <Button
              variant="glow"
              size="lg"
              onClick={() => navigate('/login')}
              className="gap-2 font-bold px-8 h-12 rounded-full"
            >
              <span>Initialize Workflow</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/login')}
              className="gap-2 font-semibold text-zinc-400 hover:text-white px-6 h-12 rounded-full"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Guest Access</span>
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0, 0, 0]) }}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">Scroll to Ignite</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>

      </div>
    </div>
  )
}
