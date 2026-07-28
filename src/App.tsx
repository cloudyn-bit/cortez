import React, { useEffect, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from '@/context/AuthContext'
import { PersonalizationProvider } from '@/context/PersonalizationProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { usePomodoroStore } from '@/store/usePomodoroStore'
import { useToastStore } from '@/store/useToastStore'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { Loader2 } from 'lucide-react'

// Eager imports for immediate landing & dashboard initialization
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'

// Lazy loaded secondary pages for optimized bundle size & high performance
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const PomodoroPage = React.lazy(() => import('@/pages/PomodoroPage').then(m => ({ default: m.PomodoroPage })))
const NotesPage = React.lazy(() => import('@/pages/NotesPage').then(m => ({ default: m.NotesPage })))
const GoalsPage = React.lazy(() => import('@/pages/GoalsPage').then(m => ({ default: m.GoalsPage })))
const TasksPage = React.lazy(() => import('@/pages/TasksPage').then(m => ({ default: m.TasksPage })))
const HabitsPage = React.lazy(() => import('@/pages/HabitsPage').then(m => ({ default: m.HabitsPage })))
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const PersonalizationPage = React.lazy(() => import('@/pages/PersonalizationPage').then(m => ({ default: m.PersonalizationPage })))
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

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

function NetworkMonitor() {
  useEffect(() => {
    const handleOffline = () => {
      useToastStore.getState().addToast({
        title: 'Offline Mode Activated',
        message: 'Network connection lost. Changes will continue seamlessly in offline cache.',
        type: 'warning',
        duration: 6000
      })
    }
    const handleOnline = () => {
      useToastStore.getState().addToast({
        title: 'Online',
        message: 'Network connection restored.',
        type: 'success',
        duration: 3000
      })
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

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

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
    </AnimatePresence>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <PersonalizationProvider>
        <AuthProvider>
          <GlobalTimerLoop />
          <NetworkMonitor />
          <ToastContainer />
          <Suspense fallback={<PageLoadingFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </AuthProvider>
      </PersonalizationProvider>
    </BrowserRouter>
  )
}

export default App
