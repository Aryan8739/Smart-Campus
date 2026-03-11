import Badge from '../../components/common/Badge'
import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../hooks/useAdminModule'

function NotificationCenter() {
  const { notifications } = useAdminModule()

  return (
    <section>
      <DataPanel title="Notification Center">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-[1.1rem] bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                </div>
                <Badge label={notification.severity} tone={notification.severity === 'critical' ? 'danger' : notification.severity === 'warning' ? 'warning' : 'info'} />
              </div>
              <p className="mt-3 text-xs text-slate-400">{notification.createdAt}</p>
            </div>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default NotificationCenter
