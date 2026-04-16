import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import type { NotificationRecord } from '../../features/userAccess/types'
import { useTheme } from '../../hooks/useTheme'

type OverlayPosition = {
  top: number
  right: number
}

function AdminTopbar({
  title,
  notifications,
}: {
  title: string
  notifications: NotificationRecord[]
}) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notificationPosition, setNotificationPosition] = useState<OverlayPosition>({
    top: 0,
    right: 16,
  })
  const [adminMenuPosition, setAdminMenuPosition] = useState<OverlayPosition>({
    top: 0,
    right: 16,
  })

  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  const notificationRef = useRef<HTMLDivElement>(null)
  const adminMenuRef = useRef<HTMLDivElement>(null)
  const notificationButtonRef = useRef<HTMLButtonElement>(null)
  const adminButtonRef = useRef<HTMLButtonElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const resolveOverlayPosition = (
    trigger: HTMLButtonElement | null
  ): OverlayPosition => {
    if (!trigger) {
      return { top: 0, right: 16 }
    }

    const rect = trigger.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const padding = 16
    const right = Math.max(padding, viewportWidth - rect.right)
    const maxWidth = Math.max(280, viewportWidth - padding * 2)

    return {
      top: rect.bottom + 12,
      right: Math.min(right, Math.max(padding, viewportWidth - maxWidth)),
    }
  }

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

  useEffect(() => {
    if (!isNotificationOpen && !isAdminMenuOpen) {
      return
    }

    const updateOverlayPositions = () => {
      setNotificationPosition(resolveOverlayPosition(notificationButtonRef.current))
      setAdminMenuPosition(resolveOverlayPosition(adminButtonRef.current))
    }

    updateOverlayPositions()
    window.addEventListener('resize', updateOverlayPositions)
    window.addEventListener('scroll', updateOverlayPositions, true)

    return () => {
      window.removeEventListener('resize', updateOverlayPositions)
      window.removeEventListener('scroll', updateOverlayPositions, true)
    }
  }, [isAdminMenuOpen, isNotificationOpen])

  return (
    <div className="relative flex flex-col gap-5 overflow-visible xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          UCC Group 1 • Central Admin Dashboard
        </p>
        <h1 className="break-words text-[1.78rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)] md:text-[2.25rem]">
          {title}
        </h1>
        <p className="mt-1.5 text-[0.92rem] leading-6 text-[var(--text-secondary)]">
          Campus-wide governance control center for access, operations monitoring,
          audit review, and enterprise administration.
        </p>
      </div>

      <div
        className="relative z-20 flex w-full flex-wrap items-center gap-2 overflow-visible rounded-[1.4rem] border border-[rgba(148,163,184,0.28)] bg-[rgba(255,255,255,0.72)] p-2 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.18)] backdrop-blur-md xl:ml-6 xl:w-auto xl:max-w-full xl:flex-none xl:justify-end dark:border-[var(--border-color)] dark:bg-[rgba(15,23,42,0.55)]"
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
          className="relative min-h-[40px] min-w-[88px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)] shadow-sm transition hover:-translate-y-0.5"
        >
          {isDark ? 'Light' : 'Dark'}
        </button>

        {/* 🔔 Notification */}
        <div className="relative" ref={notificationRef}>
          <button
            ref={notificationButtonRef}
            onClick={() => {
              setNotificationPosition(resolveOverlayPosition(notificationButtonRef.current))
              setIsNotificationOpen((prev) => !prev)
              setIsAdminMenuOpen(false)
            }}
            className="relative flex min-h-[40px] w-[40px] items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm text-[var(--text-secondary)] shadow-sm transition hover:-translate-y-0.5"
          >
            🔔
          </button>

          {isNotificationOpen &&
            createPortal(
              <div
                className="fixed z-[70] w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.35)]"
                style={{
                  top: notificationPosition.top,
                  right: notificationPosition.right,
                }}
              >
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
        <div className="relative min-h-[40px] rounded-xl bg-emerald-100 px-3.5 py-2 text-center text-xs font-semibold text-emerald-700 shadow-sm dark:bg-emerald-500/15 dark:text-emerald-300">
          Session: Active
        </div>

        {/* Admin Menu */}
        <div className="relative" ref={adminMenuRef}>
          <button
            ref={adminButtonRef}
            onClick={() => {
              setAdminMenuPosition(resolveOverlayPosition(adminButtonRef.current))
              setIsAdminMenuOpen((prev) => !prev)
              setIsNotificationOpen(false)
            }}
            className="relative min-h-[40px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition hover:-translate-y-0.5"
          >
            Admin
          </button>

          {isAdminMenuOpen &&
            createPortal(
              <div
                className="fixed z-[70] w-40 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-2 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.24)]"
                style={{
                  top: adminMenuPosition.top,
                  right: adminMenuPosition.right,
                }}
              >
                <button
                  onClick={() => {
                    localStorage.removeItem('campus360_user')
                    navigate('/login')
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>,
              document.body
            )}
        </div>
      </div>
    </div>
  )
}

export default AdminTopbar
