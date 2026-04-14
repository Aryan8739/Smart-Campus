import type { DepartmentAdminTab } from '../types'

type OverviewTabProps = {
  departmentName: string
  metrics: {
    totalTickets: number
    openTickets: number
    atRisk: number
    activeTeams: number
    avgClosureRate: number
  }
  snapshot: {
    pendingAssignments: number
    escalated: number
    resolvedToday: number
    budgetUtilization: number
    unreadAlerts: number
    recentEvents: Array<{ title: string; meta: string }>
  }
  onNavigate: (tab: DepartmentAdminTab) => void
}

function OverviewTab({ departmentName, metrics, snapshot, onNavigate }: OverviewTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">Department Admin Dashboard</p>
        <h2 className="mt-2 text-2xl font-semibold text-[rgb(var(--color-text-primary))]">{departmentName} Control Center</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Live complaint operations, resource alignment, and SLA governance in one place.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-5">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Total Tickets</p>
          <p className="mt-1 text-2xl font-bold">{metrics.totalTickets}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Open Queue</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">{metrics.openTickets}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">SLA Risk</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-danger))]">{metrics.atRisk}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Active Teams</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.activeTeams}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Closure Rate</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{metrics.avgClosureRate}%</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Operational Snapshot</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs">
              Pending assignments: <span className="font-semibold">{snapshot.pendingAssignments}</span>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs">
              Escalated tickets: <span className="font-semibold">{snapshot.escalated}</span>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs">
              Resolved today: <span className="font-semibold">{snapshot.resolvedToday}</span>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs">
              Budget utilized: <span className="font-semibold">{snapshot.budgetUtilization}%</span>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs sm:col-span-2">
              Unread alerts: <span className="font-semibold">{snapshot.unreadAlerts}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onNavigate('intake')}
              className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white"
            >
              Manage Intake Queue
            </button>
            <button
              type="button"
              onClick={() => onNavigate('sla')}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs font-semibold"
            >
              Open SLA Desk
            </button>
            <button
              type="button"
              onClick={() => onNavigate('budget')}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs font-semibold"
            >
              Review Budget
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Recent Events</h3>
          <div className="mt-3 space-y-2.5">
            {snapshot.recentEvents.map((item) => (
              <div key={`${item.title}-${item.meta}`} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
                <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</p>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{item.meta}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default OverviewTab
