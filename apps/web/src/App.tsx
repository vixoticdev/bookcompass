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
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  useAuthors,
  useBooks,
  useCreateDnfRecord,
  useCreateMyReadingProfile,
  useCreateReadingEvent,
  useCreateReadingIdentity,
  useCurrentUser,
  useLogin,
  useMyReadingProfile,
  useUpdateMyReadingProfile,
} from './lib/queries'

const routes = [
  { to: '/login', label: 'Login', icon: UserRound },
  { to: '/onboarding', label: 'Onboarding', icon: UserRound },
  { to: '/library', label: 'Library', icon: LibraryBig },
  { to: '/recommendations/new', label: 'Recommend', icon: Compass },
  { to: '/recommendations/history', label: 'History', icon: ListChecks },
  { to: '/admin', label: 'Admin', icon: Settings2 },
  { to: '/admin/books', label: 'Catalog', icon: BookMarked },
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
              <Route element={<Navigate replace to="/onboarding" />} path="/" />
              <Route element={<Login />} path="/login" />
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

function Onboarding() {
  const createReadingIdentity = useCreateReadingIdentity()
  const createMyReadingProfile = useCreateMyReadingProfile()
  const updateReadingProfile = useUpdateMyReadingProfile()
  const createReadingEvent = useCreateReadingEvent()
  const createDnfRecord = useCreateDnfRecord()
  const currentUser = useCurrentUser()
  const profileQuery = useMyReadingProfile()
  const booksQuery = useBooks({ limit: 25 })
  const [displayName, setDisplayName] = useState('Demo Reader')
  const [email, setEmail] = useState('reader@bookcompass.local')
  const [password, setPassword] = useState('bookcompass-demo')
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
  const [signalBookId, setSignalBookId] = useState('')
  const [readingSignal, setReadingSignal] = useState('liked')
  const [dnfReason, setDnfReason] = useState('too-slow')
  const [dnfPercent, setDnfPercent] = useState(25)

  useEffect(() => {
    if (currentUser.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayName(currentUser.data.displayName)
      setEmail(currentUser.data.email)
    }
  }, [currentUser.data])

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

  useEffect(() => {
    if (!signalBookId && booksQuery.data?.items[0]?._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSignalBookId(booksQuery.data.items[0]._id)
    }
  }, [booksQuery.data?.items, signalBookId])

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

    createReadingIdentity.mutate({
      user: {
        displayName,
        email,
        password,
      },
      profile: profilePayload,
    })
  }

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
      difficultySnapshot: difficultyTolerance,
      pacingSnapshot: pacingTolerance,
      reason: dnfReason as 'too-slow',
      stoppedAtPercent: dnfPercent,
    })
  }

  const isUpdatingExistingProfile = Boolean(currentUser.data && profileQuery.data)
  const isSavingProfile =
    createReadingIdentity.isPending ||
    createMyReadingProfile.isPending ||
    updateReadingProfile.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        description="Capture the reader identity the engine will use later: goals, taste, format preferences, reading depth, and time constraints."
        eyebrow="Reader identity"
        title="Build a profile before scoring starts"
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
                : 'Save reader'}
          </button>
          {createReadingIdentity.isSuccess ? (
            <StatusMessage tone="success">
              Saved {createReadingIdentity.data.user.displayName} with a reading
              profile tied to the current authenticated session.
            </StatusMessage>
          ) : null}
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
          {createReadingIdentity.isError ? (
            <StatusMessage tone="error">
              Could not save the reader identity. Check the API response and try
              a unique email.
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
              : 'No stored session is active. Saving will sign up a reader first.'}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#5c4f40]">
            {profileQuery.data
              ? 'Profile updates now write through PATCH /profiles/me.'
              : 'Create a profile before sending behavior signals.'}
          </p>
        </div>
      </section>

      <section className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
        <h2 className="text-xl font-semibold">Reading behavior signals</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
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
  const [q, setQ] = useState('')
  const [outcome, setOutcome] = useState('productivity')
  const booksQuery = useBooks({ limit: 20, outcome, q })

  return (
    <div className="space-y-6">
      <PageHeader
        description="Catalog administration uses the new API filters to review seeded records by outcome, search text, depth, pacing, and difficulty."
        eyebrow="Admin catalog"
        title="Review the seeded catalog from Atlas"
      />

      <section className="rounded-md border border-[#d8cbb8] bg-[#fffaf0] p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <TextField label="Search title" onChange={setQ} value={q} />
          <SelectField
            label="Outcome"
            onChange={setOutcome}
            options={outcomeOptions}
            value={outcome}
          />
        </div>
        <div className="mt-5 overflow-hidden rounded-md border border-[#e2d5c2]">
          <div className="grid grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr] border-b border-[#e7dbc8] bg-[#f6eddd] px-4 py-3 text-xs font-semibold uppercase text-[#74624d]">
            <span>Book</span>
            <span>Pacing</span>
            <span>Difficulty</span>
            <span>Formats</span>
          </div>
          {booksQuery.isLoading ? <TableStatus>Loading books</TableStatus> : null}
          {booksQuery.isError ? (
            <TableStatus>Could not load catalog data</TableStatus>
          ) : null}
          {booksQuery.data?.items.map((book) => (
            <div
              className="grid grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr] border-b border-[#eee4d6] px-4 py-4 text-sm last:border-b-0"
              key={book._id}
            >
              <span className="font-semibold">{book.title}</span>
              <span>{book.pacing}</span>
              <span>{book.difficulty}</span>
              <span>{book.formats.join(', ')}</span>
            </div>
          ))}
          {booksQuery.data?.items.length === 0 ? (
            <TableStatus>No matching books</TableStatus>
          ) : null}
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-[#62584a]">
          <BookMarked className="text-[#315d48]" size={17} />
          Showing {booksQuery.data?.items.length ?? 0} of{' '}
          {booksQuery.data?.total ?? 0} catalog records.
        </p>
      </section>
    </div>
  )
}

function App() {
  return <Shell />
}

export default App
