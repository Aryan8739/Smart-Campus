import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import type { NotificationRecord } from '../../features/userAccess/types'
import { useTheme } from '../../hooks/useTheme'

function AdminTopbar({
  title,
  notifications,
}: {
  title: string
  notifications: NotificationRecord[]
}) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  const notificationRef = useRef<HTMLDivElement>(null)
  const adminMenuRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // 🔥 Click outside handler
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setIsNotificationOpen(false)
      }

      if (
        adminMenuRef.current &&
        !adminMenuRef.current.contains(e.target as Node)
      ) {
        setIsAdminMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between overflow-visible">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          UCC Group 1 • Central Admin Dashboard
        </p>
        <h1 className="text-[1.95rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)] md:text-[2.65rem]">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-[0.94rem] leading-7 text-[var(--text-secondary)]">
          Campus-wide governance control center for access, operations monitoring,
          audit review, and enterprise administration.
        </p>
      </div>

      <div
        className="relative z-50 flex flex-wrap items-center justify-end gap-2.5 overflow-visible rounded-[1.4rem] border border-[rgba(148,163,184,0.28)] bg-[rgba(255,255,255,0.72)] px-3 py-3 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.18)] backdrop-blur-md dark:border-[var(--border-color)] dark:bg-[rgba(15,23,42,0.55)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.04] dark:opacity-[0.12]"
          style={{
            backgroundImage: "url('/gbuLogo.png')",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '88px',
          }}
        />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-sm text-[var(--text-secondary)] shadow-sm transition hover:-translate-y-0.5"
        >
          {isDark ? 'Light' : 'Dark'}
        </button>

        {/* 🔔 Notification */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setIsNotificationOpen((prev) => !prev)
              setIsAdminMenuOpen(false)
            }}
            className="relative rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-sm text-[var(--text-secondary)] shadow-sm transition hover:-translate-y-0.5"
          >
            🔔
          </button>

          {isNotificationOpen &&
            createPortal(
              <div className="fixed right-20 top-28 z-20 w-80 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Notifications
                  </p>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-xs text-[var(--text-secondary)]"
                  >
                    Close
                  </button>
                </div>

                <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                  {notifications.length ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-xl bg-[var(--bg-primary)] p-4"
                      >
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {n.title}
                        </p>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          {n.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-[var(--bg-primary)] p-4 text-sm text-[var(--text-secondary)]">
                      Nothing to show here.
                    </div>
                  )}
                </div>
              </div>,
              document.body
            )}

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Session */}
        <div className="relative rounded-xl bg-emerald-100 px-4 py-2.5 text-xs font-semibold text-emerald-700 shadow-sm dark:bg-emerald-500/15 dark:text-emerald-300">
          Session: Active
        </div>

        {/* Admin Menu */}
        <div className="relative" ref={adminMenuRef}>
          <button
            onClick={() => {
              setIsAdminMenuOpen((prev) => !prev)
              setIsNotificationOpen(false)
            }}
            className="relative rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition hover:-translate-y-0.5"
          >
            Admin
          </button>

          {isAdminMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-40 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-2 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.24)]">
              <button
                onClick={() => {
                  localStorage.removeItem('campus360_user')
                  navigate('/login')
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminTopbar
