import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Sparkles, Mail, Lock, ArrowRight, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleEmailPassword = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-indigo-500/30">
      {/* Premium Glow background accent */}
      <div className="absolute w-[500px] h-[400px] bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-pink-600/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Logo header */}
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25"
          >
            <div className="h-full w-full bg-[#09090B] rounded-[10px] flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Cortez</h1>
          <p className="text-xs text-zinc-400 font-medium">Your productivity companion</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-zinc-900/80 border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-xl text-white font-bold">
              {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Sign in to access your dashboard and tools
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 rounded-lg text-xs flex items-start space-x-2 border ${
                    message.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mode switch tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-800/40 p-1 border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-1.5 rounded-md font-medium transition-colors ${
                  mode === 'signin' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-1.5 rounded-md font-medium transition-colors ${
                  mode === 'signup'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 text-xs text-white transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 bg-zinc-950/50 border-white/10 focus:border-indigo-500/50 text-xs text-white transition-all shadow-inner"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="glow"
                className="w-full py-5 text-xs font-bold gap-2 mt-2 hover:-translate-y-0.5 transition-all duration-300"
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
            </form>

            {/* Quick Demo Access Option */}
            <div className="border-t border-white/10 pt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={handleGuestSignIn}
                className="w-full text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 gap-2 transition-all hover:translate-y-[-1px]"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="font-semibold">Instant Demo Access</span>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/5 py-4 bg-black/20">
            <p className="text-[10px] font-medium text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Powered by LifeOS Engine
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
