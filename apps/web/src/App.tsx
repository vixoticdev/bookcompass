import {
  Activity,
  BarChart3,
  BookOpenCheck,
  Brain,
  Compass,
  Gauge,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react'

function App() {
  const signals = [
    'Outcome intent',
    'Mood and energy',
    'DNF patterns',
    'Available time',
    'Reading identity',
  ]

  const modules = [
    { icon: BookOpenCheck, label: 'Reading profile', status: 'Planned' },
    { icon: Brain, label: 'Decision engine', status: 'Scaffolded' },
    { icon: ShieldCheck, label: 'Anti-DNF scoring', status: 'Planned' },
    { icon: BarChart3, label: 'Admin analytics', status: 'Planned' },
  ]

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#1d2522]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8">
        <header className="flex items-center justify-between border-b border-[#d9d2c5] pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-[#1d2522] text-white">
              <Compass size={21} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6f5f46]">
                BookCompass
              </p>
              <h1 className="text-xl font-semibold">Reading Decision Engine</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-[#cfc5b6] bg-white/70 px-3 py-2 text-sm font-medium text-[#4a514d] sm:flex">
            <Activity size={16} />
            Project Day 1
          </div>
        </header>

        <div className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section>
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#cfc5b6] bg-white/80 px-3 py-2 text-sm font-medium text-[#536057]">
              <Gauge size={16} />
              Setup baseline
            </div>
            <h2 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
              Decide what to read next using behavior, goals, mood, and DNF
              risk.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#536057]">
              BookCompass is being built as a product-grade SaaS platform:
              explainable recommendations first, AI/ML extension points later.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {signals.map((signal) => (
                <span
                  className="rounded-md border border-[#cfc5b6] bg-white px-3 py-2 text-sm font-medium text-[#39443f]"
                  key={signal}
                >
                  {signal}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#d9d2c5] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-[#eee7dc] pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a6b36]">
                  Platform modules
                </p>
                <h3 className="mt-1 text-2xl font-semibold">Month-one build</h3>
              </div>
              <SlidersHorizontal className="text-[#62736a]" size={22} />
            </div>
            <div className="grid gap-3">
              {modules.map((module) => {
                const Icon = module.icon

                return (
                  <article
                    className="flex items-center justify-between rounded-md border border-[#eee7dc] p-4"
                    key={module.label}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-md bg-[#edf3ef] text-[#2b604c]">
                        <Icon size={19} />
                      </div>
                      <p className="font-semibold">{module.label}</p>
                    </div>
                    <span className="rounded-md bg-[#f3efe7] px-2.5 py-1 text-xs font-semibold text-[#6f5f46]">
                      {module.status}
                    </span>
                  </article>
                )
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default App
