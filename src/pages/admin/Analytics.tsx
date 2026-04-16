import { useMemo } from 'react'
import DataPanel from '../../components/common/DataPanel'
import KpiCard from '../../components/common/KpiCard'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import type { ComplaintRecord } from '../../features/userAccess/types'

type ComplaintWithDate = ComplaintRecord & { parsedDate: Date | null }

const statusColors: Record<ComplaintRecord['status'], string> = {
  New: '#3b82f6',
  'In Review': '#f59e0b',
  Assigned: '#6366f1',
  Resolved: '#10b981',
  Escalated: '#ef4444',
}

const rangeDaysByFilter = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
} as const

function parseComplaintDate(value: string) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function dayDiff(from: Date, to: Date) {
  return Math.floor((from.getTime() - to.getTime()) / 86400000)
}

function withinSla(complaint: ComplaintRecord) {
  if (complaint.status === 'Resolved') return true
  if (complaint.status === 'Escalated') return false
  if (complaint.status === 'Assigned') return complaint.priority !== 'High'
  if (complaint.status === 'In Review') return complaint.priority === 'Low'
  return false
}

function formatBucketLabel(referenceDate: Date, offsetDays: number) {
  const date = new Date(referenceDate)
  date.setDate(referenceDate.getDate() - offsetDays)
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(date)
}

