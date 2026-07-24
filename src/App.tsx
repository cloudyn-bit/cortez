import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PersonalizationProvider } from '@/context/PersonalizationProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { Loader2 } from 'lucide-react'

// Code-split pages for optimal bundle performance
const LandingPage = lazy(() => import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })))
const PomodoroPage = lazy(() => import('@/pages/PomodoroPage').then((m) => ({ default: m.PomodoroPage })))
const NotesPage = lazy(() => import('@/pages/NotesPage').then((m) => ({ default: m.NotesPage })))
const GoalsPage = lazy(() => import('@/pages/GoalsPage').then((m) => ({ default: m.GoalsPage })))
const TasksPage = lazy(() => import('@/pages/TasksPage').then((m) => ({ default: m.TasksPage })))
const HabitsPage = lazy(() => import('@/pages/HabitsPage').then((m) => ({ default: m.HabitsPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const PersonalizationPage = lazy(() => import('@/pages/PersonalizationPage').then((m) => ({ default: m.PersonalizationPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

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
        <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
        <span>Loading LifeOS...</span>
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
