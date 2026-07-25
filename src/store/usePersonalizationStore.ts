import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getNamespacedStorage } from '@/lib/storage'

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
      setThemePreset: (preset) => {
        set(() => {
          const updates: Partial<PersonalizationState> = { themePreset: preset }
          switch (preset) {
            case 'Aurora':
              updates.accentColor = '#06b6d4'
              updates.glassIntensity = 'medium'
              updates.backgroundIntensity = 'medium'
              updates.density = 'comfort'
              break
            case 'Midnight':
              updates.accentColor = '#818cf8'
              updates.glassIntensity = 'low'
              updates.backgroundIntensity = 'low'
              updates.density = 'comfort'
              break
            case 'Ocean':
              updates.accentColor = '#0ea5e9'
              updates.glassIntensity = 'medium'
              updates.backgroundIntensity = 'high'
              updates.density = 'spacious'
              break
            case 'Carbon':
              updates.accentColor = '#a1a1aa'
              updates.glassIntensity = 'low'
              updates.backgroundIntensity = 'low'
              updates.density = 'compact'
              break
            case 'Glass':
              updates.accentColor = '#e879f9'
              updates.glassIntensity = 'high'
              updates.backgroundIntensity = 'high'
              updates.density = 'spacious'
              break
            case 'Nebula':
              updates.accentColor = '#c084fc'
              updates.glassIntensity = 'high'
              updates.backgroundIntensity = 'medium'
              updates.density = 'comfort'
              break
            case 'Minimal':
              updates.accentColor = '#71717a'
              updates.glassIntensity = 'low'
              updates.backgroundIntensity = 'low'
              updates.density = 'compact'
              break
          }
          return updates
        })
      },
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
      storage: getNamespacedStorage(),
    }
  )
)
