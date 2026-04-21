import type { TechnicianDashboardTab } from '../types'

type OverviewTabProps = {
  technicianName: string
  metrics: {
    totalTasks: number
    activeTasks: number
    closurePending: number
    firstTimeFix: number
    proofCompliance: number
  }
  snapshot: {
    dueToday: number
    delayed: number
    resolvedToday: number
    checklistPending: number
    materialMismatch: number
    unreadNotifications: number
    recentEvents: Array<{
      title: string
      meta: string
    }>
  }
  onNavigate: (tab: TechnicianDashboardTab) => void
}

function OverviewTab({ technicianName, metrics, snapshot, onNavigate }: OverviewTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
          Technician Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[rgb(var(--color-text-primary))] md:text-3xl">Welcome, {technicianName}</h1>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))] md:text-base">
          Accept jobs, update milestones, capture proof, and submit closure requests with complete field compliance.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Total Tasks</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-text-primary))]">{metrics.totalTasks}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Active Queue</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.activeTasks}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Closure Pending</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">{metrics.closurePending}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">First-Time Fix</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{metrics.firstTimeFix}%</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[linear-gradient(145deg,rgb(var(--color-primary)/0.13),rgb(var(--color-card)/0.95))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Proof Compliance</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.proofCompliance}%</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate('tasks')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Daily Task Queue</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Priority-tagged jobs with quick acceptance and dispatch actions.</p>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('proof')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Proof Capture Unit</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Before/after and completion note checks before final submit.</p>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('materials')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Material Usage</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Link consumed material to complaint IDs and verify stock usage.</p>
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Execution Pulse</h3>
            <span className="rounded-full bg-[rgb(var(--color-primary))/0.12] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--color-primary))]">
              Live
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Due Today</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{snapshot.dueToday}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Delayed Jobs</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-danger))]">{snapshot.delayed}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Resolved Today</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-success))]">{snapshot.resolvedToday}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Checklist Pending</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-warning))]">{snapshot.checklistPending}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[rgb(var(--color-text-secondary))]">Proof Compliance</span>
                <span className="font-semibold text-[rgb(var(--color-primary))]">{metrics.proofCompliance}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
                <div className="h-2 rounded-full bg-[rgb(var(--color-primary))]" style={{ width: `${metrics.proofCompliance}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[rgb(var(--color-text-secondary))]">First-Time-Fix Health</span>
                <span className="font-semibold text-[rgb(var(--color-success))]">{metrics.firstTimeFix}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
                <div className="h-2 rounded-full bg-[rgb(var(--color-success))]" style={{ width: `${metrics.firstTimeFix}%` }} />
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Compliance Watch</h3>
          <div className="mt-3 grid gap-2">
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Material Mismatch</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-warning))]">{snapshot.materialMismatch}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Unread Alerts</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-primary))]">{snapshot.unreadNotifications}</p>
            </div>
          </div>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Recent Execution Events</h3>
          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2.5 py-1.5 text-xs font-semibold"
          >
            View all alerts
          </button>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.recentEvents.map((event) => (
            <div key={`${event.title}-${event.meta}`} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{event.title}</p>
              <p className="mt-1 text-[11px] text-[rgb(var(--color-text-secondary))]">{event.meta}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default OverviewTab
