import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  BookOpen,
  Layers,
  BrainCircuit,
  Calendar,
  Tag,
  Share2,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

export function SessionPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'summary' | 'topics' | 'flashcards' | 'quiz' | 'revision'>('summary')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const sessionData = {
    title: id === 'roman-history' ? 'Roman Empire History & Fall' : 'Study Session Workspace',
    date: 'July 24, 2026',
    topics: ['Pax Romana', 'Julius Caesar', 'Fall of Rome', 'Economic Instability', 'Barbarian Invasions'],
    flashcards: [
      { front: "What year did the Western Roman Empire fall?", back: "476 AD, when Romulus Augustulus was deposed by Odoacer." },
      { front: "Who was the first Emperor of the Roman Empire?", back: "Augustus Caesar (formerly Octavian), ruling from 27 BC to 14 AD." },
      { front: "What was the 'Pax Romana'?", back: "A 200-year period of relative peace and stability across the Empire initiating under Augustus." }
    ],
    quiz: [
      {
        question: "Which economic factor contributed significantly to the weakness of the Western Roman Empire?",
        options: ["Over-reliance on slave labor and inflation", "Discovery of too much gold", "Complete lack of trade routes", "High import taxes on silk"],
        answer: 0,
        explanation: "Inflation, heavy taxation, and over-reliance on slave labor crippled the agricultural economy."
      }
    ],
    revisionPlan: [
      { day: 1, tasks: ["Review bulleted summary", "Flip through 12 initial flashcards"] },
      { day: 3, tasks: ["Take the 5-question comprehension quiz", "Re-read weak flashcard topics"] },
      { day: 7, tasks: ["Final mastery review & self-test"] }
    ]
  }

  return (
    <PageContainer
      title={sessionData.title}
      description={`Created on ${sessionData.date} • Interactive Workspace`}
      action={
        <div className="flex items-center space-x-2">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
          <Button variant="glow" size="sm" className="gap-1.5 text-xs font-semibold">
            <Share2 className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      }
    >
      {/* Workspace Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-border/60 pb-2">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'summary'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Summary</span>
        </button>

        <button
          onClick={() => setActiveTab('topics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'topics'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Important Topics</span>
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'flashcards'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Flashcards ({sessionData.flashcards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'quiz'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <BrainCircuit className="h-4 w-4" />
          <span>Quiz ({sessionData.quiz.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('revision')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === 'revision'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Revision Plan</span>
        </button>
      </div>

      {/* Tab Content Panes */}
      <div className="pt-2">
        {activeTab === 'summary' && (
          <Card className="bg-card/40 border-border/80 p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Core Summary & Analysis</h3>
            <div className="prose prose-invert max-w-none text-sm text-muted-foreground space-y-3 leading-relaxed">
              <p>
                The Western Roman Empire collapsed due to a combination of political instability, economic decay, military overextension, and external pressure from migrating tribes.
              </p>
              <h4 className="text-sm font-bold text-foreground pt-2">Key Drivers:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Political Corruption: Rapid turnover of emperors created systemic instability.</li>
                <li>Economic Deflation: Heavy inflation and loss of tax revenue weakened state infrastructure.</li>
                <li>Military Restructuring: Reliance on Germanic mercenaries reduced military cohesion.</li>
              </ul>
            </div>
          </Card>
        )}

        {activeTab === 'topics' && (
          <Card className="bg-card/40 border-border/80 p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Extracted Concept Tags</h3>
            <div className="flex flex-wrap gap-2">
              {sessionData.topics.map((topic, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1.5 text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Tag className="h-3 w-3 mr-1.5 text-indigo-400" />
                  {topic}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'flashcards' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="h-64 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-card to-card/60 p-8 flex flex-col justify-between items-center text-center cursor-pointer shadow-xl transition-all duration-300 hover:border-indigo-500/60"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                {isFlipped ? 'Answer (Click to Flip)' : 'Question (Click to Flip)'}
              </span>
              <p className="text-lg font-semibold text-foreground">
                {isFlipped
                  ? sessionData.flashcards[currentCardIndex].back
                  : sessionData.flashcards[currentCardIndex].front}
              </p>
              <span className="text-xs text-muted-foreground">
                Card {currentCardIndex + 1} of {sessionData.flashcards.length}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                disabled={currentCardIndex === 0}
                onClick={() => {
                  setCurrentCardIndex(currentCardIndex - 1)
                  setIsFlipped(false)
                }}
              >
                Previous
              </Button>
              <Button
                variant="glow"
                size="sm"
                disabled={currentCardIndex === sessionData.flashcards.length - 1}
                onClick={() => {
                  setCurrentCardIndex(currentCardIndex + 1)
                  setIsFlipped(false)
                }}
              >
                Next Card
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <Card className="bg-card/40 border-border/80 p-6 space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Question 1 of 1</span>
              <h3 className="text-base font-semibold text-foreground">
                {sessionData.quiz[0].question}
              </h3>
            </div>

            <div className="space-y-2">
              {sessionData.quiz[0].options.map((option, idx) => (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-lg border border-border/70 bg-background/50 hover:bg-indigo-600/10 hover:border-indigo-500/40 text-xs font-medium text-foreground transition-colors flex items-center justify-between"
                >
                  <span>{option}</span>
                  {idx === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Explanation
              </p>
              <p>{sessionData.quiz[0].explanation}</p>
            </div>
          </Card>
        )}

        {activeTab === 'revision' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {sessionData.revisionPlan.map((plan, idx) => (
              <Card key={idx} className="bg-card/40 border-border/80 p-4 flex items-start space-x-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 shrink-0">
                  Day {plan.day}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Scheduled Review Tasks</h4>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                    {plan.tasks.map((t, tidx) => (
                      <li key={tidx}>{t}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
