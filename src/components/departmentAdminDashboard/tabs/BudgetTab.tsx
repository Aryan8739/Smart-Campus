import { useMemo, useState } from 'react'
import type { DepartmentBudgetRecord } from '../types'

type BudgetTabProps = {
  records: DepartmentBudgetRecord[]
  message: string
  onRaiseAlert: (recordId: string) => void
}

function BudgetTab({ records, message, onRaiseAlert }: BudgetTabProps) {
  const [monthFilter, setMonthFilter] = useState('All')

  const months = useMemo(() => ['All', ...new Set(records.map((item) => item.month))], [records])
  const filteredRecords = useMemo(
    () => (monthFilter === 'All' ? records : records.filter((item) => item.month === monthFilter)),
    [monthFilter, records],
  )

  const totalAllocated = filteredRecords.reduce((sum, item) => sum + item.allocated, 0)
  const totalUtilized = filteredRecords.reduce((sum, item) => sum + item.utilized, 0)
  const utilization = totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Budget Oversight</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Monthly operating allocation, utilization, and overrun prevention actions.
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="text-[rgb(var(--color-text-secondary))]">Month</span>
          <select
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-1"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
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
        {message ? (
          <p className="mt-3 rounded-xl border border-[rgb(var(--color-warning))/0.35] bg-[rgb(var(--color-warning))/0.08] p-3 text-xs font-semibold text-[rgb(var(--color-warning))]">
            {message}
          </p>
        ) : null}

        <div className="mt-3 space-y-2.5">
          {filteredRecords.map((item) => {
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

                <div className="mt-2 h-2 w-full rounded-full bg-[rgb(var(--color-border))]">
                  <div
                    className={[
                      'h-full rounded-full',
                      nearLimit ? 'bg-[rgb(var(--color-danger))]' : 'bg-[rgb(var(--color-success))]',
                    ].join(' ')}
                    style={{ width: `${Math.min(100, itemUtilization)}%` }}
                  />
                </div>

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

          {filteredRecords.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
              No budget line found for selected month.
            </p>
          ) : null}
        </div>
      </article>
    </section>
  )
}

export default BudgetTab
