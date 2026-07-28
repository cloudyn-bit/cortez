import { create } from 'zustand'

export interface ToastItem {
  id: string
  title?: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

interface ToastState {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastItem = {
      id,
      duration: toast.duration ?? 4000,
      ...toast,
    }
    set((state) => ({ toasts: [...state.toasts, newToast] }))

    if (newToast.duration !== Infinity && (newToast.duration || 0) > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, newToast.duration)
    }
    return id
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearAll: () => set({ toasts: [] }),
}))
