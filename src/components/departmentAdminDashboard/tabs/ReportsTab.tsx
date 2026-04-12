type ReportsTabProps = {
  kpis: {
    monthlyResolutionRate: number
    avgTurnaroundHours: number
    recurringIssueRate: number
    customerSatisfaction: number
  }
  topIssues: Array<{ label: string; count: number }>
  onExport: (format: 'pdf' | 'csv') => void
}

function ReportsTab({ kpis, topIssues, onExport }: ReportsTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Department Performance Reports</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Monthly trends, turnaround analysis, and issue concentration insights.
        </p>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onExport('pdf')}
            className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-1.5 text-xs font-semibold text-white"
          >
            Export PDF
          </button>
          <button
            type="button"
            onClick={() => onExport('csv')}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-1.5 text-xs font-semibold"
          >
            Export CSV
          </button>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Resolution Rate</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{kpis.monthlyResolutionRate}%</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Avg TAT</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{kpis.avgTurnaroundHours}h</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Recurring Issues</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">{kpis.recurringIssueRate}%</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Satisfaction</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-accent))]">{kpis.customerSatisfaction}/5</p>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Top Recurring Issue Clusters</h3>
        <div className="mt-3 space-y-2.5">
          {topIssues.map((item) => (
            <div key={item.label} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{item.label}</p>
                <span className="rounded-full bg-[rgb(var(--color-primary))/0.15] px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--color-primary))]">
                  {item.count} tickets
                </span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default ReportsTab
