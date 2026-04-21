import type { TechnicianTask } from '../types'

type InsightsTabProps = {
  tasks: TechnicianTask[]
  firstTimeFix: number
  avgResolutionHours: number
  qualityScore: number
}

function InsightsTab({ tasks, firstTimeFix, avgResolutionHours, qualityScore }: InsightsTabProps) {
  const resolved = tasks.filter((task) => task.status === 'Resolved').length
  const backlog = tasks.filter((task) => task.status !== 'Resolved').length
  const delayed = tasks.filter((task) => task.status === 'Delayed').length

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Insights & Reports</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Individual resolution performance, backlog trend, and quality score visibility.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">First-Time Fix</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{firstTimeFix}%</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Avg Resolution Time</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{avgResolutionHours}h</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Quality Score</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">{qualityScore}/100</p>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Job Completion vs Backlog</h3>
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[rgb(var(--color-text-secondary))]">Resolved Jobs</span>
              <span className="font-semibold text-[rgb(var(--color-success))]">{resolved}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
              <div
                className="h-2 rounded-full bg-[rgb(var(--color-success))]"
                style={{ width: `${tasks.length ? (resolved / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[rgb(var(--color-text-secondary))]">Backlog</span>
              <span className="font-semibold text-[rgb(var(--color-warning))]">{backlog}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
              <div
                className="h-2 rounded-full bg-[rgb(var(--color-warning))]"
                style={{ width: `${tasks.length ? (backlog / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[rgb(var(--color-text-secondary))]">Delayed Cases</span>
              <span className="font-semibold text-[rgb(var(--color-danger))]">{delayed}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
              <div
                className="h-2 rounded-full bg-[rgb(var(--color-danger))]"
                style={{ width: `${tasks.length ? (delayed / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}

export default InsightsTab
