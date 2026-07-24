import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemePreset = 'Aurora' | 'Midnight' | 'Ocean' | 'Carbon' | 'Glass' | 'Nebula' | 'Minimal'
export type Intensity = 'low' | 'medium' | 'high'
export type CornerRadius = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type AnimationSpeed = 'slow' | 'normal' | 'fast'
export type Density = 'compact' | 'comfort' | 'spacious'

interface PersonalizationState {
  themePreset: ThemePreset
  accentColor: string
  glassIntensity: Intensity
  backgroundIntensity: Intensity
  cornerRadius: CornerRadius
  animationSpeed: AnimationSpeed
  density: Density
  sidebarCollapsed: boolean

  setThemePreset: (preset: ThemePreset) => void
  setAccentColor: (color: string) => void
  setGlassIntensity: (intensity: Intensity) => void
  setBackgroundIntensity: (intensity: Intensity) => void
  setCornerRadius: (radius: CornerRadius) => void
  setAnimationSpeed: (speed: AnimationSpeed) => void
  setDensity: (density: Density) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  resetPersonalization: () => void
}

const defaultState = {
  themePreset: 'Aurora' as ThemePreset,
  accentColor: '#06b6d4', // Cyan as requested
  glassIntensity: 'medium' as Intensity,
  backgroundIntensity: 'medium' as Intensity,
  cornerRadius: 'lg' as CornerRadius,
  animationSpeed: 'normal' as AnimationSpeed,
  density: 'comfort' as Density,
  sidebarCollapsed: false,
}

export const usePersonalizationStore = create<PersonalizationState>()(
  persist(
    (set) => ({
      ...defaultState,
      setThemePreset: (preset) => set({ themePreset: preset }),
      setAccentColor: (color) => set({ accentColor: color }),
      setGlassIntensity: (intensity) => set({ glassIntensity: intensity }),
      setBackgroundIntensity: (intensity) => set({ backgroundIntensity: intensity }),
      setCornerRadius: (radius) => set({ cornerRadius: radius }),
      setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
      setDensity: (density) => set({ density: density }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      resetPersonalization: () => set(defaultState),
    }),
    {
      name: 'lifeos-personalization',
    }
  )
)
