import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

// We map Supabase User to a generic interface to avoid breaking other components if they expect `user_metadata`
export interface AppUser {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
  }
}

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  isDemoUser: boolean
  signInWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>
  signInAsGuest: () => void
  signOut: () => Promise<void>
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false)

  useEffect(() => {
    // Read session from Supabase initially
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        handleUserLogin(session.user)
      } else {
        // If no supabase session, check if they were in guest mode
        const savedUserId = localStorage.getItem('lifeos_current_user_id')
        if (savedUserId === 'guest-user-123') {
          handleGuestLogin()
        }
      }
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleUserLogin(session.user)
      } else {
        // Only clear if not guest
        const savedUserId = localStorage.getItem('lifeos_current_user_id')
        if (savedUserId !== 'guest-user-123') {
          handleUserLogout()
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleUserLogin = (supabaseUser: User) => {
    const appUser: AppUser = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      user_metadata: supabaseUser.user_metadata,
    }
    
    // Check if user changed to reload stores
    const currentId = localStorage.getItem('lifeos_current_user_id')
    if (currentId && currentId !== 'guest-user-123' && currentId !== appUser.id) {
      localStorage.setItem('lifeos_current_user_id', appUser.id)
      window.location.reload()
    } else {
      localStorage.setItem('lifeos_current_user_id', appUser.id)
    }

    setUser(appUser)
    setIsDemoUser(false)
  }

  const handleGuestLogin = () => {
    const guestUser: AppUser = {
      id: 'guest-user-123',
      email: 'guest@lifeos.app',
      user_metadata: { full_name: 'Guest User' }
    }
    
    const currentId = localStorage.getItem('lifeos_current_user_id')
    if (currentId !== 'guest-user-123') {
      localStorage.setItem('lifeos_current_user_id', guestUser.id)
      // Only reload if we were previously logged in as someone else
      if (currentId && currentId !== guestUser.id) {
        window.location.reload()
      }
    }
    
    setUser(guestUser)
    setIsDemoUser(true)
  }

  const handleUserLogout = () => {
    const currentId = localStorage.getItem('lifeos_current_user_id')
    localStorage.removeItem('lifeos_current_user_id')
    setUser(null)
    setIsDemoUser(false)
    
    if (currentId && currentId !== 'guest-user-123') {
       window.location.href = '/login'
    }
  }

  const signInWithEmail = async (email: string, password?: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: password || '',
    })
    setLoading(false)
    return { error }
  }

  const signUpWithEmail = async (email: string, password?: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password: password || '',
    })
    setLoading(false)
    return { error }
  }

  const resetPasswordForEmail = async (email: string) => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setLoading(false)
    return { error }
  }

  const signInAsGuest = () => {
    handleGuestLogin()
  }

  const signOut = async () => {
    if (isDemoUser) {
      handleUserLogout()
    } else {
      await supabase.auth.signOut()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoUser,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOut,
        resetPasswordForEmail
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
