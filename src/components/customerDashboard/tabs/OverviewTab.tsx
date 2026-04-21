import type { CustomerDashboardTab } from '../types'

type OverviewTabProps = {
  userName: string
  metrics: {
    total: number
    open: number
    inProgress: number
    resolved: number
    responseScore: number
  }
  onNavigate: (tab: CustomerDashboardTab) => void
}

function OverviewTab({ userName, metrics, onNavigate }: OverviewTabProps) {
  const resolutionRate = metrics.total > 0 ? Math.round((metrics.resolved / metrics.total) * 100) : 0
  const activeLoad = metrics.total > 0 ? Math.round((metrics.inProgress / metrics.total) * 100) : 0

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
          Dashboard Overview
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[rgb(var(--color-text-primary))] md:text-3xl">
          Welcome back, {userName}
        </h1>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))] md:text-base">
          Keep campus services smooth with faster reporting, transparent tracking, and quality feedback.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Total Complaints</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-text-primary))]">{metrics.total}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Open/Reopened</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-danger))]">{metrics.open}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.inProgress}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Resolved</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{metrics.resolved}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[linear-gradient(145deg,rgb(var(--color-primary)/0.13),rgb(var(--color-card)/0.95))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Response Score</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.responseScore}%</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate('raise')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Create New Complaint</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Use smart intake form with category, location, and priority.</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('tracker')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Track Complaints</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Filter and monitor lifecycle updates with status badges.</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('workspace')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Open Workspace</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Manage evidence, timeline, feedback, and reopen requests.</p>
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Service Health Snapshot</h3>
            <span className="rounded-full bg-[rgb(var(--color-primary))/0.12] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--color-primary))]">
              Live
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[rgb(var(--color-text-secondary))]">Resolution Rate</span>
                <span className="font-semibold text-[rgb(var(--color-success))]">{resolutionRate}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
                <div
                  className="h-2 rounded-full bg-[rgb(var(--color-success))]"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[rgb(var(--color-text-secondary))]">Active Workload</span>
                <span className="font-semibold text-[rgb(var(--color-primary))]">{activeLoad}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
                <div
                  className="h-2 rounded-full bg-[rgb(var(--color-primary))]"
                  style={{ width: `${activeLoad}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[rgb(var(--color-text-secondary))]">Feedback Completion</span>
                <span className="font-semibold text-[rgb(var(--color-accent))]">84%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
                <div className="h-2 w-[84%] rounded-full bg-[rgb(var(--color-accent))]" />
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Recent Activity</h3>
          <ul className="mt-3 space-y-2.5">
            <li className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2">
              <p className="text-xs font-medium text-[rgb(var(--color-text-primary))]">Complaint CMP-2026-301 updated by technician</p>
              <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-secondary))]">Today, 8:20 AM</p>
            </li>
            <li className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2">
              <p className="text-xs font-medium text-[rgb(var(--color-text-primary))]">SLA warning triggered for CMP-2026-254</p>
              <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-secondary))]">Today, 8:00 AM</p>
            </li>
            <li className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2">
              <p className="text-xs font-medium text-[rgb(var(--color-text-primary))]">Feedback pending reminder sent</p>
              <p className="mt-0.5 text-[11px] text-[rgb(var(--color-text-secondary))]">Yesterday, 6:40 PM</p>
            </li>
          </ul>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[linear-gradient(130deg,rgb(var(--color-primary)/0.1),rgb(var(--color-accent)/0.1))] p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-[rgb(var(--color-text-primary))]">Smart Recommendations</h3>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
              Best next actions based on current complaint load and SLA signals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
          >
            View Alerts
          </button>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))/0.8] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            High-priority IT complaint is open. Consider adding evidence for faster routing.
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))/0.8] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            One invoice is near due date. Review billing tab to avoid payment delay.
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))/0.8] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Submit feedback on resolved cases to improve service quality score.
          </div>
        </div>
      </article>

      <div className="rounded-3xl border border-[rgb(var(--color-border))] bg-gradient-to-br from-[rgb(var(--color-primary))/0.05] to-transparent p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[rgb(var(--color-text-secondary))]">
          Key Performance Indicators (Project KPIs)
        </h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-[rgb(var(--color-primary))]">98.2%</p>
            <p className="text-[10px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">File Upload Success</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[rgb(var(--color-accent))]">84%</p>
            <p className="text-[10px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Filter Usage Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[rgb(var(--color-success))]">94%</p>
            <p className="text-[10px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Resolution Completion</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[rgb(var(--color-warning))]">95.4%</p>
            <p className="text-[10px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Mobile Interaction</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OverviewTab
