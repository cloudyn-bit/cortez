import React, { createContext, useContext, useEffect, useState } from 'react'

export interface MockUser {
  id: string
  email: string
  user_metadata: {
    full_name: string
  }
}

interface AuthContextType {
  user: MockUser | null
  loading: boolean
  isDemoUser: boolean
  signInWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>
  signInAsGuest: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false)

  useEffect(() => {
    // Check local storage for persistent session
    const savedUserStr = localStorage.getItem('lifeos_user_session')
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr) as MockUser
        setUser(savedUser)
        if (savedUser.id === 'guest-user-123') {
          setIsDemoUser(true)
        }
      } catch (err) {
        console.error('Failed to parse user session', err)
      }
    }
    setLoading(false)
  }, [])

  const persistUser = (newUser: MockUser, isGuest = false) => {
    localStorage.setItem('lifeos_user_session', JSON.stringify(newUser))
    setUser(newUser)
    setIsDemoUser(isGuest)
  }

  const signInWithEmail = async (email: string, _password?: string) => {
    setLoading(true)
    // Simulate network delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    // Accept any login for MVP local auth
    const mockUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      user_metadata: { full_name: email.split('@')[0] }
    }
    
    persistUser(mockUser)
    setLoading(false)
    return { error: null }
  }

  const signUpWithEmail = async (email: string, _password?: string) => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const mockUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      user_metadata: { full_name: email.split('@')[0] }
    }
    
    persistUser(mockUser)
    setLoading(false)
    return { error: null }
  }

  const signInAsGuest = () => {
    const guestUser: MockUser = {
      id: 'guest-user-123',
      email: 'guest@lifeos.app',
      user_metadata: { full_name: 'Guest User' }
    }
    persistUser(guestUser, true)
  }

  const signOut = async () => {
    localStorage.removeItem('lifeos_user_session')
    setUser(null)
    setIsDemoUser(false)
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
