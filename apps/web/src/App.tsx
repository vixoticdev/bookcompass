import {
  BarChart3,
  BookMarked,
  BookOpenCheck,
  ChevronRight,
  Compass,
  Gauge,
  LibraryBig,
  ListChecks,
  Pencil,
  Settings2,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  useAdminAnalytics,
  useAuthors,
  useBooks,
  useCreateAuthor,
  useCreateBook,
  useCreateDnfRecord,
  useCreateRecommendationSession,
  useCreateMyReadingProfile,
  useCreateReadingEvent,
  useCreateReadingIdentity,
  useCurrentUser,
  useDeleteAuthor,
  useDeleteBook,
  useLogin,
  useMyDnfRecords,
  useMyRecommendationSessions,
  useMyReadingEvents,
  useMyReadingProfile,
  useRecordRecommendationFeedback,
  useUpdateAuthor,
  useUpdateBook,
  useUpdateMyReadingProfile,
} from './lib/queries'
import type {
  Author,
  Book,
  RecommendationFeedbackStatus,
  RecommendationSession,
} from './lib/api'

const routes = [
  { to: '/login', label: 'Login', icon: UserRound },
  { to: '/onboarding/signup', label: 'Signup', icon: UserRound },
  { to: '/onboarding/preferences', label: 'Profile', icon: Gauge },
  { to: '/onboarding/signals', label: 'Signals', icon: BookOpenCheck },
  { to: '/profile/history', label: 'Reader history', icon: ListChecks },
  { to: '/library', label: 'Library', icon: LibraryBig },
  { to: '/recommendations/new', label: 'Recommend', icon: Compass },
  { to: '/recommendations/history', label: 'History', icon: ListChecks },
  { to: '/admin', label: 'Admin', icon: Settings2 },
  { to: '/admin/authors', label: 'Authors', icon: UserRound },
  { to: '/admin/books', label: 'Books', icon: BookMarked },
]

const readingSignals = [
  'Outcome goals',
  'Mood and energy',
  'Available time',
  'DNF patterns',
]

const adminModules = [
  ['Catalog quality', 'Authors, books, tags, pacing, difficulty'],
  ['Recommendation tuning', 'Weights, DNF penalties, explanation templates'],
  ['Behavior analytics', 'Completion paths, abandonment clusters, feedback'],
]

const outcomeOptions = [
  ['habit-building', 'Habit building'],
  ['discipline', 'Discipline'],
  ['productivity', 'Productivity'],
  ['startup-thinking', 'Startup thinking'],
  ['leadership', 'Leadership'],
  ['better-manager', 'Better manager'],
  ['emotional-resilience', 'Emotional resilience'],
  ['persuasion', 'Persuasion'],
  ['technical-learning', 'Technical learning'],
]

const moodOptions = [
  ['curious', 'Curious'],
  ['focused', 'Focused'],
  ['stressed', 'Stressed'],
  ['tired', 'Tired'],
  ['reflective', 'Reflective'],
  ['motivated', 'Motivated'],
  ['open', 'Open'],
]

const energyOptions = [
  ['low', 'Low'],
  ['medium', 'Medium'],
  ['high', 'High'],
]

const focusOptions = energyOptions

const depthOptions = [
  ['quick', 'Quick'],
  ['balanced', 'Balanced'],
  ['deep', 'Deep'],
]

const pacingOptions = [
  ['slow', 'Slow'],
  ['moderate', 'Moderate'],
  ['fast', 'Fast'],
]

const difficultyOptions = [
  ['easy', 'Easy'],
  ['moderate', 'Moderate'],
  ['challenging', 'Challenging'],
]

const formatOptions = [
  ['ebook', 'Ebook'],
  ['paperback', 'Paperback'],
  ['hardcover', 'Hardcover'],
  ['audiobook', 'Audiobook'],
]

const enrichmentStatusOptions = [
  ['seeded', 'Seeded'],
  ['imported', 'Imported'],
  ['reviewed', 'Reviewed'],
  ['needs-review', 'Needs review'],
]

const feedbackActions: Array<[RecommendationFeedbackStatus, string]> = [
  ['accepted', 'Accept'],
  ['rejected', 'Reject'],
  ['started', 'Started'],
  ['completed', 'Completed'],
  ['abandoned', 'Abandoned'],
]

