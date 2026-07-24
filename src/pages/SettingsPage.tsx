import { PageContainer } from '@/components/layout/PageContainer'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { User, Sun, Moon, Laptop, LogOut, ShieldAlert } from 'lucide-react'

export function SettingsPage() {
  const { user, signOut, isDemoUser } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <PageContainer
      title="Account Settings"
      description="Manage your profile settings, theme preferences, and authentication."
    >
      <div className="space-y-6 max-w-3xl">
        {/* Profile Card */}
        <Card className="bg-card/40 border-border/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" />
              Profile Information
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
