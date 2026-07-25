import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeProvider'
import { useProfileStore } from '@/hooks/useProfile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { User, Sun, Moon, Laptop, LogOut, ShieldAlert, Edit2, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function SettingsPage() {
  const { user, signOut, isDemoUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const { profile, updateProfile } = useProfileStore()
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', display_name: '', bio: '' })
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [updateMessage, setUpdateMessage] = useState('')

  useEffect(() => {
    if (profile) {
      setEditForm({
        username: profile.username || '',
        display_name: profile.display_name || '',
        bio: profile.bio || ''
      })
    }
  }, [profile])

  const handleSaveProfile = async () => {
    if (!editForm.username.trim()) {
      setUpdateStatus('error')
      setUpdateMessage('Username cannot be empty')
      return
    }

    const regex = /^[a-zA-Z0-9_]{3,20}$/
    if (!regex.test(editForm.username)) {
      setUpdateStatus('error')
      setUpdateMessage('Username must be 3-20 characters (letters, numbers, underscores)')
      return
    }

    setUpdateStatus('loading')
    const { error } = await updateProfile(editForm)
    if (error) {
      setUpdateStatus('error')
      // Postgres unique violation code is usually 23505
      if (error.message?.includes('duplicate key') || error.message?.includes('unique')) {
        setUpdateMessage('Username is already taken')
      } else {
        setUpdateMessage(error.message || 'Failed to update profile')
      }
    } else {
      setUpdateStatus('success')
      setUpdateMessage('Profile updated successfully')
      setIsEditingProfile(false)
      setTimeout(() => setUpdateStatus('idle'), 3000)
    }
  }

  const handleCancelProfile = () => {
    setIsEditingProfile(false)
    if (profile) {
      setEditForm({
        username: profile.username || '',
        display_name: profile.display_name || '',
        bio: profile.bio || ''
      })
    }
    setUpdateStatus('idle')
  }

  return (
    <PageContainer
      title="Account Settings"
      description="Manage your profile settings, theme preferences, and authentication."
    >
      <div className="space-y-6 max-w-3xl">
        {/* Public Profile Card */}
        <Card className="bg-card/40 border-border/80">
          <CardHeader className="space-y-1 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-400" />
                Public Profile
              </CardTitle>
              <CardDescription>Your public presence</CardDescription>
            </div>
            {!isEditingProfile && !isDemoUser && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(true)} className="h-8 text-xs font-semibold">
                <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4 text-sm relative">
            <AnimatePresence mode="wait">
              {isEditingProfile ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Username</label>
                    <Input 
                      value={editForm.username} 
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value.toLowerCase() }))} 
                      placeholder="johndoe"
                      className="h-9 bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Display Name</label>
                    <Input 
                      value={editForm.display_name} 
                      onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))} 
                      placeholder="John Doe"
                      className="h-9 bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Bio</label>
                    <textarea 
                      value={editForm.bio} 
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))} 
                      placeholder="A short bio about yourself..."
                      className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none"
                    />
                  </div>
                  
                  {updateStatus === 'error' && (
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-medium p-2 bg-rose-500/10 rounded-md border border-rose-500/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {updateMessage}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" onClick={handleCancelProfile} disabled={updateStatus === 'loading'}>
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveProfile} 
                      disabled={updateStatus === 'loading'}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[80px]"
                    >
                      {updateStatus === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-[120px_1fr] gap-4 py-1 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Username</span>
                    <span className="text-foreground">{profile?.username || <span className="text-muted-foreground italic">Not set</span>}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 py-1 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Display Name</span>
                    <span className="text-foreground">{profile?.display_name || <span className="text-muted-foreground italic">Not set</span>}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 py-1 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Bio</span>
                    <span className="text-foreground whitespace-pre-wrap">{profile?.bio || <span className="text-muted-foreground italic">No bio provided</span>}</span>
                  </div>

                  <AnimatePresence>
                    {updateStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="flex items-center gap-2 text-emerald-400 text-xs font-medium p-2 bg-emerald-500/10 rounded-md border border-emerald-500/20"
                      >
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        {updateMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card className="bg-card/40 border-border/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <LogOut className="h-5 w-5 text-zinc-400" />
              Account Settings
            </CardTitle>
            <CardDescription>Your registered account credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border/40">
              <span className="text-muted-foreground">Email Address</span>
              <span className="font-medium text-foreground">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/40">
              <span className="text-muted-foreground">Account Status</span>
              <span className="font-medium text-indigo-400">
                {isDemoUser ? 'Demo Guest Account' : 'Supabase Authenticated'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Theme Preferences */}
        <Card className="bg-card/40 border-border/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">Appearance Theme</CardTitle>
            <CardDescription>Customize the application visual theme</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-600/10 text-indigo-300'
                  : 'border-border/60 bg-background/40 text-muted-foreground hover:bg-accent'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span>Dark (Default)</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'border-indigo-500 bg-indigo-600/10 text-indigo-300'
                  : 'border-border/60 bg-background/40 text-muted-foreground hover:bg-accent'
              }`}
            >
              <Sun className="h-5 w-5" />
              <span>Light</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'system'
                  ? 'border-indigo-500 bg-indigo-600/10 text-indigo-300'
                  : 'border-border/60 bg-background/40 text-muted-foreground hover:bg-accent'
              }`}
            >
              <Laptop className="h-5 w-5" />
              <span>System</span>
            </button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Actions related to your session and data</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Sign Out</p>
              <p className="text-xs text-muted-foreground">Terminate your current session</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => signOut()} className="gap-1.5 text-xs font-semibold">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
