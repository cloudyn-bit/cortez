import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Sparkles, Mail, Lock, ArrowRight, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    signInWithMagicLink,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest
  } = useAuth()

  const [mode, setMode] = useState<'magic' | 'password' | 'signup'>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }
    setLoading(true)
    setMessage(null)

    const { error } = await signInWithMagicLink(email)
    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send magic link.' })
    } else {
      setMessage({
        type: 'success',
        text: 'Magic link sent! Check your email inbox to complete sign-in.'
      })
    }
  }

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

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setMessage(null)
    const { error } = await signInWithGoogle()
    setLoading(false)
    if (error) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  const handleGuestSignIn = () => {
    signInAsGuest()
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-indigo-500/30">
      {/* Glow background accent */}
      <div className="absolute w-[400px] h-[300px] bg-gradient-to-r from-indigo-600/15 to-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="h-full w-full bg-[#09090B] rounded-[10px] flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white">StudyPilot AI</h1>
          <p className="text-xs text-zinc-400">Your AI-powered personal tutor</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-zinc-900/80 border-white/10 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl text-white font-bold">
              {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Sign in to access your study sessions and AI tools
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Feedback alert */}
            {message && (
              <div
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
              </div>
            )}

            {/* Google OAuth Button */}
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full bg-zinc-800/60 border-white/10 hover:bg-zinc-800 text-zinc-200 text-xs py-5 font-semibold gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-zinc-900 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Or email
              </span>
            </div>

            {/* Mode switch tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-800/40 p-1 border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => setMode('magic')}
                className={`py-1.5 rounded-md font-medium transition-colors ${
                  mode === 'magic' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Magic Link
              </button>
              <button
                type="button"
                onClick={() => setMode('password')}
                className={`py-1.5 rounded-md font-medium transition-colors ${
                  mode === 'password' || mode === 'signup'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Password
              </button>
            </div>

            {/* Form */}
            {mode === 'magic' ? (
              <form onSubmit={handleMagicLink} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-zinc-950/50 border-white/10 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="glow"
                  className="w-full py-5 text-xs font-semibold gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  <span>Send Magic Link</span>
                </Button>
              </form>
            ) : (
              <form onSubmit={handleEmailPassword} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-zinc-950/50 border-white/10 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 bg-zinc-950/50 border-white/10 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="glow"
                  className="w-full py-5 text-xs font-semibold gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                  )}
                </Button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'signup' ? 'password' : 'signup')}
                    className="text-xs text-zinc-400 hover:text-indigo-300 transition-colors"
                  >
                    {mode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Access Option */}
            <div className="border-t border-white/10 pt-3">
              <Button
                variant="ghost"
                type="button"
                onClick={handleGuestSignIn}
                className="w-full text-xs text-indigo-400 hover:bg-indigo-500/10 gap-1.5"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Instant Demo Access (Skip Sign In)</span>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/5 py-3">
            <p className="text-[11px] text-zinc-500">
              Secured with Supabase Row Level Security
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
