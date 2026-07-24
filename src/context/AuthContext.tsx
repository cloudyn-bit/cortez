import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isDemoUser: boolean
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signInAsGuest: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false)

  useEffect(() => {
    // Check demo user in localStorage
    const savedDemoUser = localStorage.getItem('studypilot_demo_user')
    if (savedDemoUser) {
      setIsDemoUser(true)
      setUser({
        id: 'demo-user-123',
        email: 'demo@studypilot.ai',
        app_metadata: {},
        user_metadata: { full_name: 'Demo Student' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User)
      setLoading(false)
      return
    }

    // Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signInAsGuest = () => {
    localStorage.setItem('studypilot_demo_user', 'true')
    setIsDemoUser(true)
    setUser({
      id: 'demo-user-123',
      email: 'demo@studypilot.ai',
      app_metadata: {},
      user_metadata: { full_name: 'Demo Student' },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User)
  }

  const signOut = async () => {
    if (isDemoUser) {
      localStorage.removeItem('studypilot_demo_user')
      setIsDemoUser(false)
      setUser(null)
      setSession(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isDemoUser,
        signInWithMagicLink,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
