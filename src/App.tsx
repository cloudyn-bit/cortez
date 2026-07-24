import { useEffect, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PersonalizationProvider } from '@/context/PersonalizationProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { Loader2 } from 'lucide-react'

// Eager imports for seamless shared layout animations (zero loading screens)
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { PomodoroPage } from '@/pages/PomodoroPage'
import { NotesPage } from '@/pages/NotesPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { TasksPage } from '@/pages/TasksPage'
import { HabitsPage } from '@/pages/HabitsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PersonalizationPage } from '@/pages/PersonalizationPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function GlobalTimerLoop() {
  const tick = usePomodoroStore((state) => state.tick)
  const isRunning = usePomodoroStore((state) => state.isRunning)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, tick])

  return null
}

function PageLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span>Initializing...</span>
      </div>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <PersonalizationProvider>
        <AuthProvider>
          <GlobalTimerLoop />
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected dashboard routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/pomodoro" element={<PomodoroPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/personalization" element={<PersonalizationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        </AuthProvider>
      </PersonalizationProvider>
    </BrowserRouter>
  )
}

export default App
