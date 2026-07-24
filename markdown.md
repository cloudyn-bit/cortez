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

This project structure:

```text
studypilot-ai/
├── src/
│   ├── pages/                  # Routed pages (Landing, Login, Dashboard, Session, Settings, NotFound)
│   ├── components/
│   │   ├── ui/                 # ShadCN UI components (buttons, dialogs, etc.)
│   │   ├── forms/              # React Hook Form components
│   │   ├── layout/             # Navbar, Sidebar, Footer, PageContainer
│   │   ├── workspace/          # Domain-specific components (Flashcards, Quiz)
│   │   └── marketing/          # Landing page specific components (Hero, Features)
│   ├── lib/
│   │   ├── supabase/           # Supabase client initialization
│   │   ├── ai/                 # Gemini API initialization and prompt templates
│   │   ├── utils.ts            # Tailwind merge and formatting utilities
│   │   └── validations.ts      # Zod schemas for forms and API responses
│   ├── types/                  # TypeScript interface definitions (Database, AI schemas)
│   ├── hooks/                  # Custom React hooks (useStudySession, useAuth)
│   ├── context/                # Context providers (Theme, Auth)
│   └── store/                  # Zustand state management
├── public/                     # Static assets (images, icons)
├── styles/
│   └── globals.css             # Global Tailwind and base styles
├── tailwind.config.ts
└── package.json
```

---

## 4. Technology Stack

- **Framework:** React + Vite + TypeScript (Strict mode enabled)
- **Router:** React Router v6
- **Styling:** Tailwind CSS (Utility-first, responsive)
- **UI Library:** ShadCN UI / Radix Primitives
- **Database & Auth:** Supabase
- **AI Engine:** Google Gemini API
- **Animations:** Framer Motion (Page transitions, layout animations, micro-interactions)
- **Forms:** React Hook Form
- **Validation:** Zod
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

### Dashboard (`/dashboard`)
- **Sidebar (Left):** Workspace navigation, recent sessions, settings, user profile at bottom.
- **Top Nav:** Breadcrumbs, Theme Toggle, "New Session" CTA button.
- **Main Area:** Masonry or Grid layout of past study sessions. Each card shows the Title, Date, and badges for (Topics, Flashcards).

### Settings (`/settings`)
- Simple list of preferences: Profile info, Theme (Light/Dark/System), Danger Zone (Delete Account).

### Session Workspace (`/session/:id`)
- **Header:** Session Title, "Back to Dashboard" button, "Export" dropdown.
- **Content Area (Tabs):** A sleek tabbed interface (`Notes | Summary | Flashcards | Quiz | Revision Plan`).
- **Input Mode:** If empty, a large, beautiful text area taking up 70% of the screen.

### Loading Screens
- Terminal-like text sequence and skeleton loaders matching UI shape.

### 404 & Error Pages
- Clean, centered text. "404 - Knowledge Not Found". Back to Dashboard button. 

---

## 6. Components Breakdown

### Layout & Navigation
- `Sidebar`: Fixed left menu, collapsible on mobile. Highlights active route.
- `Navbar`: Sticky top, blur backdrop (`backdrop-blur-md`).
- `PageContainer`: Consistent padded container with animations for page content.
- `UserDropdown`: ShadCN Dropdown menu for logout/settings.

---

## 12. Development Plan

### Phase 1: Project Initialization & Base Layout
- **Goal:** Create React + Vite + TS project, setup Tailwind CSS, shadcn/ui, React Router, default Dark mode theme provider, folder structure, reusable layout components (Sidebar, Navbar, PageContainer), empty routed pages, Lucide icons, typography, and color system.
