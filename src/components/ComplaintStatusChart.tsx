import { useMemo } from 'react'
import { useAdminModule } from '../features/userAccess/hooks/useAdminModule'
import type { ComplaintLifecycleStatus } from '../features/userAccess/types'

const statusOrder: ComplaintLifecycleStatus[] = ['New', 'In Review', 'Assigned', 'Resolved', 'Escalated']
const segmentColors: Record<ComplaintLifecycleStatus, string> = {
  New: '#3b82f6',
  'In Review': '#f59e0b',
  Assigned: '#8b5cf6',
  Resolved: '#10b981',
  Escalated: '#ef4444',
}

function ComplaintStatusChart() {
  const { complaintsInScope, complaints, filters, complaintStatusCounts } = useAdminModule()
  const totalCount = complaintsInScope.length
  const filteredCount = complaints.length
  const segments = useMemo(
    () =>
      statusOrder
        .map((status) => ({
          status,
          value: complaintStatusCounts[status],
          color: segmentColors[status],
        }))
        .filter((segment) => segment.value > 0),
    [complaintStatusCounts]
  )
  let cumulative = 0
  const radius = 82
  const circumference = 2 * Math.PI * radius

  return (
    <div className="grid items-start gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative flex h-[220px] w-[220px] items-center justify-center sm:h-[250px] sm:w-[250px] xl:h-[270px] xl:w-[270px]">
          <svg viewBox="0 0 270 270" className="h-full w-full -rotate-90">
            <circle cx="135" cy="135" r={radius} fill="transparent" stroke="rgba(148,163,184,0.18)" strokeWidth="40" />
            {segments.map((segment, index) => {
              const dash = (segment.value / 100) * circumference
              const offset = circumference - (cumulative / 100) * circumference
              cumulative += segment.value
              return (
                <circle
                  key={index}
                  cx="135"
                  cy="135"
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth="40"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={offset}
                  strokeLinecap="butt"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
            <div className="flex h-[118px] flex-col items-center justify-between">
              <p className="mt-2 max-w-[104px] text-center text-[10px] font-medium uppercase leading-4 tracking-[0.18em] text-[var(--text-secondary)]">
                Status Mix
              </p>
              <p className="text-[2.45rem] font-semibold leading-none tracking-[-0.04em] text-[var(--text-primary)]">
                {filteredCount}
              </p>
              <p className="-mt-1 max-w-[105px] text-center text-[10px] leading-4 text-[var(--text-secondary)]">
                {filters.complaintStatus === 'All' ? 'Complaints in current scope' : `${filters.complaintStatus} complaints`}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 grid w-full max-w-[320px] grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
          {statusOrder.map((status) => (
            <span
              key={status}
              className="flex min-h-[42px] items-center justify-center rounded-2xl px-3 py-2 text-center text-[13px] font-medium leading-5"
              style={{
                backgroundColor: `${segmentColors[status]}20`,
                color: segmentColors[status],
                outline: filters.complaintStatus === status ? `1px solid ${segmentColors[status]}` : 'none',
              }}
            >
              {status} ({complaintStatusCounts[status]})
            </span>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-6 py-6 shadow-sm">
        <div className="mb-7 flex items-center justify-between text-sm">
          <span className="font-semibold text-[var(--text-primary)]">Status Coverage</span>
          <span className="text-[var(--text-secondary)]">{filteredCount} of {totalCount} visible</span>
        </div>
        <div className="space-y-4">
          {statusOrder.map((status) => {
            const count = complaintStatusCounts[status]
            const width = totalCount === 0 ? 0 : (count / totalCount) * 100
            const isActive = filters.complaintStatus === status
            return (
              <div key={status}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-[var(--text-primary)]">{status}</span>
                  <span className="text-[var(--text-secondary)]">{count}</span>
                </div>
                <div className="h-3 rounded-full bg-[var(--border-color)]/60">
                  <div
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${width}%`,
                      backgroundColor: segmentColors[status],
                      boxShadow: isActive ? `0 0 0 2px ${segmentColors[status]}33` : 'none',
                      opacity: filters.complaintStatus === 'All' || isActive ? 1 : 0.55,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ComplaintStatusChart
