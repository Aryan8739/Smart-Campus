import KpiCard from '../../components/common/KpiCard'
import ApprovalWorkflow from '../../components/users/ApprovalWorkflow'
import UserFormPanel from '../../components/users/UserFormPanel'
import UserTable from '../../components/users/UserTable'
import DataPanel from '../../components/common/DataPanel'
import Badge from '../../components/common/Badge'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'

function UserManagement() {
  const { kpis, filters, setFilters } = useAdminModule()
  const { can } = usePermissions()

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-5">
        <KpiCard title="Total Users" value={kpis.totalUsers} subtitle="Campus-wide access identities" />
        <KpiCard title="Active Users" value={kpis.activeUsers} subtitle="Enabled and policy compliant" />
        <KpiCard title="Suspended Users" value={kpis.suspendedUsers} subtitle="Auto/manual suspension state" />
        <KpiCard title="Pending Approval" value={kpis.pendingApprovals} subtitle="Workflow queue awaiting action" />
        <KpiCard title="Failed Login Attempts (Today)" value={kpis.failedLoginsToday} subtitle="Security watchlist signal" />
      </section>

      <ApprovalWorkflow />

      <section className="grid min-w-0 gap-7 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <UserFormPanel />
        <DataPanel title="Approval Queue">
          <div className="mb-4 flex gap-2">
            {['Pending', 'Approved', 'Rejected'].map((value) => (
              <button
                key={value}
                onClick={() => setFilters((previous) => ({ ...previous, approval: value as typeof previous.approval }))}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  filters.approval === value
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {[
              ['Pending Approvals', `${kpis.pendingApprovals}`],
              ['Approval Required', 'Invite-based onboarding'],
              ['MFA Enrollment', 'Enabled by default'],
            ].map(([label, value], index) => (
              <div
                key={label}
                className="rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[var(--text-primary)]">{label}</p>
                  <Badge label={index === 0 ? 'Workflow' : index === 1 ? 'Policy' : 'Security'} tone="info" />
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{value}</p>
              </div>
            ))}
            {can('ROLE_EDIT') ? (
              <div className="rounded-[1.1rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                Conflict detection warning is enabled before role publish.
              </div>
            ) : null}
          </div>
        </DataPanel>
      </section>

      <UserTable />
    </>
  )
}

export default UserManagement
