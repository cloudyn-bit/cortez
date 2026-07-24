import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BookOpen, Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <BookOpen className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white">404 - Knowledge Not Found</h1>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          The requested page or study session does not exist or may have been moved.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <Link to="/dashboard">
          <Button variant="glow" size="default" className="gap-2 font-semibold">
            <Home className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
