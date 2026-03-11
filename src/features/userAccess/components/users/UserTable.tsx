import { useState } from 'react'
import Badge from '../common/Badge'
import DataPanel from '../common/DataPanel'
import EmptyState from '../common/EmptyState'
import { useAdminModule } from '../../hooks/useAdminModule'
import { usePermissions } from '../../hooks/usePermissions'

function UserTable() {
  const { users } = useAdminModule()
  const { can, isSuperAdmin } = usePermissions()
  const [isLoading] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState<'suspend' | 'delete' | null>(null)
  const pageSize = 4
  const pagedUsers = users.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize))

  const toggleUser = (id: string) => {
    setSelected((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]
    )
  }

  return (
    <DataPanel
      title="User Directory"
      action={
        <div className="flex gap-2">
          {can('USER_DELETE') ? (
            <button onClick={() => setShowModal('delete')} className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600">
              Bulk Delete
            </button>
          ) : null}
          <button onClick={() => setShowModal('suspend')} className="rounded-xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Bulk Suspend
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-[1.1rem] bg-slate-100" />
          ))}
        </div>
      ) : !users.length ? (
        <EmptyState title="No users found" description="Adjust filters or create a new user to populate the directory." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4"><input type="checkbox" checked={selected.length === users.length && users.length > 0} onChange={() => setSelected(selected.length === users.length ? [] : users.map((user) => user.id))} /></th>
                {['Name','Email','Phone','Role','Department','Campus','Status','Approval','Last Login','Login Attempts','Session Status','Created Date','Risk Score','Actions'].map((heading) => (
                  <th key={heading} className="px-4">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((user) => (
                <tr key={user.id} className="bg-slate-50 text-sm">
                  <td className="rounded-l-2xl px-4 py-4"><input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleUser(user.id)} /></td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{user.name}</td>
                  <td className="px-4 py-4 text-slate-500">{user.email}</td>
                  <td className="px-4 py-4 text-slate-500">{user.phone}</td>
                  <td className="px-4 py-4 text-slate-500">{user.role}</td>
                  <td className="px-4 py-4 text-slate-500">{user.department}</td>
                  <td className="px-4 py-4 text-slate-500">{user.campus}</td>
                  <td className="px-4 py-4"><Badge label={user.status} tone={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'warning'} /></td>
                  <td className="px-4 py-4"><Badge label={user.approval} tone={user.approval === 'Approved' ? 'success' : user.approval === 'Rejected' ? 'danger' : 'warning'} /></td>
                  <td className="px-4 py-4 text-slate-500">{user.lastLogin}</td>
                  <td className="px-4 py-4 text-slate-500">{user.loginAttempts}</td>
                  <td className="px-4 py-4 text-slate-500">{user.sessionStatus}</td>
                  <td className="px-4 py-4 text-slate-500">{user.createdDate}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-slate-200">
                        <div className={`h-2 rounded-full ${user.riskScore > 70 ? 'bg-rose-500' : user.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${user.riskScore}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{user.riskScore}</span>
                    </div>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Activate</button>
                      <button className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Suspend</button>
                      <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Reset Password</button>
                      {can('FORCE_LOGOUT') ? <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Force Logout</button> : null}
                      <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">View Activity</button>
                      {can('VIEW_AUDIT') ? <button className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">View Audit Logs</button> : null}
                      {isSuperAdmin ? <button className="rounded-lg bg-[rgba(var(--color-primary),0.12)] px-3 py-1 text-xs font-semibold text-[rgb(var(--color-primary))]">Impersonate User</button> : null}
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
            <button key={index} onClick={() => setPage(index + 1)} className={`rounded-lg px-3 py-2 text-sm font-medium ${page === index + 1 ? 'bg-[rgb(var(--color-primary))] text-white' : 'bg-slate-100 text-slate-600'}`}>
              {index + 1}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-500">Selected: {selected.length}</div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/30 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Confirm {showModal}</h3>
            <p className="mt-2 text-sm text-slate-500">This action will apply to {selected.length || 'selected'} user accounts.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowModal(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
              <button onClick={() => setShowModal(null)} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">Confirm</button>
            </div>
          </div>
        </div>
      ) : null}
    </DataPanel>
  )
}

export default UserTable