function Analytics() {
  const { complaints, users, vendors, technicians, sessions, filters } = useAdminModule()

  const rangeDays = rangeDaysByFilter[filters.dateRange]
  const complaintsWithDate = useMemo<ComplaintWithDate[]>(
    () => complaints.map((complaint) => ({ ...complaint, parsedDate: parseComplaintDate(complaint.createdDate) })),
    [complaints]
  )

  const referenceDate = useMemo(() => {
    const dates = complaintsWithDate
      .map((complaint) => complaint.parsedDate)
      .filter((value): value is Date => value instanceof Date)
    if (!dates.length) {
      return new Date()
    }
    return new Date(Math.max(...dates.map((date) => date.getTime())))
  }, [complaintsWithDate])

  const complaintsInRange = useMemo(
    () => complaintsWithDate.filter((complaint) => (
      complaint.parsedDate ? dayDiff(referenceDate, complaint.parsedDate) < rangeDays : false
    )),
    [complaintsWithDate, referenceDate, rangeDays]
  )

  const trendBuckets = useMemo(() => {
    const bucketCount = rangeDays === 90 ? 9 : rangeDays === 30 ? 8 : 7
    const bucketSize = Math.max(1, Math.ceil(rangeDays / bucketCount))

    return Array.from({ length: bucketCount }, (_, index) => {
      const startOffset = (bucketCount - index - 1) * bucketSize
      const endOffset = startOffset + bucketSize - 1
      const bucketComplaints = complaintsInRange.filter((complaint) => {
        if (!complaint.parsedDate) return false
        const diff = dayDiff(referenceDate, complaint.parsedDate)
        return diff >= startOffset && diff <= endOffset
      })

      const compliant = bucketComplaints.filter(withinSla).length
      const compliance = bucketComplaints.length ? Math.round((compliant / bucketComplaints.length) * 100) : 0

      return {
        label: formatBucketLabel(referenceDate, startOffset),
        count: bucketComplaints.length,
        compliance,
      }
    })
  }, [complaintsInRange, rangeDays, referenceDate])

  const complaintTrendValues = trendBuckets.map((bucket) => bucket.count)
  const slaTrendValues = trendBuckets.map((bucket) => bucket.compliance)

  const statusDistribution = useMemo(() => {
    const counts: Record<ComplaintRecord['status'], number> = {
      New: 0,
      'In Review': 0,
      Assigned: 0,
      Resolved: 0,
      Escalated: 0,
    }
    complaintsInRange.forEach((complaint) => {
      counts[complaint.status] += 1
    })
    return counts
  }, [complaintsInRange])

  const vendorPerformance = useMemo(
    () => vendors.map((vendor) => {
      const tasksHandled = complaintsInRange.filter((complaint) => complaint.vendor === vendor.name).length
      const rating = Number((Math.max(3.1, Math.min(5, vendor.slaScore / 20))).toFixed(1))
      const score = Math.round(vendor.slaScore * 0.7 + Math.min(tasksHandled * 10, 100) * 0.3)

      return {
        ...vendor,
        tasksHandled,
        rating,
        score,
      }
    }),
    [complaintsInRange, vendors]
  )

  const technicianPerformance = useMemo(
    () => technicians.map((technician) => {
      const complaintLoad = complaintsInRange.filter((complaint) => complaint.technician === technician.name).length
      const tasksCompleted = Math.round(complaintLoad * (technician.completionRate / 100))
      const avgResolutionHours = Number((Math.max(8, 46 - technician.completionRate * 0.24 + complaintLoad * 1.1)).toFixed(1))
      const performanceScore = Math.round(technician.completionRate * 0.65 + Math.max(0, 35 - avgResolutionHours) * 0.35)

      return {
        ...technician,
        complaintLoad,
        tasksCompleted,
        avgResolutionHours,
        performanceScore,
      }
    }),
    [complaintsInRange, technicians]
  )

  const securityMetrics = useMemo(() => {
    const failedLoginAttempts = users.reduce((sum, user) => sum + user.failedLoginsToday, 0)
    const unauthorizedAttempts = users.reduce((sum, user) => sum + Math.max(0, user.loginAttempts - 1), 0)
      + complaintsInRange.filter((complaint) => complaint.status === 'Escalated').length * 2
    const highRiskSessions = sessions.filter((session) => session.risk === 'High').length

    return {
      failedLoginAttempts,
      unauthorizedAttempts,
      highRiskSessions,
    }
  }, [complaintsInRange, sessions, users])

  const trendInsight = useMemo(() => {
    const splitIndex = Math.floor(trendBuckets.length / 2)
    const firstHalf = trendBuckets.slice(0, splitIndex).reduce((sum, bucket) => sum + bucket.count, 0)
    const secondHalf = trendBuckets.slice(splitIndex).reduce((sum, bucket) => sum + bucket.count, 0)
    const change = secondHalf - firstHalf
    const changePercent = firstHalf ? Math.round((change / firstHalf) * 100) : secondHalf ? 100 : 0

    return {
      direction: change >= 0 ? 'increased' : 'decreased',
      changePercent: Math.abs(changePercent),
    }
  }, [trendBuckets])

  const lowPerformingVendor = useMemo(() => {
    const ranked = vendorPerformance
      .filter((vendor) => vendor.tasksHandled > 0)
      .sort((left, right) => left.score - right.score)
    return ranked[0] ?? null
  }, [vendorPerformance])

  const overloadedTechnicians = useMemo(
    () => technicianPerformance.filter((technician) => technician.complaintLoad >= 3 || technician.avgResolutionHours > 24),
    [technicianPerformance]
  )

  const totalInRange = complaintsInRange.length
  const resolvedInRange = complaintsInRange.filter((complaint) => complaint.status === 'Resolved').length
  const averageSlaCompliance = totalInRange
    ? Math.round((complaintsInRange.filter(withinSla).length / totalInRange) * 100)
    : 0

  const trendMax = Math.max(...complaintTrendValues, 1)
  const trendPoints = complaintTrendValues.map((value, index) => {
    const x = 52 + (index * 420) / Math.max(1, complaintTrendValues.length - 1)
    const y = 190 - (value / trendMax) * 140
    return `${x},${y}`
  }).join(' ')

  const slaPoints = slaTrendValues.map((value, index) => {
    const x = 52 + (index * 420) / Math.max(1, slaTrendValues.length - 1)
    const y = 190 - (value / 100) * 140
    return `${x},${y}`
  }).join(' ')

  let donutProgress = 0
  const donutRadius = 72
  const donutCircumference = 2 * Math.PI * donutRadius
  const statusEntries = (Object.keys(statusDistribution) as ComplaintRecord['status'][])
    .map((status) => ({ status, value: statusDistribution[status], color: statusColors[status] }))
    .filter((entry) => entry.value > 0)

  return (
    <div className="space-y-6">
      <section className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        <KpiCard title="Complaints In Range" value={totalInRange} subtitle={`Date range: ${filters.dateRange}`} />
        <KpiCard title="Resolved Complaints" value={resolvedInRange} subtitle="Closed within filtered scope" />
        <KpiCard title="SLA Compliance" value={`${averageSlaCompliance}%`} subtitle="Within SLA in selected range" />
        <KpiCard title="Failed Login Attempts" value={securityMetrics.failedLoginAttempts} subtitle={`Campus: ${filters.campus}`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DataPanel title="Complaint Trend (Line)">
          <svg viewBox="0 0 520 240" className="h-[250px] w-full">
            {[0, 1, 2, 3, 4].map((line) => (
              <line
                key={line}
                x1="52"
                x2="472"
                y1={50 + line * 35}
                y2={50 + line * 35}
                stroke="rgba(148,163,184,0.22)"
              />
            ))}
            <polyline fill="none" stroke="rgb(var(--color-primary))" strokeWidth="3" points={trendPoints} />
            {complaintTrendValues.map((value, index) => {
              const x = 52 + (index * 420) / Math.max(1, complaintTrendValues.length - 1)
              const y = 190 - (value / trendMax) * 140
              return <circle key={`${index}-${value}`} cx={x} cy={y} r="4.2" fill="rgb(var(--color-primary))" />
            })}
            {trendBuckets.map((bucket, index) => {
              const x = 52 + (index * 420) / Math.max(1, trendBuckets.length - 1)
              return (
                <text
                  key={bucket.label}
                  x={x}
                  y="224"
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-secondary)"
                >
                  {bucket.label}
                </text>
              )
            })}
          </svg>
        </DataPanel>

        <DataPanel title="Status Distribution (Donut)">
          <div className="grid items-center gap-5 sm:grid-cols-[220px_1fr]">
            <div className="relative mx-auto h-[200px] w-[200px]">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                <circle cx="100" cy="100" r={donutRadius} fill="transparent" stroke="rgba(148,163,184,0.2)" strokeWidth="28" />
                {statusEntries.map((entry) => {
                  const share = totalInRange ? entry.value / totalInRange : 0
                  const dash = share * donutCircumference
                  const offset = donutCircumference - donutProgress * donutCircumference
                  donutProgress += share

                  return (
                    <circle
                      key={entry.status}
                      cx="100"
                      cy="100"
                      r={donutRadius}
                      fill="transparent"
                      stroke={entry.color}
                      strokeWidth="28"
                      strokeDasharray={`${dash} ${donutCircumference - dash}`}
                      strokeDashoffset={offset}
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]">Complaints</p>
                <p className="text-3xl font-semibold text-[var(--text-primary)]">{totalInRange}</p>
              </div>
            </div>
            <div className="space-y-3">
              {(Object.keys(statusDistribution) as ComplaintRecord['status'][]).map((status) => (
                <div key={status} className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-sm">
                  <span className="inline-flex items-center gap-2 text-[var(--text-primary)]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[status] }} />
                    {status}
                  </span>
                  <span className="font-semibold text-[var(--text-secondary)]">{statusDistribution[status]}</span>
                </div>
              ))}
            </div>
          </div>
        </DataPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DataPanel title="Vendor Performance">
          <div className="space-y-3">
            {vendorPerformance.map((vendor) => (
              <div key={vendor.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-[var(--text-primary)]">{vendor.name}</p>
                  <span className="text-sm font-semibold text-[var(--text-secondary)]">SLA {vendor.slaScore}%</span>
                </div>
                <div className="mt-2 grid gap-2 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
                  <p>Tasks: <span className="font-semibold text-[var(--text-primary)]">{vendor.tasksHandled}</span></p>
                  <p>Rating: <span className="font-semibold text-[var(--text-primary)]">{vendor.rating}/5</span></p>
                  <p>Score: <span className="font-semibold text-[var(--text-primary)]">{vendor.score}</span></p>
                </div>
              </div>
            ))}
          </div>
        </DataPanel>

        <DataPanel title="Technician Performance">
          <div className="space-y-3">
            {technicianPerformance.map((technician) => (
              <div key={technician.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-[var(--text-primary)]">{technician.name}</p>
                  <span className="text-sm font-semibold text-[var(--text-secondary)]">Score {technician.performanceScore}</span>
                </div>
                <div className="mt-2 grid gap-2 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
                  <p>Completed: <span className="font-semibold text-[var(--text-primary)]">{technician.tasksCompleted}</span></p>
                  <p>Avg Resolution: <span className="font-semibold text-[var(--text-primary)]">{technician.avgResolutionHours}h</span></p>
                  <p>Tasks: <span className="font-semibold text-[var(--text-primary)]">{technician.complaintLoad}</span></p>
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DataPanel title="SLA Compliance Trend">
          <svg viewBox="0 0 520 240" className="h-[250px] w-full">
            {[0, 1, 2, 3, 4].map((line) => (
              <line
                key={line}
                x1="52"
                x2="472"
                y1={50 + line * 35}
                y2={50 + line * 35}
                stroke="rgba(148,163,184,0.22)"
              />
            ))}
            <polyline fill="none" stroke="rgb(var(--color-accent))" strokeWidth="3" points={slaPoints} />
            {slaTrendValues.map((value, index) => {
              const x = 52 + (index * 420) / Math.max(1, slaTrendValues.length - 1)
              const y = 190 - (value / 100) * 140
              return <circle key={`${index}-${value}`} cx={x} cy={y} r="4.2" fill="rgb(var(--color-accent))" />
            })}
            {trendBuckets.map((bucket, index) => {
              const x = 52 + (index * 420) / Math.max(1, trendBuckets.length - 1)
              return (
                <text
                  key={`sla-${bucket.label}`}
                  x={x}
                  y="224"
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--text-secondary)"
                >
                  {bucket.label}
                </text>
              )
            })}
          </svg>
        </DataPanel>

        <DataPanel title="Security Analytics">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Unauthorized Attempts', securityMetrics.unauthorizedAttempts],
              ['Failed Login Attempts', securityMetrics.failedLoginAttempts],
              ['High Risk Sessions', securityMetrics.highRiskSessions],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4">
                <p className="text-sm text-[var(--text-secondary)]">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
              </div>
            ))}
          </div>
        </DataPanel>
      </section>

      <section>
        <DataPanel title="Insight Panel">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Complaint Trend</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Complaints {trendInsight.direction} by {trendInsight.changePercent}% compared to the previous period window.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Low-Performing Vendor</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {lowPerformingVendor
                  ? `${lowPerformingVendor.name} is below benchmark (score ${lowPerformingVendor.score}).`
                  : 'No vendor underperformance signal in the active filter scope.'}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Technician Overload Alerts</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {overloadedTechnicians.length
                  ? `${overloadedTechnicians.map((technician) => technician.name).join(', ')} need load balancing.`
                  : 'No technician overload detected for selected filters.'}
              </p>
            </div>
          </div>
        </DataPanel>
      </section>
    </div>
  )
}

export default Analytics
