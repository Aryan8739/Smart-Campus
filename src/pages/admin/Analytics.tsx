import DataPanel from '../../components/common/DataPanel'
import KpiCard from '../../components/common/KpiCard'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'

function Analytics() {
  const { complaints, users, vendors, technicians } = useAdminModule()

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-4">
        <KpiCard title="Complaints Tracked" value={complaints.length} subtitle="Filtered operational incidents" />
        <KpiCard title="Users in Scope" value={users.length} subtitle="Governance population" />
        <KpiCard title="Vendors in Scope" value={vendors.length} subtitle="Active partners" />
        <KpiCard title="Technicians in Scope" value={technicians.length} subtitle="Task execution workforce" />
      </section>
      <section>
        <DataPanel title="Analytics Snapshot">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Unauthorized access blocked', '148'],
              ['Average session duration', '3h 42m'],
              ['Risk escalations', '7'],
              ['Approval turnaround', '1.8 days'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[1.1rem] border border-[var(--border-color)] bg-[color:rgba(15,23,42,0.04)] p-4 backdrop-blur-sm dark:bg-white/5"
              >
                <p className="text-sm text-[var(--text-secondary)]">{label}</p>
                <p className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
              </div>
            ))}
          </div>
        </DataPanel>
      </section>
    </>
  )
}

export default Analytics