function toList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function Shell() {
  const currentUser = useCurrentUser()

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
            <div className="mt-5 rounded-md border border-[#d8cbb8] bg-white/60 p-3 text-sm">
              <p className="font-semibold text-[#211b16]">
                {currentUser.data?.displayName ?? 'No active reader'}
              </p>
              <p className="mt-1 text-xs text-[#62584a]">
                {currentUser.isLoading
                  ? 'Checking saved session'
                  : currentUser.data?.email ?? 'Login or onboard to hydrate'}
              </p>
            </div>
          </aside>

          <section className="px-5 py-6 sm:px-8">
            <Routes>
              <Route element={<Navigate replace to="/onboarding/signup" />} path="/" />
              <Route element={<Login />} path="/login" />
              <Route
                element={<Navigate replace to="/onboarding/signup" />}
                path="/onboarding"
              />
              <Route element={<OnboardingSignup />} path="/onboarding/signup" />
              <Route
                element={<ProfilePreferences />}
                path="/onboarding/preferences"
              />
              <Route element={<BehaviorCapture />} path="/onboarding/signals" />
              <Route element={<ReaderProfileHistory />} path="/profile/history" />
              <Route element={<Library />} path="/library" />
              <Route element={<RecommendationStart />} path="/recommendations/new" />
              <Route
                element={<RecommendationHistory />}
                path="/recommendations/history"
              />
              <Route element={<AdminHome />} path="/admin" />
              <Route element={<AdminAuthors />} path="/admin/authors" />
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

function TextField({
  label,
  type = 'text',
  value,
  onChange,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input
        className="h-11 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <textarea
        className="min-h-24 rounded-md border border-[#cfc0aa] bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-[#315d48]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[][]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <select
        className="h-11 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  )
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex h-11 items-center gap-3 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm font-semibold">
      <input
        checked={checked}
        className="size-4 accent-[#315d48]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      {label}
    </label>
  )
}

function StatusMessage({
  tone,
  children,
}: {
  tone: 'error' | 'success'
  children: ReactNode
}) {
  return (
    <p
      className={[
        'mt-4 rounded-md border px-3 py-2 text-sm font-medium',
        tone === 'success'
          ? 'border-[#adc8b7] bg-[#edf5ef] text-[#244a37]'
          : 'border-[#dfb8a6] bg-[#fff0e8] text-[#7b2f19]',
      ].join(' ')}
    >
      {children}
    </p>
  )
}

function TableStatus({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-[#eee4d6] px-4 py-5 text-sm font-medium text-[#62584a] last:border-b-0">
      {children}
    </div>
  )
}

function OnboardingSignup() {
  const createReadingIdentity = useCreateReadingIdentity()
  const currentUser = useCurrentUser()
  const [displayName, setDisplayName] = useState('Demo Reader')
  const [email, setEmail] = useState('reader@bookcompass.local')
  const [password, setPassword] = useState('bookcompass-demo')

  useEffect(() => {
    if (currentUser.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayName(currentUser.data.displayName)
      setEmail(currentUser.data.email)
    }
  }, [currentUser.data])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    createReadingIdentity.mutate({
      user: { displayName, email, password },
      profile: {},
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Start the authenticated reader identity. Preferences and behavior signals are separate steps so each contract stays focused."
        eyebrow="Reader identity"
        title="Create the reader account"
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <form
          className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Display name"
              onChange={setDisplayName}
              value={displayName}
            />
            <TextField label="Email" onChange={setEmail} value={email} />
            <TextField
              label="Password"
              onChange={setPassword}
              type="password"
              value={password}
            />
          </div>
          <button
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#2f5d46] px-4 text-sm font-semibold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={createReadingIdentity.isPending || Boolean(currentUser.data)}
            type="submit"
          >
            <UserRound size={17} />
            {currentUser.data
              ? 'Session active'
              : createReadingIdentity.isPending
                ? 'Saving reader'
                : 'Create reader'}
          </button>
          {createReadingIdentity.isSuccess ? (
            <StatusMessage tone="success">
              Saved {createReadingIdentity.data.user.displayName}. Continue to
              profile preferences.
            </StatusMessage>
          ) : null}
          {createReadingIdentity.isError ? (
            <StatusMessage tone="error">
              Could not create the reader. Try a unique email or use login.
            </StatusMessage>
          ) : null}
        </form>

        <div className="rounded-md border border-[#d4c3aa] bg-[#efe3cf] p-5">
          <Gauge className="text-[#315d48]" size={22} />
          <h2 className="mt-4 text-xl font-semibold">Session state</h2>
          <p className="mt-2 text-sm leading-6 text-[#5c4f40]">
            {currentUser.data
              ? `${currentUser.data.displayName} is loaded from GET /auth/me.`
              : 'Creating a reader stores the JWT locally for the next steps.'}
          </p>
        </div>
      </section>
    </div>
  )
}

function ProfilePreferences() {
  const createMyReadingProfile = useCreateMyReadingProfile()
  const updateReadingProfile = useUpdateMyReadingProfile()
  const currentUser = useCurrentUser()
  const profileQuery = useMyReadingProfile()
  const [targetOutcome, setTargetOutcome] = useState('productivity')
  const [favoriteGenres, setFavoriteGenres] = useState(
    'Productivity, Self-improvement',
  )
  const [dislikedGenres, setDislikedGenres] = useState('Dense theory')
  const [preferredFormat, setPreferredFormat] = useState('ebook')
  const [dailyReadingMinutes, setDailyReadingMinutes] = useState(30)
  const [estimatedWordsPerMinute, setEstimatedWordsPerMinute] = useState(250)
  const [preferredDepth, setPreferredDepth] = useState('balanced')
  const [pacingTolerance, setPacingTolerance] = useState('moderate')
  const [difficultyTolerance, setDifficultyTolerance] = useState('moderate')

  useEffect(() => {
    if (!profileQuery.data) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavoriteGenres(profileQuery.data.favoriteGenres?.join(', ') ?? '')
    setDislikedGenres(profileQuery.data.dislikedGenres?.join(', ') ?? '')
    setTargetOutcome(profileQuery.data.targetOutcomes?.[0] ?? 'productivity')
    setPreferredFormat(profileQuery.data.preferredFormats?.[0] ?? 'ebook')
    setDailyReadingMinutes(profileQuery.data.dailyReadingMinutes ?? 30)
    setEstimatedWordsPerMinute(profileQuery.data.estimatedWordsPerMinute ?? 250)
    setPreferredDepth(profileQuery.data.preferredDepth ?? 'balanced')
    setPacingTolerance(profileQuery.data.pacingTolerance ?? 'moderate')
    setDifficultyTolerance(profileQuery.data.difficultyTolerance ?? 'moderate')
  }, [profileQuery.data])

  const profilePayload = {
    dailyReadingMinutes,
    difficultyTolerance,
    dislikedGenres: toList(dislikedGenres),
    estimatedWordsPerMinute,
    favoriteGenres: toList(favoriteGenres),
    pacingTolerance,
    preferredDepth,
    preferredFormats: [preferredFormat],
    targetOutcomes: [targetOutcome],
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (currentUser.data && profileQuery.data) {
      updateReadingProfile.mutate(profilePayload)
      return
    }

    if (currentUser.data) {
      createMyReadingProfile.mutate(profilePayload)
      return
    }
  }

  const isUpdatingExistingProfile = Boolean(currentUser.data && profileQuery.data)
  const isSavingProfile =
    createMyReadingProfile.isPending ||
    updateReadingProfile.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        description="Capture the reader identity the engine will use later: goals, taste, format preferences, reading depth, and time constraints."
        eyebrow="Reader identity"
        title="Shape the reading profile"
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <form
          className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Target outcome"
              onChange={setTargetOutcome}
              options={outcomeOptions}
              value={targetOutcome}
            />
            <TextField
              label="Favorite genres"
              onChange={setFavoriteGenres}
              value={favoriteGenres}
            />
            <TextField
              label="Disliked genres"
              onChange={setDislikedGenres}
              value={dislikedGenres}
            />
            <SelectField
              label="Preferred format"
              onChange={setPreferredFormat}
              options={[
                ['ebook', 'Ebook'],
                ['paperback', 'Paperback'],
                ['hardcover', 'Hardcover'],
                ['audiobook', 'Audiobook'],
              ]}
              value={preferredFormat}
            />
            <label className="grid gap-2 text-sm font-semibold">
              Daily reading minutes
              <input
                className="h-11 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
                max={1440}
                min={1}
                onChange={(event) =>
                  setDailyReadingMinutes(Number(event.target.value))
                }
                type="number"
                value={dailyReadingMinutes}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Estimated words per minute
              <input
                className="h-11 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
                max={1000}
                min={50}
                onChange={(event) =>
                  setEstimatedWordsPerMinute(Number(event.target.value))
                }
                type="number"
                value={estimatedWordsPerMinute}
              />
            </label>
            <SelectField
              label="Reading depth"
              onChange={setPreferredDepth}
              options={[
                ['quick', 'Quick'],
                ['balanced', 'Balanced'],
                ['deep', 'Deep'],
              ]}
              value={preferredDepth}
            />
            <SelectField
              label="Pacing tolerance"
              onChange={setPacingTolerance}
              options={[
                ['slow', 'Slow'],
                ['moderate', 'Moderate'],
                ['fast', 'Fast'],
              ]}
              value={pacingTolerance}
            />
            <SelectField
              label="Difficulty tolerance"
              onChange={setDifficultyTolerance}
              options={[
                ['easy', 'Easy'],
                ['moderate', 'Moderate'],
                ['challenging', 'Challenging'],
              ]}
              value={difficultyTolerance}
            />
          </div>
          <button
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#2f5d46] px-4 text-sm font-semibold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSavingProfile}
            type="submit"
          >
            <UserRound size={17} />
            {isSavingProfile
              ? 'Saving profile'
              : isUpdatingExistingProfile
                ? 'Update profile'
                : 'Save profile'}
          </button>
          {updateReadingProfile.isSuccess ? (
            <StatusMessage tone="success">
              Updated reading preferences for the current session.
            </StatusMessage>
          ) : null}
          {createMyReadingProfile.isSuccess ? (
            <StatusMessage tone="success">
              Created a reading profile for the current session.
            </StatusMessage>
          ) : null}
          {updateReadingProfile.isError ? (
            <StatusMessage tone="error">
              Could not update the reading profile for this session.
            </StatusMessage>
          ) : null}
          {createMyReadingProfile.isError ? (
            <StatusMessage tone="error">
              Could not create a reading profile for this session.
            </StatusMessage>
          ) : null}
        </form>

        <div className="rounded-md border border-[#d4c3aa] bg-[#efe3cf] p-5">
          <Gauge className="text-[#315d48]" size={22} />
          <h2 className="mt-4 text-xl font-semibold">Session hydration</h2>
          <p className="mt-2 text-sm leading-6 text-[#5c4f40]">
            {currentUser.data
              ? `${currentUser.data.displayName} is loaded from GET /auth/me.`
              : 'Create or login to a reader before saving preferences.'}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#5c4f40]">
            {profileQuery.data
              ? 'Profile updates now write through PATCH /profiles/me.'
              : 'Create a profile before sending behavior signals.'}
          </p>
        </div>
      </section>

    </div>
  )
}

function BehaviorCapture() {
  const createReadingEvent = useCreateReadingEvent()
  const createDnfRecord = useCreateDnfRecord()
  const readingEvents = useMyReadingEvents()
  const dnfRecords = useMyDnfRecords()
  const booksQuery = useBooks({ limit: 25 })
  const [signalBookId, setSignalBookId] = useState('')
  const [readingSignal, setReadingSignal] = useState('liked')
  const [dnfReason, setDnfReason] = useState('too-slow')
  const [dnfPercent, setDnfPercent] = useState(25)
  const [pacingSnapshot, setPacingSnapshot] = useState('moderate')
  const [difficultySnapshot, setDifficultySnapshot] = useState('moderate')

  useEffect(() => {
    if (!signalBookId && booksQuery.data?.items[0]?._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSignalBookId(booksQuery.data.items[0]._id)
    }
  }, [booksQuery.data?.items, signalBookId])

  const bookTitleById = useMemo(() => {
    return new Map(
      booksQuery.data?.items.map((book) => [book._id, book.title]) ?? [],
    )
  }, [booksQuery.data?.items])

  function handleReadingSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createReadingEvent.mutate({
      bookId: signalBookId,
      eventType: readingSignal as 'liked' | 'disliked' | 'completed' | 'saved',
      progressPercent: readingSignal === 'completed' ? 100 : undefined,
    })
  }

  function handleDnfSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createDnfRecord.mutate({
      bookId: signalBookId,
      difficultySnapshot,
      pacingSnapshot,
      reason: dnfReason as 'too-slow',
      stoppedAtPercent: dnfPercent,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Capture liked, disliked, completed, saved, and abandoned books as reader-owned behavior history."
        eyebrow="Behavior history"
        title="Turn reading actions into signals"
      />

      <section className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <form className="grid gap-4" onSubmit={handleReadingSignal}>
            <SelectField
              label="Book"
              onChange={setSignalBookId}
              options={
                booksQuery.data?.items.map((book) => [book._id, book.title]) ?? []
              }
              value={signalBookId}
            />
            <SelectField
              label="Signal"
              onChange={setReadingSignal}
              options={[
                ['liked', 'Liked'],
                ['disliked', 'Disliked'],
                ['completed', 'Completed'],
                ['saved', 'Saved'],
              ]}
              value={readingSignal}
            />
            <button
              className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-[#2f5d46] px-4 text-sm font-semibold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!signalBookId || createReadingEvent.isPending}
              type="submit"
            >
              <BookOpenCheck size={17} />
              Save signal
            </button>
            {createReadingEvent.isSuccess ? (
              <StatusMessage tone="success">Reading signal captured.</StatusMessage>
            ) : null}
          </form>

          <form className="grid gap-4" onSubmit={handleDnfSignal}>
            <SelectField
              label="DNF reason"
              onChange={setDnfReason}
              options={[
                ['too-slow', 'Too slow'],
                ['too-difficult', 'Too difficult'],
                ['not-relevant', 'Not relevant'],
                ['wrong-mood', 'Wrong mood'],
                ['poor-writing-style', 'Poor writing style'],
                ['too-long', 'Too long'],
                ['lost-interest', 'Lost interest'],
                ['other', 'Other'],
              ]}
              value={dnfReason}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <SelectField
                label="Pacing"
                onChange={setPacingSnapshot}
                options={[
                  ['slow', 'Slow'],
                  ['moderate', 'Moderate'],
                  ['fast', 'Fast'],
                ]}
                value={pacingSnapshot}
              />
              <SelectField
                label="Difficulty"
                onChange={setDifficultySnapshot}
                options={[
                  ['easy', 'Easy'],
                  ['moderate', 'Moderate'],
                  ['challenging', 'Challenging'],
                ]}
                value={difficultySnapshot}
              />
              <label className="grid gap-2 text-sm font-semibold">
                Stopped at percent
                <input
                  className="h-11 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
                  max={100}
                  min={0}
                  onChange={(event) => setDnfPercent(Number(event.target.value))}
                  type="number"
                  value={dnfPercent}
                />
              </label>
            </div>
            <button
              className="inline-flex h-11 w-fit items-center gap-2 rounded-md bg-[#7b3f2a] px-4 text-sm font-semibold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!signalBookId || createDnfRecord.isPending}
              type="submit"
            >
              <ListChecks size={17} />
              Save DNF
            </button>
            {createDnfRecord.isSuccess ? (
              <StatusMessage tone="success">DNF pattern captured.</StatusMessage>
            ) : null}
          </form>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BehaviorHistoryTable
          emptyLabel="No reading events yet"
          rows={
            readingEvents.data?.map((event) => [
              event.eventType,
              bookTitleById.get(event.bookId) ?? event.bookId,
              event.progressPercent ? `${event.progressPercent}%` : 'Signal',
            ]) ?? []
          }
          title="Reading events"
        />
        <BehaviorHistoryTable
          emptyLabel="No DNF records yet"
          rows={
            dnfRecords.data?.map((record) => [
              record.reason,
              bookTitleById.get(record.bookId) ?? record.bookId,
              `${record.stoppedAtPercent}%`,
            ]) ?? []
          }
          title="DNF records"
        />
      </section>
    </div>
  )
}

function BehaviorHistoryTable({
  emptyLabel,
  rows,
  title,
}: {
  emptyLabel: string
  rows: string[][]
  title: string
}) {
  return (
    <div className="overflow-hidden rounded-md border border-[#d8cbb8] bg-[#fffaf0]">
      <div className="border-b border-[#e7dbc8] px-4 py-3 text-sm font-semibold">
        {title}
      </div>
      {rows.length === 0 ? <TableStatus>{emptyLabel}</TableStatus> : null}
      {rows.map(([signal, book, detail]) => (
        <div
          className="grid grid-cols-[0.7fr_1fr_0.5fr] gap-3 border-b border-[#eee4d6] px-4 py-4 text-sm last:border-b-0"
          key={`${signal}-${book}-${detail}`}
        >
          <span className="font-semibold">{signal}</span>
          <span>{book}</span>
          <span>{detail}</span>
        </div>
      ))}
    </div>
  )
}

function ReaderProfileHistory() {
  const currentUser = useCurrentUser()
  const profile = useMyReadingProfile()
  const readingEvents = useMyReadingEvents()
  const dnfRecords = useMyDnfRecords()
  const sessions = useMyRecommendationSessions()
  const booksQuery = useBooks({ limit: 100 })
  const bookTitleById = useMemo(() => {
    return new Map(
      booksQuery.data?.items.map((book) => [book._id, book.title]) ?? [],
    )
  }, [booksQuery.data?.items])

  const feedbackRows =
    sessions.data?.flatMap((session) =>
      session.candidates
        .filter((candidate) => candidate.feedback)
        .map((candidate) => [
          candidate.feedback?.status ?? 'feedback',
          bookTitleById.get(candidate.bookId) ?? candidate.bookId,
          session.context.selectedOutcome,
        ]),
    ) ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        description="A consolidated reader view for preferences, behavior signals, DNF records, and recommendation feedback."
        eyebrow="Reader profile"
        title="Review the current reading identity"
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
          <UserRound className="text-[#315d48]" size={20} />
          <h2 className="mt-4 text-lg font-semibold">Session</h2>
          <p className="mt-2 text-sm text-[#62584a]">
            {currentUser.data
              ? `${currentUser.data.displayName} · ${currentUser.data.email}`
              : 'Login to hydrate the current reader.'}
          </p>
        </article>
        <article className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
          <Gauge className="text-[#315d48]" size={20} />
          <h2 className="mt-4 text-lg font-semibold">Preferences</h2>
          <p className="mt-2 text-sm text-[#62584a]">
            {profile.data?.targetOutcomes?.join(', ') || 'No outcome profile yet'}
          </p>
          <p className="mt-2 text-sm text-[#62584a]">
            {profile.data
              ? `${profile.data.preferredDepth ?? 'balanced'} depth · ${profile.data.dailyReadingMinutes ?? 30} min/day`
              : 'Complete preferences to tune scoring.'}
          </p>
        </article>
        <article className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
          <ListChecks className="text-[#315d48]" size={20} />
          <h2 className="mt-4 text-lg font-semibold">History</h2>
          <p className="mt-2 text-sm text-[#62584a]">
            {readingEvents.data?.length ?? 0} events · {dnfRecords.data?.length ?? 0}{' '}
            DNF records · {feedbackRows.length} feedback marks
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <BehaviorHistoryTable
          emptyLabel="No reading events yet"
          rows={
            readingEvents.data?.map((event) => [
              event.eventType,
              bookTitleById.get(event.bookId) ?? event.bookId,
              event.progressPercent ? `${event.progressPercent}%` : 'Signal',
            ]) ?? []
          }
          title="Reading events"
        />
        <BehaviorHistoryTable
          emptyLabel="No DNF records yet"
          rows={
            dnfRecords.data?.map((record) => [
              record.reason,
              bookTitleById.get(record.bookId) ?? record.bookId,
              `${record.stoppedAtPercent}%`,
            ]) ?? []
          }
          title="DNF records"
        />
        <BehaviorHistoryTable
          emptyLabel="No recommendation feedback yet"
          rows={feedbackRows}
          title="Recommendation feedback"
        />
      </section>
    </div>
  )
}

function Login() {
  const login = useLogin()
  const [email, setEmail] = useState('reader@bookcompass.local')
  const [password, setPassword] = useState('bookcompass-demo')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login.mutate({ email, password })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Use an existing local reader account before creating authenticated profile, event, DNF, or recommendation records."
        eyebrow="Session"
        title="Continue with a reader session"
      />

      <form
        className="max-w-xl rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4">
          <TextField label="Email" onChange={setEmail} value={email} />
          <TextField
            label="Password"
            onChange={setPassword}
            type="password"
            value={password}
          />
        </div>
        <button
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#2f5d46] px-4 text-sm font-semibold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={login.isPending}
          type="submit"
        >
          <UserRound size={17} />
          {login.isPending ? 'Opening session' : 'Login'}
        </button>
        {login.isSuccess ? (
          <StatusMessage tone="success">
            Session ready for {login.data.user.displayName}.
          </StatusMessage>
        ) : null}
        {login.isError ? (
          <StatusMessage tone="error">
            Could not login with those credentials.
          </StatusMessage>
        ) : null}
      </form>
    </div>
  )
}

function Library() {
  const booksQuery = useBooks({ limit: 25 })
  const authorsQuery = useAuthors({ limit: 100 })
  const authorNameById = useMemo(() => {
    return new Map(
      authorsQuery.data?.items.map((author) => [author._id, author.name]) ?? [],
    )
  }, [authorsQuery.data?.items])

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
          <span>Author</span>
          <span>Depth</span>
          <span>Minutes</span>
        </div>
        {booksQuery.isLoading ? <TableStatus>Loading catalog</TableStatus> : null}
        {booksQuery.isError ? (
          <TableStatus>Could not load books from the API</TableStatus>
        ) : null}
        {booksQuery.data?.items.map((book) => (
          <div
            className="grid grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr] border-b border-[#eee4d6] px-4 py-4 text-sm last:border-b-0"
            key={book._id}
          >
            <span className="font-semibold">{book.title}</span>
            <span>{authorNameById.get(book.authorId) ?? 'Unknown author'}</span>
            <span>{book.depth}</span>
            <span>{book.estimatedMinutes ?? 'Unset'}</span>
          </div>
        ))}
      </section>
    </div>
  )
}

