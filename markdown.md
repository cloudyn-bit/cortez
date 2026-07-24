# StudyPilot AI - Architecture & Development Specification

This document serves as the absolute source of truth for the development of StudyPilot AI. It is designed to be ingested by an AI coding assistant to build a production-ready, premium SaaS application.

---

## 1. Project Goal

**Product Name:** StudyPilot AI
**Tagline:** Your AI-powered personal tutor.
**Core Value Proposition:** StudyPilot AI transforms raw, unstructured study notes into a comprehensive, interactive learning ecosystem. By simply pasting text, users instantly receive a structured summary, interactive flashcards, self-assessment quizzes, a breakdown of critical topics, and a customized revision plan. 

**Vibe & Aesthetics:** The application must feel like a premium, modern SaaS product akin to Notion, Linear, or ChatGPT. It should feature a minimalist interface, flawless typography, subtle animations (micro-interactions), and a deeply intuitive user experience. Dark mode by default, utilizing deep grays, subtle borders, and glowing accent colors.

---

## 2. User Journey

1. **Landing Page:** User lands on a high-converting, visually striking homepage with a clear value proposition, animated product demo/mockup, and a compelling call-to-action (CTA).
2. **Sign In:** User clicks "Get Started" and is routed through a frictionless authentication flow (Supabase Auth - Magic Link or Google OAuth).
3. **Dashboard (Empty State):** User lands on their workspace. If new, they see a welcoming empty state guiding them to create their first "Study Session."
4. **Paste Notes (Input Flow):** User clicks "New Session", opens a distraction-free editor, titles the session, and pastes their raw notes/text. They click "Generate Workspace".
5. **Generate (Loading State):** User experiences a multi-step loading sequence with engaging micro-copy (e.g., "Analyzing core concepts...", "Generating flashcards...", "Building your quiz..."). Skeleton loaders map to the expected output layout.
6. **View Results (The Workspace):** The screen transitions to a master-detail or tabbed view showing:
    - **Summary:** Concise, bulleted breakdown.
    - **Important Topics:** Tag-like extraction of key entities and concepts.
    - **Flashcards:** An interactive, flippable card UI.
    - **Quiz:** A multiple-choice quiz interface with immediate feedback.
    - **Revision Plan:** A timeline/calendar view of when to review material.
7. **Save Workspace:** All data is automatically synchronized to the Supabase backend.
8. **History:** User can navigate back to the dashboard to see a grid/list of previous study sessions and resume where they left off.

---

## 3. Folder Structure

This project uses the **Next.js App Router**. 

```text
studypilot-ai/
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── (auth)/             # Authentication route group
│   │   │   ├── login/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── (dashboard)/        # Protected dashboard route group
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── session/[id]/page.tsx
│   │   │   └── layout.tsx      # Dashboard layout with sidebar
│   │   ├── api/                # API Route handlers
│   │   │   ├── generate/route.ts # AI Generation endpoint
│   │   │   └── webhooks/route.ts
│   │   ├── layout.tsx          # Root layout (Providers, Fonts)
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # ShadCN UI components (buttons, dialogs, etc.)
│   │   ├── forms/              # React Hook Form components
│   │   ├── layout/             # Navbar, Sidebar, Footer
│   │   ├── workspace/          # Domain-specific components (Flashcards, Quiz)
│   │   └── marketing/          # Landing page specific components (Hero, Features)
│   ├── lib/
│   │   ├── supabase/           # Supabase client initialization (browser/server)
│   │   ├── ai/                 # Gemini API initialization and prompt templates
│   │   ├── utils.ts            # Tailwind merge and formatting utilities
│   │   └── validations.ts      # Zod schemas for forms and API responses
│   ├── types/                  # TypeScript interface definitions (Database, AI schemas)
│   ├── hooks/                  # Custom React hooks (useStudySession, useAuth)
│   └── store/                  # Zustand state management (if applicable)
├── public/                     # Static assets (images, icons)
├── styles/
│   └── globals.css             # Global Tailwind and base styles
├── tailwind.config.ts
├── middleware.ts               # Route protection (Supabase Auth)
└── package.json
```

---

## 4. Technology Stack

- **Framework:** Next.js 14+ (App Router, Server Components, Server Actions)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS (Utility-first, responsive)
- **UI Library:** ShadCN UI (Accessible, customizable Radix primitives)
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Magic Links/OAuth)
- **AI Engine:** Google Gemini API (Gemini 1.5 Pro/Flash for large context processing)
- **Animations:** Framer Motion (Page transitions, layout animations, micro-interactions)
- **Forms:** React Hook Form
- **Validation:** Zod (Form validation and AI JSON output validation)
- **Icons:** Lucide React

