import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at?: string
  updated_at?: string
}

interface ProfileState {
  profile: UserProfile | null
  loading: boolean
  fetchProfile: (userId: string) => Promise<void>
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => Promise<{ error: Error | null }>
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  profile: null,
  loading: false,
  
  fetchProfile: async (userId: string) => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (data && !error) {
      set({ profile: data, loading: false })
    } else {
      set({ profile: null, loading: false })
    }
  },
  
  updateProfile: async (updates) => {
    const { profile } = get()
    if (!profile) return { error: new Error('No profile loaded') }
    
    set({ loading: true })
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single()
      
    if (data && !error) {
      set({ profile: data, loading: false })
      return { error: null }
    }
    set({ loading: false })
    return { error }
  },
  
  clearProfile: () => set({ profile: null, loading: false })
}))
