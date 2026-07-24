export type TimerMode = 'focus' | 'short_break' | 'long_break'

export interface PomodoroSettings {
  focusDuration: number // in minutes (default 25)
  shortBreakDuration: number // in minutes (default 5)
  longBreakDuration: number // in minutes (default 15)
  autoStartBreaks: boolean
  autoStartFocus: boolean
}

export interface PomodoroStats {
  todayFocusSessions: number
  totalFocusSessions: number
  totalFocusMinutes: number
  currentCycle: number // 1 to 4
  streakDays: number
  lastSessionDate?: string // YYYY-MM-DD
}
