import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NotificationRecord } from '../../types'

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

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          UCC Group 1 • Central Admin Dashboard
        </p>
        <h1 className="text-[1.95rem] font-semibold tracking-[-0.04em] text-slate-700 md:text-[2.65rem]">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-[0.94rem] leading-7 text-slate-500">
          Campus-wide governance control center for access, operations monitoring, audit review, and enterprise administration.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-end gap-2.5">
        <button className="rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-sm text-slate-500 shadow-sm transition hover:-translate-y-0.5">
          ◔
        </button>
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen((previous) => !previous)
              setIsAdminMenuOpen(false)
            }}
            className="rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-sm text-slate-500 shadow-sm transition hover:-translate-y-0.5"
          >
            🔔
          </button>
          {isNotificationOpen ? (
            <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-72 rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.24)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-xs font-medium text-slate-400"
                >
                  Close
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {notifications.length ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    Nothing to show here.
                  </div>
                )}
              </div>
            </div>
          ) : null}
          {unreadCount ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </div>
        <div className="rounded-xl bg-emerald-100 px-4 py-2.5 text-xs font-semibold text-emerald-700 shadow-sm">
          Session: Active
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setIsAdminMenuOpen((previous) => !previous)
              setIsNotificationOpen(false)
            }}
            className="rounded-xl border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
          >
            Admin
          </button>
          {isAdminMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+10px)] z-20 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.24)]">
              <button
                onClick={() => {
                  localStorage.removeItem('campus360_user')
                  navigate('/login')
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default AdminTopbar
