import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  avatarUrl?: string | null
  username?: string | null
  displayName?: string | null
  email?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function UserAvatar({
  avatarUrl,
  username,
  displayName,
  email,
  size = 'md',
  className
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false)

  // Reset error state if URL changes
  useEffect(() => {
    setImageError(false)
  }, [avatarUrl])

  const getFallbackInitial = () => {
    if (displayName) return displayName.charAt(0).toUpperCase()
    if (username) return username.charAt(0).toUpperCase()
    if (email) return email.charAt(0).toUpperCase()
    return 'U'
  }

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-24 h-24 text-3xl'
  }

  const showImage = avatarUrl && !imageError

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold shadow-sm transition-shadow",
        "border border-white/10 glass-panel",
        !showImage && "bg-gradient-to-br from-indigo-500/80 to-purple-600/80 text-white backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)]",
        sizeClasses[size],
        className
      )}
    >
      {showImage ? (
        <img
          src={avatarUrl}
          alt={displayName || username || 'User Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="drop-shadow-md">
          {getFallbackInitial()}
        </span>
      )}
    </motion.div>
  )
}
