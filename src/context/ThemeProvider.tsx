import React, { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUserId } from "@/lib/storage"
import { useProfileStore } from "@/hooks/useProfile"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "lifeos-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}_${getCurrentUserId()}`) as Theme) || defaultTheme
  )

  const profile = useProfileStore((state) => state.profile)

  // Sync theme from profile when fetched or updated
  useEffect(() => {
    if (profile?.theme_preference && ['dark', 'light', 'system'].includes(profile.theme_preference)) {
      if (profile.theme_preference !== theme) {
        setThemeState(profile.theme_preference as Theme)
        localStorage.setItem(`${storageKey}_${getCurrentUserId()}`, profile.theme_preference)
      }
    }
  }, [profile?.theme_preference])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(`${storageKey}_${getCurrentUserId()}`, newTheme)
      setThemeState(newTheme)
      
      // Try updating in Supabase if user is logged in
      const currentProfile = useProfileStore.getState().profile
      if (currentProfile && currentProfile.id !== 'guest-user-123') {
        useProfileStore.getState().updateProfile({ theme_preference: newTheme } as any).catch(() => {})
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
