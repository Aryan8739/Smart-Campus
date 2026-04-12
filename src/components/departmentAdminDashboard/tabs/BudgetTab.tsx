import type { DepartmentBudgetRecord } from '../types'

type BudgetTabProps = {
  records: DepartmentBudgetRecord[]
  onRaiseAlert: (recordId: string) => void
}

function BudgetTab({ records, onRaiseAlert }: BudgetTabProps) {
  const totalAllocated = records.reduce((sum, item) => sum + item.allocated, 0)
  const totalUtilized = records.reduce((sum, item) => sum + item.utilized, 0)
  const utilization = totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Budget Oversight</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Monthly operating allocation, utilization, and overrun prevention actions.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Allocated</p>
          <p className="mt-1 text-2xl font-bold">Rs. {totalAllocated.toLocaleString('en-IN')}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Utilized</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">Rs. {totalUtilized.toLocaleString('en-IN')}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Utilization</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{utilization}%</p>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Budget Lines</h3>
        <div className="mt-3 space-y-2.5">
          {records.map((item) => {
            const itemUtilization = item.allocated > 0 ? Math.round((item.utilized / item.allocated) * 100) : 0
            const nearLimit = itemUtilization >= 85

            return (
              <div key={item.id} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{item.bucket}</p>
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      nearLimit
                        ? 'bg-[rgb(var(--color-danger))/0.14] text-[rgb(var(--color-danger))]'
                        : 'bg-[rgb(var(--color-success))/0.14] text-[rgb(var(--color-success))]',
                    ].join(' ')}
                  >
                    {itemUtilization}% used
                  </span>
                </div>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                  {item.month} | Allocated Rs. {item.allocated.toLocaleString('en-IN')} | Utilized Rs. {item.utilized.toLocaleString('en-IN')}
                </p>
                {nearLimit ? (
                  <button
                    type="button"
                    onClick={() => onRaiseAlert(item.id)}
                    className="mt-2 rounded-md border border-[rgb(var(--color-danger))/0.4] bg-[rgb(var(--color-danger))/0.08] px-2 py-1 text-[11px] font-semibold text-[rgb(var(--color-danger))]"
                  >
                    Raise Budget Alert
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>
      </article>
    </section>
  )
}

export default BudgetTab
