export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface StudySession {
  id: string
  user_id: string
  title: string
  raw_notes: string
  summary: string | null
  important_topics: string[] | null
  created_at: string
}

export interface Flashcard {
  id: string
  session_id: string
  front: string
  back: string
  status: 'new' | 'learning' | 'mastered'
}

export interface QuizQuestion {
  id: string
  session_id: string
  question: string
  options: string[]
  correct_answer_index: number
  explanation: string
}

export interface RevisionTask {
  day: number
  tasks: string[]
}

export interface RevisionPlan {
  id: string
  session_id: string
  day: number
  tasks: string[]
}
