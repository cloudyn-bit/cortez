import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TimerMode, PomodoroSettings, PomodoroStats } from '@/types/pomodoro'
import { playTimerCompletionChime, sendBrowserNotification } from '@/lib/pomodoro/audio'

interface PomodoroState {
  mode: TimerMode
  secondsLeft: number
  isRunning: boolean
  cycleCount: number // 1 to 4
  settings: PomodoroSettings
  stats: PomodoroStats

  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipSession: () => void
  switchMode: (mode: TimerMode) => void
  tick: () => void
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void
  requestNotificationPermission: () => void
}

const defaultSettings: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: true,
  autoStartFocus: false,
}

const defaultStats: PomodoroStats = {
  todayFocusSessions: 3,
  totalFocusSessions: 18,
  totalFocusMinutes: 450,
  currentCycle: 1,
  streakDays: 4,
  lastSessionDate: new Date().toISOString().split('T')[0],
}

// Get duration in seconds for a given mode
function getDurationSeconds(mode: TimerMode, settings: PomodoroSettings): number {
  if (mode === 'focus') return settings.focusDuration * 60
  if (mode === 'short_break') return settings.shortBreakDuration * 60
  if (mode === 'long_break') return settings.longBreakDuration * 60
  return 25 * 60
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      secondsLeft: defaultSettings.focusDuration * 60,
      isRunning: false,
      cycleCount: 1,
      settings: defaultSettings,
      stats: defaultStats,

      startTimer: () => set({ isRunning: true }),

      pauseTimer: () => set({ isRunning: false }),

      resetTimer: () => {
        const { mode, settings } = get()
        set({
          secondsLeft: getDurationSeconds(mode, settings),
          isRunning: false,
        })
      },

      switchMode: (newMode: TimerMode) => {
        const { settings } = get()
        set({
          mode: newMode,
          secondsLeft: getDurationSeconds(newMode, settings),
          isRunning: false,
        })
      },

      skipSession: () => {
        const { mode, cycleCount, settings } = get()

        let nextMode: TimerMode = 'focus'
        let nextCycle = cycleCount

        if (mode === 'focus') {
          if (cycleCount >= 4) {
            nextMode = 'long_break'
          } else {
            nextMode = 'short_break'
          }
        } else {
          // Break finished -> switch to focus
          nextMode = 'focus'
          nextCycle = cycleCount >= 4 ? 1 : cycleCount + 1
        }

        set({
          mode: nextMode,
          cycleCount: nextCycle,
          secondsLeft: getDurationSeconds(nextMode, settings),
          isRunning: false,
        })
      },

      tick: () => {
        const { isRunning, secondsLeft, mode, cycleCount, settings, stats } = get()

        if (!isRunning) return

        if (secondsLeft > 1) {
          set({ secondsLeft: secondsLeft - 1 })
          return
        }

        // Timer completed (reached 0)
        playTimerCompletionChime()

        const todayStr = new Date().toISOString().split('T')[0]
        const isNewDay = stats.lastSessionDate !== todayStr

        let updatedStats = { ...stats }

        let nextMode: TimerMode = 'focus'
        let nextCycle = cycleCount
        let nextIsRunning = false

        if (mode === 'focus') {
          // Update focus session statistics
          const focusMins = settings.focusDuration
          const todayCount = isNewDay ? 1 : stats.todayFocusSessions + 1
          const totalSessions = stats.totalFocusSessions + 1
          const totalMins = stats.totalFocusMinutes + focusMins

          let streak = stats.streakDays
          if (isNewDay) {
            streak = stats.streakDays + 1
          }

          updatedStats = {
            todayFocusSessions: todayCount,
            totalFocusSessions: totalSessions,
            totalFocusMinutes: totalMins,
            currentCycle: cycleCount,
            streakDays: streak,
            lastSessionDate: todayStr,
          }

          sendBrowserNotification(
            'Focus Session Complete! 🎉',
            cycleCount >= 4
              ? 'Great job! Time for a well-deserved 15-minute Long Break.'
              : 'Awesome focus! Take a 5-minute Short Break.'
          )

          if (cycleCount >= 4) {
            nextMode = 'long_break'
          } else {
            nextMode = 'short_break'
          }
          nextIsRunning = settings.autoStartBreaks
        } else {
          // Break completed
          sendBrowserNotification(
            'Break Finished! ⚡',
            'Ready to start your next Focus Session?'
          )

          nextMode = 'focus'
          nextCycle = cycleCount >= 4 ? 1 : cycleCount + 1
          nextIsRunning = settings.autoStartFocus
        }

        set({
          mode: nextMode,
          cycleCount: nextCycle,
          secondsLeft: getDurationSeconds(nextMode, settings),
          isRunning: nextIsRunning,
          stats: updatedStats,
        })
      },

      updateSettings: (newSettings) => {
        const { mode, settings, isRunning } = get()
        const merged = { ...settings, ...newSettings }

        // If not running, adjust seconds left for current mode
        const updatedSeconds = isRunning
          ? get().secondsLeft
          : getDurationSeconds(mode, merged)

        set({
          settings: merged,
          secondsLeft: updatedSeconds,
        })
      },

      requestNotificationPermission: () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          Notification.requestPermission()
        }
      },
    }),
    {
      name: 'studypilot-pomodoro-storage',
      // Exclude running timer tick state from persistence so reloads don't leave zombie active timers
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
        cycleCount: state.cycleCount,
      }),
    }
  )
)
