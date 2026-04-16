import DataPanel from '../common/DataPanel'
import Badge from '../common/Badge'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'

function AuditLogTable({ activity = false }: { activity?: boolean }) {
  const { audits, activityLogs } = useAdminModule()
  const rows = activity ? activityLogs : audits
  const rowCellClass = 'border-y border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-4 text-[var(--text-secondary)]'

  return (
    <DataPanel title={activity ? 'Activity Logs' : 'Audit Logs'}>
      <div className="w-full overflow-x-auto pb-2">
        <table className="min-w-[900px] border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              <th className="px-4">Actor</th>
              <th className="px-4">Action</th>
              <th className="px-4">Target</th>
              <th className="px-4">Module</th>
              <th className="px-4">Outcome</th>
              <th className="px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((log) => (
              <tr key={log.id} className="text-sm">
                <td className={`${rowCellClass} rounded-l-2xl border-l font-semibold text-[var(--text-primary)]`}>
                  {log.actor}
                </td>
                <td className={rowCellClass}>
                  {log.action}
                </td>
                <td className={rowCellClass}>
                  {log.target}
                </td>
                <td className={rowCellClass}>
                  {log.module ?? log.channel}
                </td>
                <td className={rowCellClass}>
                  <Badge label={log.outcome} tone={log.outcome === 'Success' ? 'success' : log.outcome === 'Blocked' ? 'danger' : 'warning'} />
                </td>
                <td className={`${rowCellClass} rounded-r-2xl border-r`}>
                  {log.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataPanel>
  )
}

export default AuditLogTable
