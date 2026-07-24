import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Sparkles,
  Zap,
  BookOpen,
  BrainCircuit,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react'

export function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Smart Summaries",
      description: "Extract core ideas, bulleted key points, and critical takeaways from raw notes instantly."
    },
    {
      icon: Layers,
      title: "3D Active Recall Flashcards",
      description: "Interactive flippable card decks formatted for maximum memory retention."
    },
    {
      icon: BrainCircuit,
      title: "Self-Assessment Quizzes",
      description: "Multiple choice comprehension quizzes generated on the fly with detailed answer explanations."
    },
    {
      icon: Calendar,
      title: "Spaced Revision Schedules",
      description: "Automated Day 1, 3, and 7 review plans tailored to your specific study material."
    }
  ]

  return (
    <div className="min-h-screen bg-[#09090B] text-foreground flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090B]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <div className="h-full w-full bg-[#09090B] rounded-[7px] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-indigo-400" />
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              StudyPilot <span className="text-indigo-400">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-zinc-300 hover:text-white text-sm">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="glow" className="text-sm font-semibold gap-2 shadow-indigo-500/20">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 shadow-inner">
            <Zap className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>Powered by Gemini 1.5 Pro Context Pipeline</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Learn Faster. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Remember Longer.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Transform messy, unstructured study notes into an interactive learning ecosystem with summaries, 3D flashcards, self-assessment quizzes, and automated revision plans.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="glow" className="w-full sm:w-auto text-base font-bold px-8 py-6 gap-2">
                Start Studying Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold px-8 py-6 border-white/10 text-zinc-300 hover:text-white hover:bg-white/5">
                Explore Demo Workspace
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Instant AI Workspace Generation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-indigo-400" />
              <span>Secure Supabase RLS Storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 px-6 border-t border-white/5 bg-[#09090B]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need To Master Any Topic
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
              Say goodbye to passive reading. StudyPilot AI turns passive notes into active recall workouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon
              return (
                <Card key={index} className="bg-zinc-900/50 border-white/10 hover:border-indigo-500/40 transition-all duration-300 group">
                  <CardHeader className="space-y-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl text-white font-bold">
                      {feat.title}
                    </CardTitle>
                    <CardDescription className="text-zinc-400 text-sm leading-relaxed">
                      {feat.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-8 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} StudyPilot AI. Built for high-performance students.</p>
          <div className="flex items-center space-x-4 text-zinc-400">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
