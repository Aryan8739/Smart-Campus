import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Badge from '../../components/common/Badge'
import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'
import type { ActiveSession } from '../../features/userAccess/types'

function Sessions() {
  const { sessions } = useAdminModule()
  const { can } = usePermissions()
  const [sessionItems, setSessionItems] = useState(sessions)
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    setSessionItems(sessions)
  }, [sessions])

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setFeedback(null), 3200)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const pendingSession = sessionItems.find((session) => session.id === pendingSessionId) ?? null

  const handleForceLogout = (sessionId: string) => {
    setPendingSessionId(sessionId)
  }

  const confirmForceLogout = () => {
    if (!pendingSession) {
      setPendingSessionId(null)
      return
    }

    setSessionItems((previous) =>
      previous.map((session) =>
        session.id === pendingSession.id
          ? {
              ...session,
              status: 'Offline' as ActiveSession['status'],
              lastSeen: 'Logged out just now',
              durationMinutes: 0,
            }
          : session
      )
    )
    setFeedback(`${pendingSession.user} has been logged out successfully.`)
    setPendingSessionId(null)
  }

  return (
    <section>
      <DataPanel title="Active Sessions">
        {feedback ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedback}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sessionItems.map((session) => (
            <article key={session.id} className="rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{session.user}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{session.role}</p>
                </div>
                <Badge label={session.risk} tone={session.risk === 'Low' ? 'success' : session.risk === 'High' ? 'danger' : 'warning'} />
              </div>
              <div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                <p>{session.device}</p>
                <p>{session.location}</p>
                <p>Last Seen: {session.lastSeen}</p>
                <p>Failed Attempts: {session.failedAttempts}</p>
                <p>Status: {session.status}</p>
              </div>
              {can('FORCE_LOGOUT') ? (
                <button
                  onClick={() => handleForceLogout(session.id)}
                  className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-900 shadow-[0_1px_2px_rgba(244,63,94,0.08)] transition hover:bg-rose-100"
                >
                  Force Logout
                </button>
              ) : null}
            </article>
          ))}
        </div>
      </DataPanel>

      {pendingSession ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Force logout session</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              End the active session for {pendingSession.user} on {pendingSession.device}?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setPendingSessionId(null)}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={confirmForceLogout}
                className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  )
}

export default Sessions
