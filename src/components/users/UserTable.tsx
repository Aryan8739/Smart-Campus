import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Badge from '../common/Badge'
import DataPanel from '../common/DataPanel'
import EmptyState from '../common/EmptyState'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'
import type { ManagedUser, SessionStatus, UserStatus } from '../../features/userAccess/types'
import { fetchUserAuditLogs, impersonateUser, type UserAuditEntry } from '../../features/userAccess/services/userActionService'

type BulkAction = 'suspend' | 'delete'
type RowAction = 'activate' | 'suspend' | 'reset-password' | 'force-logout'

const rowActionContent: Record<RowAction, { title: string; description: (user: ManagedUser) => string }> = {
  activate: {
    title: 'Activate user',
    description: (user) => `Activate ${user.name} and restore normal account access.`,
  },
  suspend: {
    title: 'Suspend user',
    description: (user) => `Suspend ${user.name} and restrict further account activity until reviewed.`,
  },
  'reset-password': {
    title: 'Reset password',
    description: (user) => `Generate a password reset flow for ${user.name} and mark their credentials for refresh.`,
  },
  'force-logout': {
    title: 'Force logout',
    description: (user) => `End all active sessions for ${user.name} and require sign-in again.`,
  },
}

function UserTable() {
  const { users, setUsers } = useAdminModule()
  const { can, isSuperAdmin } = usePermissions()
  const [isLoading] = useState(false)
  const [isAuditLoading, setIsAuditLoading] = useState(false)
  const [auditLogs, setAuditLogs] = useState<UserAuditEntry[]>([])
  const [auditUser, setAuditUser] = useState<ManagedUser | null>(null)
  const [impersonatingUserId, setImpersonatingUserId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState<BulkAction | null>(null)
  const [activityUserId, setActivityUserId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<{ type: RowAction; userId: string } | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error'>('success')
  const pageSize = 4
  const tableUsers = users
  const pagedUsers = tableUsers.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.max(1, Math.ceil(tableUsers.length / pageSize))
  const activityUser = tableUsers.find((user) => user.id === activityUserId) ?? null
  const actionUser = tableUsers.find((user) => user.id === pendingAction?.userId) ?? null

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setFeedback(null), 3200)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const showSuccess = (message: string) => {
    setFeedbackTone('success')
    setFeedback(message)
  }

  const showError = (message: string) => {
    setFeedbackTone('error')
    setFeedback(message)
  }

  const toggleUser = (id: string) => {
    setSelected((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]
    )
  }

  const openActionModal = (type: RowAction, userId: string) => {
    setPendingAction({ type, userId })
  }

  const closeActionModal = () => {
    setPendingAction(null)
  }

  const updateUser = (
    userId: string,
    changes: Partial<ManagedUser>,
    message: string
  ) => {
    setUsers((previous) =>
      previous.map((user) => (user.id === userId ? { ...user, ...changes } : user))
    )
    showSuccess(message)
  }

  const handleBulkConfirm = () => {
    if (!selected.length) {
      showError(`Select at least one user before ${showModal}.`)
      setShowModal(null)
      return
    }

    if (showModal === 'suspend') {
      setUsers((previous) =>
        previous.map((user) =>
          selected.includes(user.id)
            ? { ...user, status: 'Suspended' as UserStatus, sessionStatus: 'Offline' as SessionStatus }
            : user
        )
      )
      showSuccess(`${selected.length} user account(s) suspended.`)
    }

    if (showModal === 'delete') {
      setUsers((previous) => previous.filter((user) => !selected.includes(user.id)))
      showSuccess(`${selected.length} user account(s) removed from the directory.`)
      setPage(1)
    }

    setSelected([])
    setShowModal(null)
  }

  const handleRowActionConfirm = () => {
    if (!pendingAction || !actionUser) {
      setPendingAction(null)
      return
    }

    if (pendingAction.type === 'activate') {
      updateUser(
        actionUser.id,
        { status: 'Active', approval: 'Approved', sessionStatus: 'Online' },
        `${actionUser.name} is now active.`
      )
    }

    if (pendingAction.type === 'suspend') {
      updateUser(
        actionUser.id,
        { status: 'Suspended', sessionStatus: 'Offline' },
        `${actionUser.name} has been suspended.`
      )
    }

    if (pendingAction.type === 'reset-password') {
      updateUser(
        actionUser.id,
        { lastLogin: 'Password reset required on next sign-in', sessionStatus: 'Offline' },
        `Password reset initiated for ${actionUser.name}.`
      )
    }

    if (pendingAction.type === 'force-logout') {
      updateUser(
        actionUser.id,
        { sessionStatus: 'Offline', loginAttempts: 0 },
        `${actionUser.name} has been logged out from active sessions.`
      )
    }

    setPendingAction(null)
  }

  const handleViewAuditLogs = async (user: ManagedUser) => {
    setAuditUser(user)
    setAuditLogs([])
    setIsAuditLoading(true)

    try {
      const entries = await fetchUserAuditLogs(user)
      setAuditLogs(entries)
    } catch {
      setAuditUser(null)
      showError(`Could not load audit logs for ${user.name}.`)
    } finally {
      setIsAuditLoading(false)
    }
  }

  const handleImpersonate = async (user: ManagedUser) => {
    if (impersonatingUserId) {
      return
    }

    setImpersonatingUserId(user.id)
    try {
      const message = await impersonateUser(user)
      showSuccess(message)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impersonation failed.'
      showError(message)
    } finally {
      setImpersonatingUserId(null)
    }
  }

  return (
    <DataPanel
      title="User Directory"
      action={
        <div className="flex gap-2">
          {can('USER_DELETE') ? (
            <button
              onClick={() => setShowModal('delete')}
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600"
            >
              Bulk Delete
            </button>
          ) : null}
          <button
            onClick={() => setShowModal('suspend')}
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700"
          >
            Bulk Suspend
          </button>
        </div>
      }
    >
      {feedback ? (
        <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium ${
          feedbackTone === 'success'
            ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border border-rose-200 bg-rose-50 text-rose-700'
        }`}>
          {feedback}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-[1.1rem] bg-[var(--bg-secondary)]" />
          ))}
        </div>
      ) : !tableUsers.length ? (
        <EmptyState title="No users found" description="Adjust filters or create a new user to populate the directory." />
      ) : (
        <div className="w-full overflow-x-auto pb-2">
          <table className="min-w-[1100px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                <th className="px-4"><input type="checkbox" checked={selected.length === tableUsers.length && tableUsers.length > 0} onChange={() => setSelected(selected.length === tableUsers.length ? [] : tableUsers.map((user) => user.id))} /></th>
                {['Name','Email','Phone','Role','Department','Campus','Status/Approval','Actions'].map((heading) => (
                  <th key={heading} className="px-4">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((user) => (
                <tr key={user.id} className="bg-[var(--bg-secondary)] text-sm shadow-[0_8px_22px_-18px_rgba(15,23,42,0.22)]">
                  <td className="rounded-l-2xl px-4 py-4"><input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleUser(user.id)} /></td>
                  <td className="px-4 py-4 font-semibold text-[var(--text-primary)]">{user.name}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{user.email}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{user.phone}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{user.role}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{user.department}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{user.campus}</td>
                  <td className="px-4 py-4">
                    <div className="flex min-w-[8.5rem] flex-col gap-2">
                      <Badge label={user.status} tone={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'warning'} />
                      <Badge label={user.approval} tone={user.approval === 'Approved' ? 'info' : user.approval === 'Rejected' ? 'danger' : 'warning'} />
                    </div>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => openActionModal('activate', user.id)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Activate</button>
                      <button onClick={() => openActionModal('suspend', user.id)} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Suspend</button>
                      <button onClick={() => openActionModal('reset-password', user.id)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">Reset Password</button>
                      {can('FORCE_LOGOUT') ? <button onClick={() => openActionModal('force-logout', user.id)} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-900 shadow-[0_1px_2px_rgba(244,63,94,0.08)] transition hover:bg-rose-100">Force Logout</button> : null}
                      <button onClick={() => setActivityUserId(user.id)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">View Activity</button>
                      {can('VIEW_AUDIT') ? (
                        <button
                          type="button"
                          onClick={() => handleViewAuditLogs(user)}
                          disabled={isAuditLoading && auditUser?.id === user.id}
                          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isAuditLoading && auditUser?.id === user.id ? 'Loading...' : 'View Audit Logs'}
                        </button>
                      ) : null}
                      {isSuperAdmin ? (
                        <button
                          type="button"
                          onClick={() => handleImpersonate(user)}
                          disabled={impersonatingUserId === user.id}
                          className="rounded-lg bg-[rgba(var(--color-primary),0.12)] px-3 py-1 text-xs font-semibold text-[rgb(var(--color-primary))] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {impersonatingUserId === user.id ? 'Starting...' : 'Impersonate User'}
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                page === index + 1
                  ? 'bg-[rgb(var(--color-primary))] text-white'
                  : 'border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="text-sm text-[var(--text-secondary)]">Selected: {selected.length}</div>
      </div>

      {showModal ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Confirm {showModal}</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">This action will apply to {selected.length || 'selected'} user accounts.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowModal(null)} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Cancel</button>
              <button onClick={handleBulkConfirm} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">Confirm</button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {pendingAction && actionUser ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{rowActionContent[pendingAction.type].title}</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{rowActionContent[pendingAction.type].description(actionUser)}</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={closeActionModal} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Cancel</button>
              <button onClick={handleRowActionConfirm} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">Continue</button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {auditUser ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-900/35 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{auditUser.name} Audit Logs</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Recent access and policy events tied to this account.</p>
              </div>
              <button
                type="button"
                onClick={() => setAuditUser(null)}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Close
              </button>
            </div>

            {isAuditLoading ? (
              <div className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                Loading audit events...
              </div>
            ) : auditLogs.length ? (
              <div className="mt-5 space-y-3">
                {auditLogs.map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[var(--text-primary)]">{entry.action}</p>
                      <Badge
                        label={entry.outcome}
                        tone={entry.outcome === 'Success' ? 'success' : entry.outcome === 'Blocked' ? 'danger' : 'warning'}
                      />
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{entry.timestamp}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                No audit events available for this user.
              </div>
            )}
          </div>
        </div>,
        document.body
      ) : null}

      {activityUser ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-900/35 px-4 py-8">
          <div className="w-full max-w-3xl rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{activityUser.name} Activity</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{activityUser.role} • {activityUser.department} • {activityUser.campus}</p>
              </div>
              <button
                onClick={() => setActivityUserId(null)}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Last Login</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{activityUser.lastLogin}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Login Attempts</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{activityUser.loginAttempts}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Session Status</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{activityUser.sessionStatus}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Created Date</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{activityUser.createdDate}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Failed Logins Today</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{activityUser.failedLoginsToday}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Inactive Days</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">{activityUser.inactiveDays}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Risk Score</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 w-full rounded-full bg-[var(--border-color)]">
                    <div
                      className={`h-2 rounded-full ${activityUser.riskScore > 70 ? 'bg-rose-500' : activityUser.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${activityUser.riskScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{activityUser.riskScore}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Account Summary</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge label={activityUser.status} tone={activityUser.status === 'Active' ? 'success' : activityUser.status === 'Suspended' ? 'danger' : 'warning'} />
                  <Badge label={activityUser.approval} tone={activityUser.approval === 'Approved' ? 'info' : activityUser.approval === 'Rejected' ? 'danger' : 'warning'} />
                  <Badge label={activityUser.sessionStatus} tone={activityUser.sessionStatus === 'Online' ? 'success' : activityUser.sessionStatus === 'Offline' ? 'neutral' : 'warning'} />
                  <Badge label={activityUser.mfaEnabled ? 'MFA Enabled' : 'MFA Disabled'} tone={activityUser.mfaEnabled ? 'info' : 'warning'} />
                </div>
                <p className="mt-4 text-sm text-[var(--text-secondary)]">Credential expiry: <span className="font-semibold text-[var(--text-primary)]">{activityUser.expiryDate}</span></p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </DataPanel>
  )
}

export default UserTable
