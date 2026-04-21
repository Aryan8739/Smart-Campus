import type { TechnicianNotification } from '../types'

type NotificationsTabProps = {
  notifications: TechnicianNotification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onClearRead: () => void
}

function NotificationsTab({ notifications, onMarkRead, onMarkAllRead, onClearRead }: NotificationsTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Delayed progress reminders, closure validations, and execution alerts.
        </p>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Alert Stream</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2.5 py-1.5 text-xs font-semibold"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClearRead}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2.5 py-1.5 text-xs font-semibold"
            >
              Clear read
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={[
                'rounded-2xl border p-3',
                item.isRead
                  ? 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]'
                  : 'border-[rgb(var(--color-primary))/0.35] bg-[rgb(var(--color-primary))/0.07]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</p>
                  <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{item.detail}</p>
                </div>
                <span
                  className={[
                    'rounded-full border px-2 py-1 text-[10px] font-semibold',
                    item.severity === 'warning'
                      ? 'border-[rgb(var(--color-warning))/0.35] bg-[rgb(var(--color-warning))/0.1] text-[rgb(var(--color-warning))]'
                      : item.severity === 'success'
                        ? 'border-[rgb(var(--color-success))/0.35] bg-[rgb(var(--color-success))/0.1] text-[rgb(var(--color-success))]'
                        : 'border-[rgb(var(--color-primary))/0.35] bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]',
                  ].join(' ')}
                >
                  {item.severity}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[rgb(var(--color-text-secondary))]">
                <span>{item.at}</span>
                {!item.isRead ? (
                  <button
                    type="button"
                    onClick={() => onMarkRead(item.id)}
                    className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1 font-semibold"
                  >
                    Mark read
                  </button>
                ) : (
                  <span className="font-semibold text-[rgb(var(--color-success))]">Read</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default NotificationsTab