---

## 5. UI Design (Page by Page)

### Landing Page (`/`)
- **Vibe:** Linear/Stripe aesthetic. Pitch black background (`#000000` or `#09090B`), stark white text, subtle glowing mesh gradients.
- **Hero:** Massive, bold typography. "Learn Faster. Remember Longer." Gradient text emphasis. Two buttons: "Start for Free" (Primary, glowing border), "View Demo" (Secondary, ghost).
- **Social Proof:** "Trusted by students at..." with desaturated logos.
- **Bento Box Features:** A CSS grid displaying features (Flashcards, Quizzes) in sleek, rounded cards with subtle borders (`border-white/10`).

### Auth (`/login`)
- Minimalist centered card.
- "Welcome back" / "Create an account".
- Google OAuth button (with Google icon).
- Magic link email input with standard validation.
- No distractons; pure focus on conversion.

### Dashboard (`/dashboard`)
- **Sidebar (Left):** Workspace navigation, recent sessions, settings, user profile at bottom.
- **Top Nav:** Breadcrumbs, Theme Toggle, "New Session" CTA button.
- **Main Area:** Masonry or Grid layout of past study sessions. Each card shows the Title, Date, and badges for (Topics, Flashcards).

### Settings (`/dashboard/settings`)
- Simple list of preferences: Profile info, Theme (Light/Dark/System), Danger Zone (Delete Account).

### Session Workspace (`/session/[id]`)
- **Header:** Session Title, "Back to Dashboard" button, "Export" dropdown.
- **Content Area (Tabs):** A sleek tabbed interface (`Notes | Summary | Flashcards | Quiz | Revision Plan`).
- **Input Mode:** If empty, a large, beautiful text area (ShadCN Textarea) taking up 70% of the screen.

### Loading Screens
- **Avoid:** Generic spinning circles.
- **Use:** Skeleton loaders matching the exact shape of the UI. For AI generation, use a terminal-like text sequence: `> Ingesting notes... > Extracting entities... > Formulating questions...` utilizing Framer Motion for text reveal.

### 404 & Error Pages
- Clean, centered text. "404 - Knowledge Not Found". Back to Dashboard button. 

---

## 6. Components Breakdown

### Layout & Navigation
- `Sidebar`: Fixed left menu, collapsable on mobile. Highlights active route.
- `Navbar`: Sticky top, blur backdrop (`backdrop-blur-md`).
- `UserDropdown`: ShadCN Dropdown menu for logout/settings.

### Marketing
- `HeroSection`: Framer motion text reveal.
- `FeatureCard`: Hover effect that reveals a subtle radial gradient tracking the mouse pointer.

### Workspace (The core app)
- `NotesInput`: React Hook Form textarea, auto-resizing, character counter limit (e.g., max 50,000 chars for Gemini).
- `SummaryView`: Markdown renderer tailored for beautiful typography (Prose classes from Tailwind).
- `ImportantTopics`: Flex container with pill-shaped tags.
- `FlashcardViewer`: 
  - 3D flip animation using CSS/Framer Motion.
  - "Show Answer" button.
  - "Got it" / "Needs Review" buttons for basic local state sorting.
- `QuizComponent`: 
  - Displays one question at a time.
  - Radio group for options.
  - "Submit" button reveals correct answer with explanation.
  - Progress bar at the top.
- `RevisionTimeline`: A vertical stepper or simple calendar list showing Day 1, Day 3, Day 7 review topics.

---

## 7. Database Schema (Supabase / PostgreSQL)

*All tables must have Row Level Security (RLS) enabled.*

**Table: `profiles`**
- `id` (uuid, PK, references auth.users)
- `email` (text)
- `full_name` (text, nullable)
- `created_at` (timestamptz)

**Table: `study_sessions`**
- `id` (uuid, PK, default uuid_generate_v4())
- `user_id` (uuid, FK to profiles.id)
- `title` (text)
- `raw_notes` (text)
- `summary` (text)
- `important_topics` (jsonb) -> array of strings
- `created_at` (timestamptz)

**Table: `flashcards`**
- `id` (uuid, PK)
- `session_id` (uuid, FK to study_sessions.id)
- `front` (text)
- `back` (text)
- `status` (text, default 'new') -> 'new', 'learning', 'mastered'

