import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { CircularTimer } from '@/components/pomodoro/CircularTimer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  BrainCircuit,
  Coffee,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Bell,
  Settings2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function PomodoroPage() {
  const {
    mode,
    stats,
    settings,
    switchMode,
    updateSettings
  } = usePomodoroStore()

  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission)
    }
  }, [])

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) return
    const permission = await Notification.requestPermission()
    setNotificationStatus(permission)
  }

  const [showSettings, setShowSettings] = useState(false)
  const [focusDur, setFocusDur] = useState(settings.focusDuration)
  const [shortDur, setShortDur] = useState(settings.shortBreakDuration)
  const [longDur, setLongDur] = useState(settings.longBreakDuration)

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      focusDuration: Math.max(1, Math.min(120, Number(focusDur))),
      shortBreakDuration: Math.max(1, Math.min(60, Number(shortDur))),
      longBreakDuration: Math.max(1, Math.min(60, Number(longDur))),
    })
    setShowSettings(false)
  }

  return (
    <PageContainer
      title="Pomodoro Timer"
      description="Stay focused with timed study sessions and breaks."
      layoutId="layout-pomodoro"
      action={
        <div className="flex items-center space-x-2">
          <Button
            variant={notificationStatus === 'granted' ? 'outline' : notificationStatus === 'denied' ? 'outline' : 'ghost'}
            size="sm"
            onClick={handleRequestNotifications}
            disabled={notificationStatus !== 'default'}
            className={cn(
              "text-xs gap-1.5 font-medium border-border/50",
              notificationStatus === 'granted' ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/10 border-emerald-500/20 opacity-100" :
              notificationStatus === 'denied' ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/10 border-rose-500/20 opacity-100" :
              "text-indigo-400 hover:text-indigo-300"
            )}
          >
            <Bell className="h-4 w-4" />
            <span>
              {notificationStatus === 'granted' ? 'Notifications Enabled ✓' :
               notificationStatus === 'denied' ? 'Notifications Blocked' :
               'Enable Push Notifications'}
            </span>
          </Button>

          <Button
            variant={showSettings ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Settings2 className="h-4 w-4" />
            <span>{showSettings ? 'Close Settings' : 'Timer Settings'}</span>
          </Button>
        </div>
      }
    >
      {/* Stat Cards Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Today's Sessions</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{stats.todayFocusSessions}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Sessions</span>
            <BrainCircuit className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-foreground">{stats.totalFocusSessions}</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Focus Mins</span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400">{stats.totalFocusMinutes}m</p>
        </Card>

        <Card className="bg-card/40 border-border/80 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Focus Streak</span>
            <Flame className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          </div>
          <p className="text-2xl font-black text-amber-400">{stats.streakDays} days</p>
        </Card>
      </div>

      {/* Settings Customization Form Drawer */}
      {showSettings && (
        <Card className="bg-card/90 border-indigo-500/40 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-indigo-400" />
            Customize Timer Durations (Minutes)
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Focus Duration</label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={focusDur}
                  onChange={(e) => setFocusDur(Number(e.target.value))}
                  className="bg-background/50 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Short Break Duration</label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={shortDur}
                  onChange={(e) => setShortDur(Number(e.target.value))}
                  className="bg-background/50 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Long Break Duration</label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={longDur}
                  onChange={(e) => setLongDur(Number(e.target.value))}
                  className="bg-background/50 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="glow" size="sm" className="font-semibold">
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Main Timer Section */}
      <Card className="bg-card/40 border-border/80 p-6 sm:p-10 flex flex-col items-center justify-center space-y-8 backdrop-blur-xl">
        {/* Mode Selector Tabs */}
        <div className="flex items-center space-x-2 bg-secondary/50 p-1.5 rounded-xl border border-border/50 text-xs">
          <button
            onClick={() => switchMode('focus')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
            <span>Focus ({settings.focusDuration}m)</span>
          </button>

          <button
            onClick={() => switchMode('short_break')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
              mode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Coffee className="h-4 w-4" />
            <span>Short Break ({settings.shortBreakDuration}m)</span>
          </button>

          <button
            onClick={() => switchMode('long_break')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
              mode === 'long_break'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Long Break ({settings.longBreakDuration}m)</span>
          </button>
        </div>

        {/* Circular Countdown Ring Component */}
        <CircularTimer />
      </Card>
    </PageContainer>
  )
}
