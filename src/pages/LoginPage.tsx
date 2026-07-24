import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'
import { Mail, Lock, ArrowRight, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'

// Spring configuration for smooth layout morphing
const morphSpring = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  }),
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Transitioning state to trigger layout morph to dashboard before navigating
  const [isTransitioningOut, setIsTransitioningOut] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  const navigateWithMorph = () => {
    setIsTransitioningOut(true)
    setTimeout(() => {
      navigate(from, { replace: true })
    }, 600) // Wait for morph out animation before navigating
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' })
      return
    }
    setLoading(true)
    setMessage(null)

    const action = mode === 'signup' ? signUpWithEmail : signInWithEmail
    const { error } = await action(email, password)
    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      navigateWithMorph()
    }
  }

  const handleGuestSignIn = () => {
    signInAsGuest()
    navigateWithMorph()
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#020203] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient breathing background */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-screen"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)'
        }}
      />

      {/* Main Glass Panel */}
      <AnimatePresence>
        {!isTransitioningOut && (
          <motion.div
            layoutId="auth-card"
            transition={morphSpring}
            className="relative z-10 w-full max-w-[440px] rounded-[32px] bg-white/[0.02] border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden p-8 sm:p-12"
          >
            {/* Animated Reflection */}
            <motion.div 
              className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] pointer-events-none transform -rotate-45"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)'
              }}
              animate={{
                left: ['-100%', '100%']
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
            />

            <div className="relative z-20 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-sm text-zinc-400 font-medium">
                  {mode === 'signup' ? 'Start your premium productivity journey.' : 'Sign in to access your dashboard.'}
                </p>
              </motion.div>

              {/* Feedback alert */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className={`p-4 rounded-xl text-sm flex items-start space-x-3 border backdrop-blur-md ${
                      message.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                    )}
                    <span className="leading-snug">{message.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mode switch */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex p-1 rounded-2xl bg-black/40 border border-white/5"
              >
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    mode === 'signin'
                      ? 'bg-white/10 text-white shadow-lg border border-white/10'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    mode === 'signup'
                      ? 'bg-white/10 text-white shadow-lg border border-white/10'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Sign Up
                </button>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  custom={0}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors duration-300" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 bg-black/20 border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl text-sm text-white placeholder:text-zinc-600 transition-all duration-300 shadow-inner"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  custom={1}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors duration-300" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-12 bg-black/20 border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl text-sm text-white placeholder:text-zinc-600 transition-all duration-300 shadow-inner"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div custom={2} variants={staggerItem} initial="hidden" animate="visible" className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full h-12 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm tracking-wide overflow-hidden group transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-300/30 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12" />
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>
                </motion.div>
              </form>

              {/* Guest access */}
              <motion.div 
                custom={3} variants={staggerItem} initial="hidden" animate="visible"
                className="pt-6 border-t border-white/5"
              >
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm text-zinc-400 font-semibold hover:text-white hover:bg-white/5 transition-all duration-300 active:scale-[0.98]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Instant Demo Access</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
