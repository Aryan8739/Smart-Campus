import Badge from '../../components/common/Badge'
import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../hooks/useAdminModule'
import { usePermissions } from '../../hooks/usePermissions'

function Sessions() {
  const { sessions } = useAdminModule()
  const { can } = usePermissions()

  return (
    <section>
      <DataPanel title="Active Sessions">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <article key={session.id} className="rounded-[1.1rem] bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{session.user}</p>
                  <p className="text-sm text-slate-500">{session.role}</p>
                </div>
                <Badge label={session.risk} tone={session.risk === 'Low' ? 'success' : session.risk === 'High' ? 'danger' : 'warning'} />
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-500">
                <p>{session.device}</p>
                <p>{session.location}</p>
                <p>Last Seen: {session.lastSeen}</p>
                <p>Failed Attempts: {session.failedAttempts}</p>
              </div>
              {can('FORCE_LOGOUT') ? (
                <button className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">Force Logout</button>
              ) : null}
            </article>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default Sessions
