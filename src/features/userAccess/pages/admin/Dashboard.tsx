import ComplaintStatusChart from '../../components/ComplaintStatusChart'
import MonthlyTrendChart from '../../components/MonthlyTrendChart'
import DataPanel from '../../components/common/DataPanel'
import KpiCard from '../../components/common/KpiCard'
import Badge from '../../components/common/Badge'
import { useAdminModule } from '../../hooks/useAdminModule'

function Dashboard() {
  const { kpis, vendors, technicians } = useAdminModule()

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-5">
        <KpiCard title="Total Users" value={kpis.totalUsers} subtitle="Across all filtered campuses" />
        <KpiCard title="Active Users" value={kpis.activeUsers} subtitle="Session-enabled accounts" />
        <KpiCard title="Suspended Users" value={kpis.suspendedUsers} subtitle="Policy or admin suspension" />
        <KpiCard title="Pending Approval" value={kpis.pendingApprovals} subtitle="Awaiting workflow approval" />
        <KpiCard title="Failed Login Attempts (Today)" value={kpis.failedLoginsToday} subtitle="Risk-sensitive access attempts" />
      </section>

      <section className="grid gap-7 xl:grid-cols-[1.06fr_1fr]">
        <DataPanel title="Campus Complaint Monitoring">
          <ComplaintStatusChart />
        </DataPanel>
        <DataPanel title="Analytics">
          <MonthlyTrendChart />
        </DataPanel>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1fr_1fr]">
        <DataPanel title="Vendor Summary">
          <div className="space-y-3">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-800">{vendor.name}</p>
                  <p className="text-sm text-slate-500">{vendor.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{vendor.activeTickets} tickets</p>
                  <Badge label={`${vendor.slaScore}% SLA`} tone={vendor.slaScore > 90 ? 'success' : 'warning'} />
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
        <DataPanel title="Technician Summary">
          <div className="space-y-3">
            {technicians.map((technician) => (
              <div key={technician.id} className="rounded-xl bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{technician.name}</p>
                    <p className="text-sm text-slate-500">{technician.department}</p>
                  </div>
                  <Badge label={technician.risk} tone={technician.risk === 'Low' ? 'success' : technician.risk === 'High' ? 'danger' : 'warning'} />
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-[rgb(var(--color-primary))]" style={{ width: `${technician.completionRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </DataPanel>
      </section>
    </>
  )
}

export default Dashboard