**Table: `quizzes`**
- `id` (uuid, PK)
- `session_id` (uuid, FK to study_sessions.id)
- `question` (text)
- `options` (jsonb) -> array of strings
- `correct_answer_index` (integer)
- `explanation` (text)

**Table: `revision_plans`**
- `id` (uuid, PK)
- `session_id` (uuid, FK to study_sessions.id)
- `day` (integer) -> e.g., 1, 3, 7
- `tasks` (jsonb) -> array of strings

---

## 8. API Structure

Since we are using Next.js App Router, we will use Server Actions heavily, but for the main AI pipeline, a dedicated Route Handler is preferred for streaming or long-polling.

**Endpoint:** `POST /api/generate`
- **Purpose:** Receives raw notes, calls Gemini API with structured prompts, parses the JSON response, saves to Supabase, and returns the workspace ID.
- **Inputs (JSON):**
  ```json
  {
    "title": "History of Rome",
    "notes": "Rome was founded in 753 BC...",
    "userId": "uuid-string"
  }
  ```
- **Outputs (JSON):**
  ```json
  {
    "success": true,
    "sessionId": "uuid-string",
    "message": "Workspace generated successfully."
  }
  ```

*Alternative implementation:* Use Next.js Server Actions `generateWorkspace(formData: FormData)` to handle this entirely server-side without a standard fetch endpoint, utilizing `ai` SDK for object generation.

---

## 9. State Management

- **Global User State:** Supabase Auth handles session cookies automatically via `@supabase/ssr`.
- **Server State / Data Fetching:** React Server Components (RSC) fetch data securely on the server. `useSWR` or React Query is unnecessary for basic views; use Next.js `fetch` with tags/revalidation.
- **Client UI State:** 
  - Standard `useState` for Flashcard flipping and Quiz progression.
  - Zustand (optional) if cross-component state is needed within the workspace (e.g., passing active tab state).

---

## 10. AI Prompt Engineering

We will use Gemini's `response_mime_type: "application/json"` or the Vercel AI SDK `generateObject` to strictly enforce output.

**System Prompt (Master Pipeline):**
```text
You are StudyPilot AI, an expert educational assistant. Your goal is to deeply analyze the provided study notes and generate highly effective, scientifically-backed learning materials.

You must output a strictly valid JSON object matching the following schema:
{
  "summary": "A comprehensive markdown-formatted summary of the notes. Use headings and bullet points.",
  "important_topics": ["Topic 1", "Topic 2", "Topic 3"],
  "flashcards": [
    { "front": "Question or concept", "back": "Answer or definition" }
  ],
  "quiz": [
    { 
      "question": "Clear multiple choice question",
      "options": ["A", "B", "C", "D"],
      "correct_answer_index": 0, // integer 0-3
      "explanation": "Why this is correct"
    }
  ],
  "revision_plan": [
    { "day": 1, "tasks": ["Review flashcards", "Read summary"] },
    { "day": 3, "tasks": ["Take the quiz", "Explain topics aloud"] }
  ]
}

Ensure the flashcards focus on active recall. Ensure the quiz questions test comprehension, not just rote memorization.
```

---

## 11. UX Rules & Standards

- **Animations:** Use Framer Motion. Page transitions must be fast (`duration: 0.2`). Stagger children variants for list items (Dashboard cards, Flashcards).
- **Empty States:** Never show a blank screen. Always include a subtle illustration (Lucide icon) and a CTA button.
- **Loading:** Use `loading.tsx` in Next.js to show skeleton screens instantly while server components resolve.
- **Error States:** Graceful error handling using `error.tsx`. Use ShadCN `useToast` to display network errors or validation failures.
- **Accessibility:** 
  - All interactive elements must have `aria-label`.
  - Full keyboard support (Tab navigation must work seamlessly).
  - Focus rings must be visible (`focus-visible:ring-2 focus-visible:ring-ring`).
- **Responsive Design:** Mobile-first approach. 
  - Sidebar becomes a hamburger menu on small screens.
  - Flashcards must fit within standard mobile viewports without horizontal scrolling.

---

## 12. Development Plan

Follow these phases sequentially. Do not move to the next phase until the "Definition of Done" is met.

### Phase 1: Project Initialization
- **Goal:** Set up the repository, Next.js, Tailwind, ShadCN, and base layout.
- **Files to edit:** `package.json`, `layout.tsx`, `tailwind.config.ts`, `globals.css`
- **Expected Result:** A blank Next.js app with dark mode enabled and standard font (Inter/Geist) injected.
- **Definition of Done:** `npm run dev` works with zero errors. ShadCN CLI is initialized.
- **Git Commit:** `chore: initialize next.js, tailwind, and shadcn`

