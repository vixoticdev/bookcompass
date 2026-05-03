import {
  BarChart3,
  BookMarked,
  BookOpenCheck,
  ChevronRight,
  Compass,
  Gauge,
  LibraryBig,
  ListChecks,
  Settings2,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'

const routes = [
  { to: '/onboarding', label: 'Onboarding', icon: UserRound },
  { to: '/library', label: 'Library', icon: LibraryBig },
  { to: '/recommendations/new', label: 'Recommend', icon: Compass },
  { to: '/recommendations/history', label: 'History', icon: ListChecks },
  { to: '/admin', label: 'Admin', icon: Settings2 },
]

const readingSignals = [
  'Outcome goals',
  'Mood and energy',
  'Available time',
  'DNF patterns',
]

const libraryRows = [
  ['Atomic Habits', 'Habit-building', 'Fast', 'Seed candidate'],
  ['Deep Work', 'Productivity', 'Deep', 'Seed candidate'],
  ['Thinking, Fast and Slow', 'Decision science', 'Challenging', 'Seed candidate'],
]

const adminModules = [
  ['Catalog quality', 'Authors, books, tags, pacing, difficulty'],
  ['Recommendation tuning', 'Weights, DNF penalties, explanation templates'],
  ['Behavior analytics', 'Completion paths, abandonment clusters, feedback'],
]

function Shell() {
  return (
    <main className="min-h-screen bg-[#f5f0e6] text-[#211b16]">
      <div className="app-texture min-h-screen">
        <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr]">
          <aside className="border-b border-[#d8cbb8] bg-[#fbf7ee]/90 px-5 py-4 lg:border-b-0 lg:border-r lg:py-6">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md bg-[#2a342d] text-[#fffaf0]">
                <Compass size={21} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-[#7b5b31]">
                  BookCompass
                </p>
                <p className="text-base font-semibold">Reading desk</p>
              </div>
            </div>

            <nav className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {routes.map((route) => {
                const Icon = route.icon

                return (
                  <NavLink
                    className={({ isActive }) =>
                      [
                        'flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition',
                        isActive
                          ? 'border-[#315d48] bg-[#e5eee7] text-[#20372d]'
                          : 'border-transparent text-[#62584a] hover:border-[#d8cbb8] hover:bg-white/70',
                      ].join(' ')
                    }
                    key={route.to}
                    to={route.to}
                  >
                    <Icon size={17} />
                    {route.label}
                  </NavLink>
                )
              })}
            </nav>
          </aside>

          <section className="px-5 py-6 sm:px-8">
            <Routes>
              <Route element={<Navigate replace to="/onboarding" />} path="/" />
              <Route element={<Onboarding />} path="/onboarding" />
              <Route element={<Library />} path="/library" />
              <Route element={<RecommendationStart />} path="/recommendations/new" />
              <Route
                element={<RecommendationHistory />}
                path="/recommendations/history"
              />
              <Route element={<AdminHome />} path="/admin" />
              <Route element={<AdminBooks />} path="/admin/books" />
            </Routes>
          </section>
        </div>
      </div>
    </main>
  )
}

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-sm font-semibold uppercase text-[#8a602b]">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#211b16] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-base leading-7 text-[#5e564b]">{description}</p>
    </header>
  )
}

function Onboarding() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Capture the reader identity the engine will use later: goals, taste, format preferences, reading depth, and time constraints."
        eyebrow="Reader identity"
        title="Build a profile before scoring starts"
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Target outcomes',
              'Favorite genres',
              'Avoided genres',
              'Preferred formats',
              'Daily reading minutes',
              'Difficulty tolerance',
            ].map((label) => (
              <label className="grid gap-2 text-sm font-semibold" key={label}>
                {label}
                <input
                  className="h-11 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
                  placeholder="Planned input"
                  readOnly
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-[#d4c3aa] bg-[#efe3cf] p-5">
          <Gauge className="text-[#315d48]" size={22} />
          <h2 className="mt-4 text-xl font-semibold">Day 3 contract</h2>
          <p className="mt-2 text-sm leading-6 text-[#5c4f40]">
            User-owned resources keep `userId` in write DTOs until auth lands.
            The next phase can replace manual IDs with verified identity claims.
          </p>
        </div>
      </section>
    </div>
  )
}

function Library() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="The library will combine seed catalog data with user reading events, likes, dislikes, completion, and abandonment signals."
        eyebrow="Library"
        title="Track books as behavior, not just inventory"
      />

      <section className="overflow-hidden rounded-md border border-[#d8cbb8] bg-[#fffaf0]">
        <div className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr] border-b border-[#e7dbc8] px-4 py-3 text-xs font-semibold uppercase text-[#74624d]">
          <span>Book</span>
          <span>Outcome</span>
          <span>Depth</span>
          <span>Status</span>
        </div>
        {libraryRows.map((row) => (
          <div
            className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr] border-b border-[#eee4d6] px-4 py-4 text-sm last:border-b-0"
            key={row[0]}
          >
            {row.map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}

function RecommendationStart() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="This flow is the future decision session: it asks what the reader needs now, then creates an explainable recommendation session."
        eyebrow="Recommendation session"
        title="Choose for the current reading moment"
      />

      <section className="grid gap-4 md:grid-cols-2">
        {readingSignals.map((signal) => (
          <div
            className="flex min-h-24 items-center justify-between rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
            key={signal}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="text-[#9b672d]" size={19} />
              <p className="font-semibold">{signal}</p>
            </div>
            <ChevronRight className="text-[#7f735f]" size={18} />
          </div>
        ))}
      </section>
    </div>
  )
}

function RecommendationHistory() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Past sessions will show the selected context, recommended candidates, scoring signals, and user feedback."
        eyebrow="Recommendation history"
        title="Review why each book was suggested"
      />

      <div className="rounded-md border border-dashed border-[#c9b79e] bg-[#fffaf0] p-8 text-center">
        <BookOpenCheck className="mx-auto text-[#315d48]" size={28} />
        <p className="mt-3 font-semibold">No sessions yet</p>
        <p className="mt-2 text-sm text-[#62584a]">
          Recommendation scoring starts after the catalog and identity flows are
          ready.
        </p>
      </div>
    </div>
  )
}

function AdminHome() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Admin surfaces will keep the catalog, outcome tags, recommendation tuning, and analytics operational."
        eyebrow="Admin"
        title="Manage the engine behind the reading desk"
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {adminModules.map(([title, body]) => (
          <article
            className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
            key={title}
          >
            <BarChart3 className="text-[#315d48]" size={20} />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#62584a]">{body}</p>
          </article>
        ))}
      </section>
    </div>
  )
}

function AdminBooks() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Catalog administration will use the new author and book filters to review seeded records by genre, outcome, depth, pacing, and difficulty."
        eyebrow="Admin catalog"
        title="Seeded books are ready for review workflows"
      />

      <div className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
        <BookMarked className="text-[#315d48]" size={22} />
        <h2 className="mt-4 text-xl font-semibold">Catalog filters</h2>
        <p className="mt-2 text-sm leading-6 text-[#62584a]">
          API support now covers title search, author, genre, outcome, format,
          pacing, difficulty, depth, and maximum estimated reading time.
        </p>
      </div>
    </div>
  )
}

function App() {
  return <Shell />
}

export default App
