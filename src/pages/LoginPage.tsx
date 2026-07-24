import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { ArcReactorLogo } from '@/components/ui/ArcReactorLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Mail, Lock, ArrowRight, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
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

  const from = location.state?.from?.pathname || '/dashboard'

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
      navigate(from, { replace: true })
    }
  }

  const handleGuestSignIn = () => {
    signInAsGuest()
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#050506] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Ambient glow */}
      <div className="absolute w-[500px] h-[400px] bg-gradient-to-r from-indigo-600/10 via-violet-600/8 to-purple-600/6 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] space-y-8 relative z-10"
      >
        {/* Logo + Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center space-y-3"
        >
          <ArcReactorLogo size={56} animate={true} glowIntensity="medium" className="mx-auto" />
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">LifeOS</h1>
            <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Your productivity companion</p>
          </div>
        </motion.div>

        {/* Auth Card */}
        <Card className="bg-[#0a0a0c]/80 border-white/[0.06] shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden hover:translate-y-0 hover:shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-lg text-white font-bold">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              {mode === 'signup' ? 'Start your productivity journey' : 'Sign in to your workspace'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Feedback alert */}
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-3 rounded-lg text-xs flex items-start space-x-2 border ${
                  message.type === 'success'
                    ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/8 border-rose-500/20 text-rose-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-400" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}

            {/* Mode tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-white/[0.03] p-1 border border-white/[0.04] text-xs">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-1.5 rounded-md font-medium transition-all duration-200 ${
                  mode === 'signin'
                    ? 'bg-indigo-600/90 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-1.5 rounded-md font-medium transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-indigo-600/90 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                custom={0}
                variants={staggerItem}
                initial="hidden"
                animate="visible"
                className="space-y-1.5"
              >
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors duration-200" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-white/[0.03] border-white/[0.06] focus:border-indigo-500/40 text-xs text-white placeholder:text-zinc-600 transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                custom={1}
                variants={staggerItem}
                initial="hidden"
                animate="visible"
                className="space-y-1.5"
              >
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors duration-200" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-white/[0.03] border-white/[0.06] focus:border-indigo-500/40 text-xs text-white placeholder:text-zinc-600 transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div custom={2} variants={staggerItem} initial="hidden" animate="visible">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="glow"
                  className="w-full py-5 text-xs font-bold gap-2 mt-1 active:scale-[0.97] transition-all duration-200"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Guest access */}
            <div className="border-t border-white/[0.04] pt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={handleGuestSignIn}
                className="w-full text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] gap-2 transition-all active:scale-[0.97]"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span className="font-medium">Instant Demo Access</span>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/[0.04] py-3.5 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <ArcReactorLogo size={14} animate={false} glowIntensity="low" />
              <p className="text-[10px] font-medium text-zinc-600">Powered by LifeOS Engine</p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
