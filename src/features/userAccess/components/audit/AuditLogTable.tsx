import DataPanel from '../common/DataPanel'
import Badge from '../common/Badge'
import { useAdminModule } from '../../hooks/useAdminModule'

function AuditLogTable({ activity = false }: { activity?: boolean }) {
  const { audits, activityLogs } = useAdminModule()
  const rows = activity ? activityLogs : audits

  return (
    <DataPanel title={activity ? 'Activity Logs' : 'Audit Logs'}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
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
              <tr key={log.id} className="bg-slate-50 text-sm">
                <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-800">{log.actor}</td>
                <td className="px-4 py-4 text-slate-500">{log.action}</td>
                <td className="px-4 py-4 text-slate-500">{log.target}</td>
                <td className="px-4 py-4 text-slate-500">{log.module ?? log.channel}</td>
                <td className="px-4 py-4">
                  <Badge label={log.outcome} tone={log.outcome === 'Success' ? 'success' : log.outcome === 'Blocked' ? 'danger' : 'warning'} />
                </td>
                <td className="rounded-r-2xl px-4 py-4 text-slate-500">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataPanel>
  )
}

export default AuditLogTable