### Phase 2: Database & Auth Setup
- **Goal:** Configure Supabase schema and Next.js middleware for route protection.
- **Files to edit:** `lib/supabase/server.ts`, `middleware.ts`, `app/(auth)/login/page.tsx`
- **Expected Result:** User can log in/sign up. Unauthenticated users are redirected to `/login` from `/dashboard`.
- **Definition of Done:** Successful auth flow creates a user in Supabase and redirects to dashboard.
- **Git Commit:** `feat: integrate supabase auth and middleware`

### Phase 3: Landing Page & UI Shell
- **Goal:** Build the marketing page and the dashboard layout shell (sidebar/navbar).
- **Files to edit:** `app/page.tsx`, `app/(dashboard)/layout.tsx`, `components/layout/Sidebar.tsx`
- **Expected Result:** Beautiful landing page. Navigating to `/dashboard` shows the sidebar and empty state.
- **Definition of Done:** Responsive layout works on mobile and desktop.
- **Git Commit:** `feat: build landing page and dashboard shell`

### Phase 4: Core Data Pipeline (AI Integration)
- **Goal:** Implement the form to accept notes, connect to Gemini API, parse JSON, and save to Supabase.
- **Files to edit:** `app/api/generate/route.ts`, `lib/ai/gemini.ts`, `app/(dashboard)/dashboard/page.tsx`
- **Expected Result:** User submits text, AI generates JSON, data is written to the 5 Supabase tables, user is redirected to the session page.
- **Definition of Done:** Full round-trip data flow works reliably without UI polish.
- **Git Commit:** `feat: implement gemini ai pipeline and db inserts`

### Phase 5: Workspace UI (Results Rendering)
- **Goal:** Build the components to display the generated data (Tabs, Flashcards, Quiz).
- **Files to edit:** `app/(dashboard)/session/[id]/page.tsx`, `components/workspace/*`
- **Expected Result:** User can flip flashcards, take the quiz, and read the summary.
- **Definition of Done:** All 5 data types are rendered beautifully. Interactive elements work.
- **Git Commit:** `feat: build workspace ui components`

### Phase 6: Polish & Animations
- **Goal:** Add Framer Motion, Toast notifications, Skeleton loaders, and fix edge cases.
- **Files to edit:** `loading.tsx`, `components/ui/use-toast.ts`, Various components.
- **Expected Result:** The app feels like a premium SaaS product.
- **Definition of Done:** No layout shifts, smooth transitions, handled loading states.
- **Git Commit:** `style: add animations and ux polish`

---

## 13. Future Improvements (Post-MVP)

- **PDF/Image Upload:** Integrate OCR to allow users to upload textbook pages.
- **Spaced Repetition System (SRS):** Implement a SuperMemo/Anki algorithm to calculate exactly when a flashcard should be shown again.
- **Voice Output:** Text-to-speech for language learners.
- **Multiplayer/Sharing:** Generate public links to share study guides with classmates.
- **Analytics:** Heatmaps showing study streaks and mastery levels.

---

## 14. Demo Script (2-Minute Hackathon Pitch)

**[0:00 - 0:15] The Hook:**
"How many hours have we all wasted reading the same textbook pages over and over, hoping something sticks? Passive reading is the least effective way to learn. We need active recall, but building flashcards and quizzes takes too much time."

**[0:15 - 0:45] The Solution (Live Demo starts):**
"Enter StudyPilot AI. It’s your personal, instant tutor. Let me show you. I have these messy, unstructured notes on the Roman Empire. I just paste them here into StudyPilot and hit generate."

**[0:45 - 1:15] The Magic:**
*(Screen shows the sleek loading sequence)* 
"Behind the scenes, Gemini 1.5 is analyzing the text, extracting core entities, and applying pedagogical frameworks. Boom. We don't just get a summary. We get an entire learning ecosystem."

**[1:15 - 1:45] Component Walkthrough:**
"Look at this. A structured breakdown. Next tab: instantly generated interactive flashcards. Next tab: a comprehensive multiple-choice quiz that tests actual comprehension, complete with explanations. It even mapped out a 7-day spaced-revision plan for me."

**[1:45 - 2:00] The Vision / Outro:**
"StudyPilot transforms passive readers into active learners in seconds. Built with Next.js, Supabase, and Gemini. It’s fast, premium, and ready to scale. Thank you."
