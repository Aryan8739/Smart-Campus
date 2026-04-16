import ComplaintStatusOverview from '../../components/admin/ComplaintStatusOverview'
import ComplaintStatusChart from '../../components/ComplaintStatusChart'
import MonthlyTrendChart from '../../components/MonthlyTrendChart'
import DataPanel from '../../components/common/DataPanel'
import KpiCard from '../../components/common/KpiCard'
import Badge from '../../components/common/Badge'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'

function Dashboard() {
  const { kpis, vendors, technicians } = useAdminModule()

  return (
    <div className="space-y-6">
      <ComplaintStatusOverview />

      <section className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        <KpiCard title="Total Users" value={kpis.totalUsers} subtitle="Across all filtered campuses" />
        <KpiCard title="Active Users" value={kpis.activeUsers} subtitle="Session-enabled accounts" />
        <KpiCard title="Suspended Users" value={kpis.suspendedUsers} subtitle="Policy or admin suspension" />
        <KpiCard title="Pending Approval" value={kpis.pendingApprovals} subtitle="Awaiting workflow approval" />
        <KpiCard title="Failed Login Attempts (Today)" value={kpis.failedLoginsToday} subtitle="Risk-sensitive access attempts" />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <DataPanel title="Campus Complaint Monitoring">
          <ComplaintStatusChart />
        </DataPanel>
        <DataPanel title="Analytics">
          <MonthlyTrendChart />
        </DataPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <DataPanel title="Vendor Summary">
          <div className="space-y-2.5">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="flex flex-col items-start justify-between gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4 shadow-sm sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{vendor.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{vendor.category}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-[var(--text-primary)]">{vendor.activeTickets} tickets</p>
                  <Badge label={`${vendor.slaScore}% SLA`} tone={vendor.slaScore > 90 ? 'success' : 'warning'} />
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
        <DataPanel title="Technician Summary">
          <div className="space-y-2.5">
            {technicians.map((technician) => (
              <div key={technician.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4 shadow-sm">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{technician.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{technician.department}</p>
                  </div>
                  <Badge label={technician.risk} tone={technician.risk === 'Low' ? 'success' : technician.risk === 'High' ? 'danger' : 'warning'} />
                </div>
                <div className="mt-3 h-2 rounded-full bg-[var(--border-color)]">
                  <div className="h-2 rounded-full bg-[rgb(var(--color-primary))]" style={{ width: `${technician.completionRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
      </section>
    </div>
  )
}

export default Dashboard
