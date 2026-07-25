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

export async function getOrCreateProfile(user: { id: string; email?: string; user_metadata?: any }): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  if (data && !error) return data
  
  if (error && error.code === 'PGRST116') {
    // No profile exists, create one
    const providedUsername = user.user_metadata?.username
    const emailPrefix = user.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') : 'user'
    const generatedUsername = `${emailPrefix}_${Math.floor(Math.random() * 10000)}`
    
    const newUsername = providedUsername || generatedUsername

    const newProfile = {
      id: user.id,
      username: newUsername,
      display_name: newUsername,
      bio: '',
      avatar_url: null
    }

    const { data: createdData, error: createError } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select('*')
      .single()
      
    if (createdData && !createError) return createdData
  }
  
  return null
}

interface ProfileState {
  profile: UserProfile | null
  loading: boolean
  fetchProfile: (user: { id: string; email?: string; user_metadata?: any }) => Promise<void>
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => Promise<{ error: Error | null }>
  uploadAvatar: (file: File) => Promise<{ error: Error | null, url: string | null }>
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()((set, get) => ({
  profile: null,
  loading: false,
  
  fetchProfile: async (user) => {
    set({ loading: true })
    const profile = await getOrCreateProfile(user)
    set({ profile, loading: false })
  },
  
  updateProfile: async (updates) => {
    let { profile } = get()
    
    if (!profile) {
      set({ loading: true })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        profile = await getOrCreateProfile(user)
        set({ profile })
      }
      if (!profile) {
        set({ loading: false })
        return { error: new Error('User not authenticated') }
      }
    }
    
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
  
  uploadAvatar: async (file: File) => {
    let { profile } = get()
    const { updateProfile } = get()
    
    if (!profile) {
      set({ loading: true })
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        profile = await getOrCreateProfile(user)
        set({ profile })
      }
      if (!profile) {
        set({ loading: false })
        return { error: new Error('User not authenticated'), url: null }
      }
    }
    
    set({ loading: true })
    
    // Determine extension, default to jpg
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${profile.id}/avatar.${ext}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })
      
    if (uploadError) {
      set({ loading: false })
      return { error: uploadError, url: null }
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
      
    // Append timestamp to bust browser cache
    const newAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`
    
    const { error: updateError } = await updateProfile({ avatar_url: newAvatarUrl })
    
    if (updateError) {
      set({ loading: false })
      return { error: updateError, url: null }
    }
    
    set({ loading: false })
    return { error: null, url: newAvatarUrl }
  },
  
  clearProfile: () => set({ profile: null, loading: false })
}))
