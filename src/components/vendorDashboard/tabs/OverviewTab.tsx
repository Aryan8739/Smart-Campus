import type { VendorDashboardTab } from '../types'

type OverviewTabProps = {
  vendorName: string
  metrics: {
    totalTickets: number
    assignedTickets: number
    highRisk: number
    avgSla: number
    firstTimeFix: number
  }
  snapshot: {
    unassigned: number
    escalated: number
    resolved: number
    activeTechnicians: number
    averageWorkload: number
    unreadNotifications: number
    draftInvoices: number
    approvedInvoices: number
    approvedValue: number
    recentEvents: Array<{
      title: string
      meta: string
    }>
  }
  onNavigate: (tab: VendorDashboardTab) => void
}

function OverviewTab({ vendorName, metrics, snapshot, onNavigate }: OverviewTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <p className="inline-flex rounded-full border border-[rgb(var(--color-primary))/0.25] bg-[rgb(var(--color-primary))/0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
          Vendor Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[rgb(var(--color-text-primary))] md:text-3xl">{vendorName}</h1>
        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))] md:text-base">
          Monitor assignments, team utilization, SLA compliance, and settlement pipeline from one workspace.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Total Tickets</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-text-primary))]">{metrics.totalTickets}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Assigned</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.assignedTickets}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">High Risk SLA</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-danger))]">{metrics.highRisk}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Avg SLA Score</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{metrics.avgSla}%</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[linear-gradient(145deg,rgb(var(--color-primary)/0.13),rgb(var(--color-card)/0.95))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">First Time Fix</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{metrics.firstTimeFix}%</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate('assignments')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Assignment Desk</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Assign or reassign complaints with skill-aware routing.</p>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('sla')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">SLA Monitor</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Track pre-breach windows and escalation triggers.</p>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('settlements')}
          className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 text-left transition hover:border-[rgb(var(--color-primary))/0.5] hover:bg-[rgb(var(--color-primary))/0.08]"
        >
          <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Settlements</p>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Manage invoices, approvals, and payout readiness.</p>
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Operational Pulse</h3>
            <span className="rounded-full bg-[rgb(var(--color-primary))/0.12] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--color-primary))]">
              Live
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Unassigned Queue</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-danger))]">{snapshot.unassigned}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Escalated Cases</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-warning))]">{snapshot.escalated}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Resolved Tickets</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-success))]">{snapshot.resolved}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Unread Alerts</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-primary))]">{snapshot.unreadNotifications}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[rgb(var(--color-text-secondary))]">SLA Control Index</span>
                <span className="font-semibold text-[rgb(var(--color-success))]">{metrics.avgSla}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
                <div className="h-2 rounded-full bg-[rgb(var(--color-success))]" style={{ width: `${metrics.avgSla}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[rgb(var(--color-text-secondary))]">First-Time-Fix Health</span>
                <span className="font-semibold text-[rgb(var(--color-primary))]">{metrics.firstTimeFix}%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-[rgb(var(--color-border))]">
                <div className="h-2 rounded-full bg-[rgb(var(--color-primary))]" style={{ width: `${metrics.firstTimeFix}%` }} />
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Workforce & Settlement Snapshot</h3>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Active Technicians</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{snapshot.activeTechnicians}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Avg Workload</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{snapshot.averageWorkload}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Draft Invoices</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-danger))]">{snapshot.draftInvoices}</p>
            </div>
            <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <p className="text-[11px] uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Approved Invoices</p>
              <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-success))]">{snapshot.approvedInvoices}</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-[rgb(var(--color-border))] bg-[linear-gradient(140deg,rgb(var(--color-primary)/0.08),rgb(var(--color-accent)/0.08))] p-3">
            <p className="text-xs text-[rgb(var(--color-text-secondary))]">Approved Settlement Value</p>
            <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">Rs. {snapshot.approvedValue.toLocaleString('en-IN')}</p>
          </div>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Recent Operational Events</h3>
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
