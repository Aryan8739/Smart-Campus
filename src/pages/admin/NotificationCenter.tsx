import Badge from '../../components/common/Badge'
import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'

function NotificationCenter() {
  const { notifications } = useAdminModule()

  return (
    <section>
      <DataPanel title="Notification Center">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{notification.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{notification.message}</p>
                </div>
                <Badge label={notification.severity} tone={notification.severity === 'critical' ? 'danger' : notification.severity === 'warning' ? 'warning' : 'info'} />
              </div>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">{notification.createdAt}</p>
            </div>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default NotificationCenter
