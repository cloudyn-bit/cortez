import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'
import { MagicCard } from '@/components/ui/MagicCard'
import { ShinyButton } from '@/components/ui/ShinyButton'
import { AuroraBackground } from '@/components/ui/AuroraBackground'
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
  const { user, signInWithEmail, signUpWithEmail, signInAsGuest, resetPasswordForEmail } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Transitioning state to trigger layout morph to dashboard before navigating
  const [isTransitioningOut, setIsTransitioningOut] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

  // If already logged in, redirect
  useEffect(() => {
    if (user && !isTransitioningOut) {
      navigateWithMorph()
    }
  }, [user])

  const navigateWithMorph = () => {
    setIsTransitioningOut(true)
    setTimeout(() => {
      navigate(from, { replace: true })
    }, 600) // Wait for morph out animation before navigating
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || (mode !== 'forgot' && !password)) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }
    setLoading(true)
    setMessage(null)

    let error = null

    if (mode === 'signin') {
      const res = await signInWithEmail(email, password)
      error = res.error
      if (!error) {
        navigateWithMorph()
        return // avoid setLoading(false) to keep button in loading state during transition
      }
    } else if (mode === 'signup') {
      const res = await signUpWithEmail(email, password)
      error = res.error
      if (!error) {
        setMessage({ type: 'success', text: 'Registration successful! Please check your email to verify your account.' })
      }
    } else if (mode === 'forgot') {
      const res = await resetPasswordForEmail(email)
      error = res.error
      if (!error) {
        setMessage({ type: 'success', text: 'Password reset link sent! Please check your email.' })
      }
    }

    if (error) {
      setMessage({ type: 'error', text: error.message })
    }
    setLoading(false)
  }

  const handleGuestSignIn = () => {
    signInAsGuest()
    navigateWithMorph()
  }

  const getHeaderText = () => {
    if (mode === 'signup') return 'Create Account'
    if (mode === 'forgot') return 'Reset Password'
    return 'Welcome Back'
  }

  const getSubText = () => {
    if (mode === 'signup') return 'Start your premium productivity journey.'
    if (mode === 'forgot') return 'We will send you a link to reset your password.'
    return 'Sign in to access your dashboard.'
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#020203] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AuroraBackground />

      {/* Main Glass Panel */}
      <AnimatePresence>
        {!isTransitioningOut && (
          <motion.div
            layoutId="auth-card"
            transition={morphSpring}
            className="relative z-10 w-full max-w-[440px]"
          >
            <MagicCard className="p-8 sm:p-12 border-white/5 bg-background/20" gradientColor="rgba(34,211,238,0.15)">
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
                  {getHeaderText()}
                </h1>
                <p className="text-sm text-zinc-400 font-medium">
                  {getSubText()}
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
              {mode !== 'forgot' && (
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
              )}

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

                {mode !== 'forgot' && (
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
                    {mode === 'signin' && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                <motion.div custom={2} variants={staggerItem} initial="hidden" animate="visible" className="pt-2 flex flex-col gap-3">
                  <ShinyButton
                    type="submit"
                    disabled={loading}
                    className="w-full h-12"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>
                          {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In'}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </ShinyButton>
                  
                  {mode === 'forgot' && (
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors mt-2"
                    >
                      Back to Sign In
                    </button>
                  )}
                </motion.div>
              </form>

              {/* Guest access */}
              {mode !== 'forgot' && (
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
              )}
            </div>
            </MagicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
