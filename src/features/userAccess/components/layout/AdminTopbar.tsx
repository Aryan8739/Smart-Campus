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
    <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
          UCC Group 1 • Central Admin Dashboard
        </p>
        <h1 className="text-[2.35rem] font-semibold tracking-[-0.04em] text-slate-700 md:text-[3.35rem]">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-[1.02rem] leading-8 text-slate-500">
          Campus-wide governance control center for access, operations monitoring, audit review, and enterprise administration.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center justify-end gap-3">
        <button className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-500 shadow-sm transition hover:-translate-y-0.5">
          ◔
        </button>
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen((previous) => !previous)
              setIsAdminMenuOpen(false)
            }}
            className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-500 shadow-sm transition hover:-translate-y-0.5"
          >
            🔔
          </button>
          {isNotificationOpen ? (
            <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.24)]">
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
                      <p className="font-medium text-slate-800">{notification.title}</p>
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
        <div className="rounded-2xl bg-emerald-100 px-5 py-3 text-sm font-medium text-emerald-700 shadow-sm">
          Session: Active
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setIsAdminMenuOpen((previous) => !previous)
              setIsNotificationOpen(false)
            }}
            className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5"
          >
            Admin
          </button>
          {isAdminMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_50px_-24px_rgba(15,23,42,0.24)]">
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
