import type { VendorNotification } from '../types'

type NotificationsTabProps = {
  notifications: VendorNotification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

function NotificationsTab({ notifications, onMarkRead, onMarkAllRead }: NotificationsTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Assignment alerts, escalation warnings, and settlement updates.
        </p>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="mt-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-1.5 text-xs font-semibold"
        >
          Mark all read
        </button>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="space-y-2.5">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={[
                'rounded-xl border px-3 py-2.5',
                item.isRead
                  ? 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]'
                  : 'border-[rgb(var(--color-primary))/0.4] bg-[rgb(var(--color-primary))/0.08]',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[rgb(var(--color-primary))/0.15] px-2 py-0.5 text-[10px] font-semibold text-[rgb(var(--color-primary))]">
                    {item.severity}
                  </span>
                  {!item.isRead ? (
                    <button
                      type="button"
                      onClick={() => onMarkRead(item.id)}
                      className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1 text-[10px] font-semibold"
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">{item.detail}</p>
              <p className="mt-1 text-[11px] text-[rgb(var(--color-text-secondary))]">{item.at}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export default NotificationsTab
