import { createJSONStorage, StateStorage } from 'zustand/middleware'

export const getCurrentUserId = (): string => {
  if (typeof window === 'undefined') return 'guest'
  return localStorage.getItem('lifeos_current_user_id') || 'guest'
}

const namespacedStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const key = `${name}_${getCurrentUserId()}`
    return localStorage.getItem(key)
  },
  setItem: (name: string, value: string): void => {
    const key = `${name}_${getCurrentUserId()}`
    localStorage.setItem(key, value)
  },
  removeItem: (name: string): void => {
    const key = `${name}_${getCurrentUserId()}`
    localStorage.removeItem(key)
  }
}

export const getNamespacedStorage = () => createJSONStorage(() => namespacedStorage)