function RecommendationStart() {
  const createSession = useCreateRecommendationSession()
  const booksQuery = useBooks({ limit: 100 })
  const [selectedOutcome, setSelectedOutcome] = useState('productivity')
  const [mood, setMood] = useState('focused')
  const [energyLevel, setEnergyLevel] = useState('medium')
  const [focusLevel, setFocusLevel] = useState('high')
  const [availableMinutes, setAvailableMinutes] = useState(420)
  const [preferredDepth, setPreferredDepth] = useState('deep')
  const bookTitleById = useMemo(() => {
    return new Map(
      booksQuery.data?.items.map((book) => [book._id, book.title]) ?? [],
    )
  }, [booksQuery.data?.items])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createSession.mutate({
      availableMinutes,
      energyLevel,
      focusLevel,
      mood,
      preferredDepth,
      selectedOutcome,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Create a decision session from the current outcome, mood, energy, focus, time, and depth. The API scores candidates from profile, catalog, behavior, and DNF signals."
        eyebrow="Recommendation session"
        title="Choose for the current reading moment"
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <form
          className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Outcome"
              onChange={setSelectedOutcome}
              options={outcomeOptions}
              value={selectedOutcome}
            />
            <SelectField
              label="Mood"
              onChange={setMood}
              options={moodOptions}
              value={mood}
            />
            <SelectField
              label="Energy"
              onChange={setEnergyLevel}
              options={energyOptions}
              value={energyLevel}
            />
            <SelectField
              label="Focus"
              onChange={setFocusLevel}
              options={focusOptions}
              value={focusLevel}
            />
            <label className="grid gap-2 text-sm font-semibold">
              Available minutes
              <input
                className="h-11 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
                max={1440}
                min={1}
                onChange={(event) =>
                  setAvailableMinutes(Number(event.target.value))
                }
                type="number"
                value={availableMinutes}
              />
            </label>
            <SelectField
              label="Depth"
              onChange={setPreferredDepth}
              options={depthOptions}
              value={preferredDepth}
            />
          </div>
          <button
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#2f5d46] px-4 text-sm font-semibold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={createSession.isPending}
            type="submit"
          >
            <Compass size={17} />
            {createSession.isPending ? 'Scoring books' : 'Score recommendations'}
          </button>
          {createSession.isError ? (
            <StatusMessage tone="error">
              Could not create a recommendation session. Login and complete a
              profile first.
            </StatusMessage>
          ) : null}
        </form>

        <div className="rounded-md border border-[#d4c3aa] bg-[#efe3cf] p-5">
          <Sparkles className="text-[#315d48]" size={22} />
          <h2 className="mt-4 text-xl font-semibold">Scoring inputs</h2>
          <div className="mt-3 grid gap-2 text-sm text-[#5c4f40]">
            {readingSignals.map((signal) => (
              <p className="flex items-center gap-2" key={signal}>
                <ChevronRight size={15} />
                {signal}
              </p>
            ))}
          </div>
        </div>
      </section>

      {createSession.data ? (
        <RecommendationSessionCard
          bookTitleById={bookTitleById}
          session={createSession.data}
        />
      ) : null}
    </div>
  )
}

function RecommendationHistory() {
  const sessions = useMyRecommendationSessions()
  const booksQuery = useBooks({ limit: 100 })
  const bookTitleById = useMemo(() => {
    return new Map(
      booksQuery.data?.items.map((book) => [book._id, book.title]) ?? [],
    )
  }, [booksQuery.data?.items])

  return (
    <div className="space-y-6">
      <PageHeader
        description="Past sessions show the selected context, ranked candidates, score breakdowns, and explanation lines from the deterministic engine."
        eyebrow="Recommendation history"
        title="Review why each book was suggested"
      />

      {sessions.isLoading ? <TableStatus>Loading sessions</TableStatus> : null}
      {sessions.isError ? (
        <TableStatus>Login to review recommendation history</TableStatus>
      ) : null}
      {sessions.data?.length === 0 ? (
        <div className="rounded-md border border-dashed border-[#c9b79e] bg-[#fffaf0] p-8 text-center">
          <BookOpenCheck className="mx-auto text-[#315d48]" size={28} />
          <p className="mt-3 font-semibold">No sessions yet</p>
          <p className="mt-2 text-sm text-[#62584a]">
            Create a recommendation session to persist scored candidates.
          </p>
        </div>
      ) : null}
      <div className="grid gap-4">
        {sessions.data?.map((session) => (
          <RecommendationSessionCard
            bookTitleById={bookTitleById}
            key={session._id}
            session={session}
          />
        ))}
      </div>
    </div>
  )
}

function RecommendationSessionCard({
  bookTitleById,
  session,
}: {
  bookTitleById: Map<string, string>
  session: RecommendationSession
}) {
  const topCandidates = session.candidates.slice(0, 3)
  const recordFeedback = useRecordRecommendationFeedback()
  const [feedbackDrafts, setFeedbackDrafts] = useState<
    Record<string, { progressPercent: string; note: string }>
  >({})

  function getFeedbackDraft(bookId: string) {
    return feedbackDrafts[bookId] ?? { progressPercent: '', note: '' }
  }

  function updateFeedbackDraft(
    bookId: string,
    patch: Partial<{ progressPercent: string; note: string }>,
  ) {
    setFeedbackDrafts((current) => ({
      ...current,
      [bookId]: {
        ...(current[bookId] ?? { progressPercent: '', note: '' }),
        ...patch,
      },
    }))
  }

  function handleFeedback(
    candidate: RecommendationSession['candidates'][number],
    status: RecommendationFeedbackStatus,
  ) {
    const draft = getFeedbackDraft(candidate.bookId)
    const parsedProgress =
      draft.progressPercent.trim().length > 0
        ? Number(draft.progressPercent)
        : candidate.feedback?.progressPercent

    recordFeedback.mutate({
      bookId: candidate.bookId,
      note: draft.note.trim() || candidate.feedback?.note || undefined,
      progressPercent: Number.isFinite(parsedProgress)
        ? parsedProgress
        : undefined,
      sessionId: session._id,
      status,
    })
  }

  return (
    <section className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7dbc8] pb-3">
        <div>
          <p className="text-sm font-semibold uppercase text-[#8a602b]">
            {session.context.selectedOutcome}
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            {session.status} recommendation session
          </h2>
        </div>
        <p className="text-sm text-[#62584a]">
          {session.context.mood} mood · {session.context.availableMinutes} min ·{' '}
          {session.context.preferredDepth}
        </p>
      </div>
      {topCandidates.length === 0 ? (
        <TableStatus>No scored candidates matched this context</TableStatus>
      ) : null}
      <div className="grid gap-3 pt-4">
        {topCandidates.map((candidate) => {
          const draft = getFeedbackDraft(candidate.bookId)
          const progressValue =
            draft.progressPercent ||
            candidate.feedback?.progressPercent?.toString() ||
            ''
          const noteValue = draft.note || candidate.feedback?.note || ''

          return (
            <article
              className="rounded-md border border-[#e2d5c2] bg-white/60 p-4"
              key={candidate.bookId}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">
                  {bookTitleById.get(candidate.bookId) ?? candidate.bookId}
                </h3>
                <span className="rounded-md bg-[#e5eee7] px-2 py-1 text-sm font-semibold text-[#20372d]">
                  {candidate.finalScore}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-[#5c4f40]">
                {candidate.explanation.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mt-4 grid gap-3 border-t border-[#eee4d6] pt-3">
                <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                  <label className="grid gap-2 text-sm font-semibold">
                    Progress %
                    <input
                      className="h-10 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
                      max={100}
                      min={0}
                      onChange={(event) =>
                        updateFeedbackDraft(candidate.bookId, {
                          progressPercent: event.target.value,
                        })
                      }
                      type="number"
                      value={progressValue}
                    />
                  </label>
                  <TextAreaField
                    label="Feedback note"
                    onChange={(note) =>
                      updateFeedbackDraft(candidate.bookId, { note })
                    }
                    value={noteValue}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {feedbackActions.map(([status, label]) => (
                    <button
                      className={[
                        'inline-flex h-9 items-center rounded-md border px-3 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
                        candidate.feedback?.status === status
                          ? 'border-[#315d48] bg-[#e5eee7] text-[#20372d]'
                          : 'border-[#d8cbb8] bg-white/70 text-[#5c4f40] hover:border-[#315d48]',
                      ].join(' ')}
                      disabled={recordFeedback.isPending}
                      key={status}
                      onClick={() => handleFeedback(candidate, status)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                  {candidate.feedback ? (
                    <span className="text-xs font-semibold uppercase leading-5 text-[#8a602b]">
                      Last marked {candidate.feedback.status}
                      {candidate.feedback.progressPercent !== undefined
                        ? ` at ${candidate.feedback.progressPercent}%`
                        : ''}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {recordFeedback.isError ? (
        <StatusMessage tone="error">
          Could not save recommendation feedback. Login again and retry.
        </StatusMessage>
      ) : null}
    </section>
  )
}

function AdminHome() {
  const analytics = useAdminAnalytics()
  const reviewCounts = analytics.data?.catalogReview.byEnrichmentStatus ?? {}
  const feedbackCounts = analytics.data?.candidateFeedback.byStatus ?? {}

  return (
    <div className="space-y-6">
      <PageHeader
        description="Admin surfaces will keep the catalog, outcome tags, recommendation tuning, and analytics operational."
        eyebrow="Admin"
        title="Manage the engine behind the reading desk"
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {adminModules.map(([title, body], index) => (
          <article
            className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
            key={title}
          >
            <BarChart3 className="text-[#315d48]" size={20} />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#62584a]">{body}</p>
            {index === 0 ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[#74624d]">Ready</dt>
                  <dd className="text-xl font-semibold">
                    {analytics.data?.catalogReview.eligible ?? '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#74624d]">Drafts</dt>
                  <dd className="text-xl font-semibold">
                    {analytics.data?.catalogReview.ineligible ?? '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#74624d]">Imported</dt>
                  <dd className="text-xl font-semibold">
                    {reviewCounts.imported ?? 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#74624d]">Needs review</dt>
                  <dd className="text-xl font-semibold">
                    {reviewCounts['needs-review'] ?? 0}
                  </dd>
                </div>
              </dl>
            ) : null}
            {index === 2 ? (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[#74624d]">Recorded</dt>
                  <dd className="text-xl font-semibold">
                    {analytics.data?.candidateFeedback.totalRecorded ?? '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#74624d]">Completed</dt>
                  <dd className="text-xl font-semibold">
                    {feedbackCounts.completed ?? 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#74624d]">Accepted</dt>
                  <dd className="text-xl font-semibold">
                    {feedbackCounts.accepted ?? 0}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#74624d]">Abandoned</dt>
                  <dd className="text-xl font-semibold">
                    {feedbackCounts.abandoned ?? 0}
                  </dd>
                </div>
              </dl>
            ) : null}
          </article>
        ))}
      </section>
      {analytics.isError ? (
        <StatusMessage tone="error">
          Admin analytics require an admin session.
        </StatusMessage>
      ) : null}
    </div>
  )
}

function AdminAuthors() {
  const createAuthor = useCreateAuthor()
  const updateAuthor = useUpdateAuthor()
  const deleteAuthor = useDeleteAuthor()
  const authorsQuery = useAuthors({ limit: 100 })
  const [authorName, setAuthorName] = useState('')
  const [authorGenres, setAuthorGenres] = useState('Business, Productivity')
  const [authorOutcome, setAuthorOutcome] = useState('productivity')
  const [editingAuthorId, setEditingAuthorId] = useState('')

  function handleAuthorCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = {
      knownForGenres: toList(authorGenres),
      name: authorName,
      outcomeStrengths: [authorOutcome],
    }

    if (editingAuthorId) {
      updateAuthor.mutate({ authorId: editingAuthorId, body: payload })
      return
    }

    createAuthor.mutate(payload)
  }

  function startAuthorEdit(author: Author) {
    setEditingAuthorId(author._id)
    setAuthorName(author.name)
    setAuthorGenres(author.knownForGenres.join(', '))
    setAuthorOutcome(author.outcomeStrengths[0] ?? 'productivity')
  }

  function resetAuthorForm() {
    setEditingAuthorId('')
    setAuthorName('')
    setAuthorGenres('Business, Productivity')
    setAuthorOutcome('productivity')
  }

  const isSavingAuthor = createAuthor.isPending || updateAuthor.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        description="Author administration is separate from book catalog review so source records, genre strengths, and outcome strengths stay easier to scan."
        eyebrow="Admin authors"
        title="Manage author metadata"
      />

      <form
        className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
        onSubmit={handleAuthorCreate}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {editingAuthorId ? 'Edit author' : 'Create author'}
          </h2>
          {editingAuthorId ? (
            <button
              className="inline-flex size-9 items-center justify-center rounded-md border border-[#d8cbb8] bg-white/70 text-[#5c4f40] hover:border-[#315d48]"
              onClick={resetAuthorForm}
              title="Cancel author edit"
              type="button"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <TextField label="Name" onChange={setAuthorName} value={authorName} />
          <TextField
            label="Known genres"
            onChange={setAuthorGenres}
            value={authorGenres}
          />
          <SelectField
            label="Outcome strength"
            onChange={setAuthorOutcome}
            options={outcomeOptions}
            value={authorOutcome}
          />
        </div>
        <button
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#2f5d46] px-4 text-sm font-semibold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSavingAuthor || authorName.trim().length < 2}
          type="submit"
        >
          <UserRound size={17} />
          {isSavingAuthor
            ? 'Saving author'
            : editingAuthorId
              ? 'Update author'
              : 'Create author'}
        </button>
        {createAuthor.isSuccess ? (
          <StatusMessage tone="success">Created {createAuthor.data.name}.</StatusMessage>
        ) : null}
        {createAuthor.isError ? (
          <StatusMessage tone="error">
            Author creation requires an admin session.
          </StatusMessage>
        ) : null}
        {updateAuthor.isSuccess ? (
          <StatusMessage tone="success">Updated {updateAuthor.data.name}.</StatusMessage>
        ) : null}
        {updateAuthor.isError || deleteAuthor.isError ? (
          <StatusMessage tone="error">
            Author changes require an admin session and an existing record.
          </StatusMessage>
        ) : null}
      </form>

      <section className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
        <h2 className="text-lg font-semibold">Author operations</h2>
        <div className="mt-4 overflow-hidden rounded-md border border-[#e2d5c2]">
          <div className="grid grid-cols-[1fr_1fr_0.7fr] border-b border-[#e7dbc8] bg-[#f6eddd] px-4 py-3 text-xs font-semibold uppercase text-[#74624d]">
            <span>Author</span>
            <span>Genres</span>
            <span>Actions</span>
          </div>
          {authorsQuery.isLoading ? (
            <TableStatus>Loading authors</TableStatus>
          ) : null}
          {authorsQuery.isError ? (
            <TableStatus>Could not load author data</TableStatus>
          ) : null}
          {authorsQuery.data?.items.map((author) => (
            <div
              className="grid grid-cols-[1fr_1fr_0.7fr] items-center gap-3 border-b border-[#eee4d6] px-4 py-4 text-sm last:border-b-0"
              key={author._id}
            >
              <span className="font-semibold">{author.name}</span>
              <span>{author.knownForGenres.join(', ') || 'Unset'}</span>
              <span className="flex items-center gap-2">
                <button
                  className="inline-flex size-9 items-center justify-center rounded-md border border-[#d8cbb8] bg-white/70 text-[#5c4f40] hover:border-[#315d48]"
                  onClick={() => startAuthorEdit(author)}
                  title="Edit author"
                  type="button"
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="inline-flex size-9 items-center justify-center rounded-md border border-[#dfb8a6] bg-white/70 text-[#7b2f19] hover:border-[#7b2f19] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deleteAuthor.isPending}
                  onClick={() => deleteAuthor.mutate(author._id)}
                  title="Delete author"
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function AdminBooks() {
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const deleteBook = useDeleteBook()
  const [q, setQ] = useState('')
  const [outcome, setOutcome] = useState('')
  const [eligibleOnly, setEligibleOnly] = useState(false)
  const [ineligibleOnly, setIneligibleOnly] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [styleTagFilter, setStyleTagFilter] = useState('')
  const [riskTagFilter, setRiskTagFilter] = useState('')
  const [editingBookId, setEditingBookId] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [bookAuthorId, setBookAuthorId] = useState('')
  const [bookGenres, setBookGenres] = useState('Business, Productivity')
  const [bookOutcome, setBookOutcome] = useState('productivity')
  const [bookStyleTags, setBookStyleTags] = useState('practical, actionable')
  const [bookRiskTags, setBookRiskTags] = useState('dense')
  const [bookEnrichmentStatus, setBookEnrichmentStatus] = useState('reviewed')
  const [bookRecommendationEligible, setBookRecommendationEligible] =
    useState(true)
  const [bookDepth, setBookDepth] = useState('balanced')
  const [bookPacing, setBookPacing] = useState('moderate')
  const [bookDifficulty, setBookDifficulty] = useState('moderate')
  const [bookFormat, setBookFormat] = useState('ebook')
  const [estimatedMinutes, setEstimatedMinutes] = useState(240)
  const [bookOffset, setBookOffset] = useState(0)
  const bookPageSize = 20
  const booksQuery = useBooks({
    limit: bookPageSize,
    offset: bookOffset,
    outcome: outcome || undefined,
    q,
    enrichmentStatus: statusFilter || undefined,
    recommendationEligible: eligibleOnly
      ? true
      : ineligibleOnly
        ? false
        : undefined,
    riskTag: riskTagFilter || undefined,
    styleTag: styleTagFilter || undefined,
  })
  const authorsQuery = useAuthors({ limit: 100 })

  useEffect(() => {
    if (!bookAuthorId && authorsQuery.data?.items[0]?._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookAuthorId(authorsQuery.data.items[0]._id)
    }
  }, [authorsQuery.data?.items, bookAuthorId])

  function updateBookFilter(
    setter: (value: string) => void,
    value: string,
  ) {
    setter(value)
    setBookOffset(0)
  }

  function handleBookCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = {
      authorId: bookAuthorId,
      depth: bookDepth,
      difficulty: bookDifficulty,
      estimatedMinutes,
      enrichmentStatus: bookEnrichmentStatus,
      formats: [bookFormat],
      genres: toList(bookGenres),
      outcomeTags: [bookOutcome],
      pacing: bookPacing,
      recommendationEligible: bookRecommendationEligible,
      riskTags: toList(bookRiskTags),
      styleTags: toList(bookStyleTags),
      title: bookTitle,
    }

    if (editingBookId) {
      updateBook.mutate({ bookId: editingBookId, body: payload })
      return
    }

    createBook.mutate(payload)
  }

  function startBookEdit(book: Book) {
    setEditingBookId(book._id)
    setBookTitle(book.title)
    setBookAuthorId(book.authorId)
    setBookGenres(book.genres.join(', '))
    setBookOutcome(book.outcomeTags[0] ?? 'productivity')
    setBookStyleTags(book.styleTags.join(', '))
    setBookRiskTags(book.riskTags.join(', '))
    setBookEnrichmentStatus(book.enrichmentStatus ?? 'seeded')
    setBookRecommendationEligible(book.recommendationEligible)
    setBookDepth(book.depth)
    setBookPacing(book.pacing)
    setBookDifficulty(book.difficulty)
    setBookFormat(book.formats[0] ?? 'ebook')
    setEstimatedMinutes(book.estimatedMinutes ?? 240)
  }

  function resetBookForm() {
    setEditingBookId('')
    setBookTitle('')
    setBookGenres('Business, Productivity')
    setBookOutcome('productivity')
    setBookStyleTags('practical, actionable')
    setBookRiskTags('dense')
    setBookEnrichmentStatus('reviewed')
    setBookRecommendationEligible(true)
    setBookDepth('balanced')
    setBookPacing('moderate')
    setBookDifficulty('moderate')
    setBookFormat('ebook')
    setEstimatedMinutes(240)
  }

  function applyReviewQueue(preset: 'imported' | 'needs-review' | 'reviewed') {
    setBookOffset(0)
    setQ('')
    setOutcome('')
    setStyleTagFilter('')
    setRiskTagFilter('')

    if (preset === 'reviewed') {
      setStatusFilter('reviewed')
      setEligibleOnly(true)
      setIneligibleOnly(false)
      return
    }

    setStatusFilter(preset)
    setEligibleOnly(false)
    setIneligibleOnly(true)
  }

  function saveBookReviewState(
    book: Book,
    body: {
      enrichmentStatus: string
      recommendationEligible: boolean
    },
  ) {
    updateBook.mutate({
      bookId: book._id,
      body,
    })
  }

  const isSavingBook = createBook.isPending || updateBook.isPending
  const firstVisibleBook = booksQuery.data?.total
    ? booksQuery.data.offset + 1
    : 0
  const lastVisibleBook = booksQuery.data
    ? Math.min(
        booksQuery.data.offset + booksQuery.data.items.length,
        booksQuery.data.total,
      )
    : 0
  const hasPreviousBookPage = bookOffset > 0
  const hasNextBookPage = booksQuery.data
    ? booksQuery.data.offset + booksQuery.data.limit < booksQuery.data.total
    : false

  return (
    <div className="space-y-6">
      <PageHeader
        description="Book administration handles recommendation eligibility, review status, style signals, and anti-DNF risk metadata."
        eyebrow="Admin catalog"
        title="Review book recommendation readiness"
      />

      <section className="grid gap-4">
        <form
          className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5"
          onSubmit={handleBookCreate}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              {editingBookId ? 'Edit book' : 'Create book'}
            </h2>
            {editingBookId ? (
              <button
                className="inline-flex size-9 items-center justify-center rounded-md border border-[#d8cbb8] bg-white/70 text-[#5c4f40] hover:border-[#315d48]"
                onClick={resetBookForm}
                title="Cancel book edit"
                type="button"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextField label="Title" onChange={setBookTitle} value={bookTitle} />
            <SelectField
              label="Author"
              onChange={setBookAuthorId}
              options={
                authorsQuery.data?.items.map((author) => [
                  author._id,
                  author.name,
                ]) ?? []
              }
              value={bookAuthorId}
            />
            <TextField
              label="Genres"
              onChange={setBookGenres}
              value={bookGenres}
            />
            <TextField
              label="Style tags"
              onChange={setBookStyleTags}
              value={bookStyleTags}
            />
            <TextField
              label="Risk tags"
              onChange={setBookRiskTags}
              value={bookRiskTags}
            />
            <SelectField
              label="Outcome"
              onChange={setBookOutcome}
              options={outcomeOptions}
              value={bookOutcome}
            />
            <SelectField
              label="Depth"
              onChange={setBookDepth}
              options={depthOptions}
              value={bookDepth}
            />
            <SelectField
              label="Pacing"
              onChange={setBookPacing}
              options={pacingOptions}
              value={bookPacing}
            />
            <SelectField
              label="Difficulty"
              onChange={setBookDifficulty}
              options={difficultyOptions}
              value={bookDifficulty}
            />
            <SelectField
              label="Format"
              onChange={setBookFormat}
              options={formatOptions}
              value={bookFormat}
            />
            <SelectField
              label="Review status"
              onChange={setBookEnrichmentStatus}
              options={enrichmentStatusOptions}
              value={bookEnrichmentStatus}
            />
            <CheckboxField
              checked={bookRecommendationEligible}
              label="Recommendation eligible"
              onChange={setBookRecommendationEligible}
            />
            <label className="grid gap-2 text-sm font-semibold">
              Estimated minutes
              <input
                className="h-11 rounded-md border border-[#cfc0aa] bg-white px-3 text-sm outline-none focus:border-[#315d48]"
                min={1}
                onChange={(event) =>
                  setEstimatedMinutes(Number(event.target.value))
                }
                type="number"
                value={estimatedMinutes}
              />
            </label>
          </div>
          <button
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#2f5d46] px-4 text-sm font-semibold text-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={
              isSavingBook ||
              bookTitle.trim().length === 0 ||
              !bookAuthorId
            }
            type="submit"
          >
            <BookMarked size={17} />
            {isSavingBook
              ? 'Saving book'
              : editingBookId
                ? 'Update book'
                : 'Create book'}
          </button>
          {createBook.isSuccess ? (
            <StatusMessage tone="success">
              Created {createBook.data.title}.
            </StatusMessage>
          ) : null}
          {createBook.isError ? (
            <StatusMessage tone="error">
              Book creation requires an admin session and a unique title-author
              pair.
            </StatusMessage>
          ) : null}
          {updateBook.isSuccess ? (
            <StatusMessage tone="success">
              Updated {updateBook.data.title}.
            </StatusMessage>
          ) : null}
          {updateBook.isError || deleteBook.isError ? (
            <StatusMessage tone="error">
              Book changes require an admin session and an existing unique
              title-author pair.
            </StatusMessage>
          ) : null}
        </form>
      </section>

      <section className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
        <div className="flex flex-wrap gap-2 border-b border-[#e7dbc8] pb-4">
          <button
            className="inline-flex h-9 items-center rounded-md border border-[#d8cbb8] bg-white/70 px-3 text-xs font-semibold text-[#5c4f40] hover:border-[#315d48]"
            onClick={() => applyReviewQueue('imported')}
            type="button"
          >
            Imported drafts
          </button>
          <button
            className="inline-flex h-9 items-center rounded-md border border-[#d8cbb8] bg-white/70 px-3 text-xs font-semibold text-[#5c4f40] hover:border-[#315d48]"
            onClick={() => applyReviewQueue('needs-review')}
            type="button"
          >
            Needs review
          </button>
          <button
            className="inline-flex h-9 items-center rounded-md border border-[#d8cbb8] bg-white/70 px-3 text-xs font-semibold text-[#5c4f40] hover:border-[#315d48]"
            onClick={() => applyReviewQueue('reviewed')}
            type="button"
          >
            Reviewed eligible
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <TextField
            label="Search title"
            onChange={(value) => updateBookFilter(setQ, value)}
            value={q}
          />
          <SelectField
            label="Outcome"
            onChange={(value) => updateBookFilter(setOutcome, value)}
            options={[['', 'Any outcome'], ...outcomeOptions]}
            value={outcome}
          />
          <SelectField
            label="Review status"
            onChange={(value) => updateBookFilter(setStatusFilter, value)}
            options={[['', 'Any status'], ...enrichmentStatusOptions]}
            value={statusFilter}
          />
          <CheckboxField
            checked={eligibleOnly}
            label="Eligible only"
            onChange={(checked) => {
              setBookOffset(0)
              setEligibleOnly(checked)
              if (checked) {
                setIneligibleOnly(false)
              }
            }}
          />
          <CheckboxField
            checked={ineligibleOnly}
            label="Drafts only"
            onChange={(checked) => {
              setBookOffset(0)
              setIneligibleOnly(checked)
              if (checked) {
                setEligibleOnly(false)
              }
            }}
          />
          <TextField
            label="Style tag"
            onChange={(value) => updateBookFilter(setStyleTagFilter, value)}
            value={styleTagFilter}
          />
          <TextField
            label="Risk tag"
            onChange={(value) => updateBookFilter(setRiskTagFilter, value)}
            value={riskTagFilter}
          />
        </div>
        <div className="mt-5 overflow-hidden rounded-md border border-[#e2d5c2]">
          <div className="grid grid-cols-[1.1fr_0.65fr_0.55fr_0.8fr_1fr] border-b border-[#e7dbc8] bg-[#f6eddd] px-4 py-3 text-xs font-semibold uppercase text-[#74624d]">
            <span>Book</span>
            <span>Status</span>
            <span>Eligible</span>
            <span>Risk tags</span>
            <span>Review actions</span>
          </div>
          {booksQuery.isLoading ? <TableStatus>Loading books</TableStatus> : null}
          {booksQuery.isError ? (
            <TableStatus>Could not load catalog data</TableStatus>
          ) : null}
          {booksQuery.data?.items.map((book) => (
            <div
              className="grid grid-cols-[1.1fr_0.65fr_0.55fr_0.8fr_1fr] items-center gap-3 border-b border-[#eee4d6] px-4 py-4 text-sm last:border-b-0"
              key={book._id}
            >
              <span className="font-semibold">{book.title}</span>
              <span>{book.enrichmentStatus}</span>
              <span>{book.recommendationEligible ? 'Yes' : 'No'}</span>
              <span>{book.riskTags.join(', ') || 'Unset'}</span>
              <span className="flex flex-wrap items-center gap-2">
                <button
                  className="inline-flex size-9 items-center justify-center rounded-md border border-[#d8cbb8] bg-white/70 text-[#5c4f40] hover:border-[#315d48]"
                  onClick={() => startBookEdit(book)}
                  title="Edit book"
                  type="button"
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="inline-flex h-9 items-center rounded-md border border-[#d8cbb8] bg-white/70 px-2 text-xs font-semibold text-[#5c4f40] hover:border-[#315d48] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={updateBook.isPending}
                  onClick={() =>
                    saveBookReviewState(book, {
                      enrichmentStatus: 'imported',
                      recommendationEligible: false,
                    })
                  }
                  type="button"
                >
                  Draft
                </button>
                <button
                  className="inline-flex h-9 items-center rounded-md border border-[#d8cbb8] bg-white/70 px-2 text-xs font-semibold text-[#5c4f40] hover:border-[#315d48] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={updateBook.isPending}
                  onClick={() =>
                    saveBookReviewState(book, {
                      enrichmentStatus: 'needs-review',
                      recommendationEligible: false,
                    })
                  }
                  type="button"
                >
                  Review
                </button>
                <button
                  className="inline-flex h-9 items-center rounded-md border border-[#adc8b7] bg-[#edf5ef] px-2 text-xs font-semibold text-[#244a37] hover:border-[#315d48] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={updateBook.isPending}
                  onClick={() =>
                    saveBookReviewState(book, {
                      enrichmentStatus: 'reviewed',
                      recommendationEligible: true,
                    })
                  }
                  type="button"
                >
                  Approve
                </button>
                <button
                  className="inline-flex h-9 items-center rounded-md border border-[#dfb8a6] bg-white/70 px-2 text-xs font-semibold text-[#7b2f19] hover:border-[#7b2f19] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={updateBook.isPending}
                  onClick={() =>
                    saveBookReviewState(book, {
                      enrichmentStatus: 'reviewed',
                      recommendationEligible: false,
                    })
                  }
                  type="button"
                >
                  Exclude
                </button>
                <button
                  className="inline-flex size-9 items-center justify-center rounded-md border border-[#dfb8a6] bg-white/70 text-[#7b2f19] hover:border-[#7b2f19] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deleteBook.isPending}
                  onClick={() => deleteBook.mutate(book._id)}
                  title="Delete book"
                  type="button"
                >
                  <Trash2 size={15} />
                </button>
              </span>
            </div>
          ))}
          {booksQuery.data?.items.length === 0 ? (
            <TableStatus>No matching books</TableStatus>
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[#62584a]">
          <p className="flex items-center gap-2">
            <BookMarked className="text-[#315d48]" size={17} />
            Showing {firstVisibleBook}-{lastVisibleBook} of{' '}
            {booksQuery.data?.total ?? 0} catalog records.
          </p>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 items-center rounded-md border border-[#d8cbb8] bg-white/70 px-3 text-xs font-semibold text-[#5c4f40] hover:border-[#315d48] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!hasPreviousBookPage || booksQuery.isFetching}
              onClick={() =>
                setBookOffset((current) => Math.max(0, current - bookPageSize))
              }
              type="button"
            >
              Previous
            </button>
            <button
              className="inline-flex h-9 items-center rounded-md border border-[#d8cbb8] bg-white/70 px-3 text-xs font-semibold text-[#5c4f40] hover:border-[#315d48] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!hasNextBookPage || booksQuery.isFetching}
              onClick={() => setBookOffset((current) => current + bookPageSize)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function App() {
  return <Shell />
}

export default App
