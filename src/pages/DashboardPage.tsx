import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TodayTasksWidget } from '@/components/tasks/TodayTasksWidget'
import {
  Sparkles,
  BookOpen,
  Layers,
  BrainCircuit,
  Calendar,
  Plus,
  ArrowRight,
  Clock,
  Sparkle
} from 'lucide-react'

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'new'>('sessions')
  const [notesInput, setNotesInput] = useState('')
  const [titleInput, setTitleInput] = useState('')

  const mockSessions = [
    {
      id: 'roman-history',
      title: 'Roman Empire History & Fall',
      date: '2 hours ago',
      summarySnippet: 'Detailed analysis of the political, economic, and military causes leading to the fall of the Western Roman Empire.',
      topics: ['Ancient History', 'Pax Romana', 'Julius Caesar'],
      cardsCount: 12,
      quizCount: 5,
    },
    {
      id: 'quantum-physics',
      title: 'Quantum Physics Principles',
      date: 'Yesterday',
      summarySnippet: 'Exploration of wave-particle duality, Heisenberg uncertainty principle, and Schrödinger equation basics.',
      topics: ['Physics', 'Quantum Mechanics', 'Photons'],
      cardsCount: 16,
      quizCount: 8,
    },
    {
      id: 'organic-chemistry',
      title: 'Organic Chemistry Reactions',
      date: '3 days ago',
      summarySnippet: 'Reaction mechanisms for electrophilic additions, nucleophilic substitutions (SN1 & SN2), and eliminations.',
      topics: ['Chemistry', 'SN1/SN2', 'Alkenes'],
      cardsCount: 20,
      quizCount: 10,
    }
  ]

  return (
    <PageContainer
      title="Study Workspace"
      description="Manage your study sessions, paste raw notes, and track your daily tasks."
      action={
        <Button
          variant="glow"
          size="sm"
          onClick={() => setActiveTab(activeTab === 'new' ? 'sessions' : 'new')}
          className="gap-2 font-semibold"
        >
          {activeTab === 'new' ? (
            <>
              <BookOpen className="h-4 w-4" />
              <span>View Workspace</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>New Study Session</span>
            </>
          )}
        </Button>
      }
    >
      {/* Today's Tasks Widget Integration */}
      <TodayTasksWidget />

      {activeTab === 'new' ? (
        <Card className="bg-card/70 border-border/80 shadow-xl max-w-3xl mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>AI Material Generator</span>
            </div>
            <CardTitle className="text-xl">Create New Study Session</CardTitle>
            <CardDescription>
              Paste your lecture notes, textbook chapters, or articles to generate a full learning workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Session Title</label>
              <input
                type="text"
                placeholder="e.g., Cellular Biology Chapter 4"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Raw Study Notes / Text</label>
              <textarea
                rows={8}
                placeholder="Paste raw notes here... (e.g., Mitochondria are the powerhouse of the cell...)"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full p-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y font-sans text-foreground"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
              <span>Supports up to 50,000 characters</span>
              <Link to="/session/roman-history">
                <Button variant="glow" size="default" className="gap-2">
                  <Sparkle className="h-4 w-4" />
                  <span>Generate Workspace</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-foreground">Recent Study Sessions</h3>
          {/* Recent Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockSessions.map((session) => (
              <Link key={session.id} to={`/session/${session.id}`}>
                <Card className="h-full bg-card/40 border-border/70 hover:border-indigo-500/50 hover:bg-card/70 transition-all duration-300 group cursor-pointer flex flex-col justify-between">
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.date}
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                        Active Recall
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-indigo-400 transition-colors">
                      {session.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {session.summarySnippet}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {session.topics.map((t, idx) => (
                        <span key={idx} className="rounded-md bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-indigo-400" />
                          {session.cardsCount} cards
                        </span>
                        <span className="flex items-center gap-1">
                          <BrainCircuit className="h-3.5 w-3.5 text-purple-400" />
                          {session.quizCount} quiz
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State Banner hint */}
          <div className="rounded-xl border border-dashed border-border/80 p-8 text-center bg-card/20 space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Have a new lecture or assignment?</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Paste your raw notes to generate instant flashcards, quizzes, and a spaced repetition plan.
            </p>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('new')} className="gap-1.5 text-xs font-semibold">
              <Plus className="h-4 w-4" />
              <span>Create Session</span>
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
