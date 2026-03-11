import { usePermissions } from '../../hooks/usePermissions'
import { useAdminModule } from '../../hooks/useAdminModule'
import Badge from '../common/Badge'
import DataPanel from '../common/DataPanel'

function RoleManagementPanel() {
  const { roles } = useAdminModule()
  const { can } = usePermissions()

  return (
    <DataPanel
      title="Role Management"
      action={
        can('ROLE_EDIT') ? (
          <button className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
            Add Role
          </button>
        ) : null
      }
    >
      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="rounded-[1.1rem] bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{role.name}</p>
                <p className="mt-1 text-sm text-slate-500">{role.policy}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge label={role.conflictStatus} tone={role.conflictStatus === 'Clear' ? 'success' : 'warning'} />
                {can('ROLE_EDIT') ? <button className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">Edit</button> : null}
                {can('ROLE_EDIT') ? <button className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">Clone</button> : null}
                {can('ROLE_EDIT') ? <button className="rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Delete</button> : null}
              </div>
            </div>
            {role.conflictStatus === 'Needs Review' ? (
              <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Conflict detection warning: privilege overlap found before publish.
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </DataPanel>
  )
}

export default RoleManagementPanel
