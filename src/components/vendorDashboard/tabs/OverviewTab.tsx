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
  onNavigate: (tab: VendorDashboardTab) => void
}

function OverviewTab({ vendorName, metrics, onNavigate }: OverviewTabProps) {
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
    </section>
  )
}

export default OverviewTab
