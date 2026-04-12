import type { NotificationItem } from '../types'

type NotificationsTabProps = {
  notifications: NotificationItem[]
}

function NotificationsTab({ notifications }: NotificationsTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Notifications & Escalation Alerts</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Auto-generated reminders, SLA warnings, and activity notifications.
        </p>
      </header>

      <div className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="space-y-2.5">
          {notifications.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</p>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                    item.severity === 'success'
                      ? 'bg-[rgb(var(--color-success))/0.15] text-[rgb(var(--color-success))]'
                      : item.severity === 'warning'
                        ? 'bg-[rgb(var(--color-warning))/0.15] text-[rgb(var(--color-warning))]'
                        : 'bg-[rgb(var(--color-primary))/0.15] text-[rgb(var(--color-primary))]',
                  ].join(' ')}
                >
                  {item.severity}
                </span>
              </div>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{item.detail}</p>
              <p className="mt-1 text-[11px] text-[rgb(var(--color-text-secondary))]">{item.at}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NotificationsTab
