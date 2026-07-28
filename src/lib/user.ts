import { UserProfile } from '@/hooks/useProfile'
import { AppUser } from '@/context/AuthContext'

export function getUserDisplayName(
  profile?: UserProfile | null,
  user?: AppUser | { email?: string; user_metadata?: any } | null,
  isDemoUser?: boolean
): string {
  if (isDemoUser) {
    return 'Guest User'
  }
  if (profile?.display_name && profile.display_name.trim() !== '') {
    return profile.display_name.trim()
  }
  if (profile?.username && profile.username.trim() !== '') {
    return profile.username.trim()
  }
  if (user?.user_metadata?.full_name && user.user_metadata.full_name.trim() !== '') {
    return user.user_metadata.full_name.trim()
  }
  if (user?.email && user.email.trim() !== '') {
    return user.email.split('@')[0].trim()
  }
  return 'Member'
}
