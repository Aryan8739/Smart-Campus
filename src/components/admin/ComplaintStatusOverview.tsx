import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import type { ComplaintLifecycleStatus } from '../../features/userAccess/types'

const statusOrder: ComplaintLifecycleStatus[] = ['New', 'In Review', 'Assigned', 'Resolved', 'Escalated']

const statusStyles: Record<ComplaintLifecycleStatus, { base: string; soft: string; strong: string; dot: string }> = {
  New: {
    base: '#2563eb',
    soft: 'rgba(37, 99, 235, 0.12)',
    strong: 'rgba(37, 99, 235, 0.22)',
    dot: '#2563eb',
  },
  'In Review': {
    base: '#d97706',
    soft: 'rgba(217, 119, 6, 0.12)',
    strong: 'rgba(217, 119, 6, 0.22)',
    dot: '#f59e0b',
  },
  Assigned: {
    base: '#7c3aed',
    soft: 'rgba(124, 58, 237, 0.12)',
    strong: 'rgba(124, 58, 237, 0.22)',
    dot: '#8b5cf6',
  },
  Resolved: {
    base: '#059669',
    soft: 'rgba(5, 150, 105, 0.12)',
    strong: 'rgba(5, 150, 105, 0.22)',
    dot: '#10b981',
  },
  Escalated: {
    base: '#dc2626',
    soft: 'rgba(220, 38, 38, 0.12)',
    strong: 'rgba(220, 38, 38, 0.22)',
    dot: '#f43f5e',
  },
}

function ComplaintStatusOverview() {
  const { filters, setFilters, complaintStatusCounts, complaintsInScope } = useAdminModule()

  return (
    <section className="rounded-[1.5rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.24)]">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">Complaint Status Overview</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Quick lifecycle filter for complaint monitoring across the admin dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[var(--text-secondary)]">
            {complaintsInScope.length} complaints in scope
          </span>
          {filters.complaintStatus !== 'All' ? (
            <button
              type="button"
              onClick={() => setFilters((previous) => ({ ...previous, complaintStatus: 'All' }))}
              className="rounded-full border border-[var(--border-color)] px-3 py-1.5 text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]"
            >
              Clear filter
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        {statusOrder.map((status) => {
          const isActive = filters.complaintStatus === status
          const count = complaintStatusCounts[status]
          const palette = statusStyles[status]
          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilters((previous) => ({
                ...previous,
                complaintStatus: previous.complaintStatus === status ? 'All' : status,
              }))}
              className={[
                'inline-flex min-w-0 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-150 hover:-translate-y-0.5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card-bg)]',
                isActive ? 'scale-[1.01] shadow-[0_12px_24px_-18px_rgba(15,23,42,0.65)]' : '',
              ].join(' ')}
              style={{
                color: palette.base,
                backgroundColor: isActive ? palette.strong : palette.soft,
                borderColor: isActive ? palette.base : `${palette.base}55`,
                boxShadow: isActive ? `0 0 0 2px ${palette.base}22` : 'none',
              }}
              aria-pressed={isActive}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: palette.dot }} />
              <span>{status} ({count})</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default ComplaintStatusOverview
