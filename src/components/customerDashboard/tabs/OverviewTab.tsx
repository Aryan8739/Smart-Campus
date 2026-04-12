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
    </section>
  )
}

export default OverviewTab
