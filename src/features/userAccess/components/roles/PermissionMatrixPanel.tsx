import { permissionCategories } from '../../services/roleService'
import { useAdminModule } from '../../hooks/useAdminModule'
import DataPanel from '../common/DataPanel'

function PermissionMatrixPanel() {
  const { roles } = useAdminModule()

  return (
    <DataPanel title="Permission Matrix">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-slate-200 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                Permission
              </th>
              {roles.map((role) => (
                <th key={role.id} className="border-b border-slate-200 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionCategories.flatMap((category) => [
              <tr key={category.category}>
                <td colSpan={roles.length + 1} className="bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                  {category.category}
                </td>
              </tr>,
              ...category.permissions.map((permission) => (
                <tr key={permission}>
                  <td className="border-b border-slate-200 px-4 py-3 text-sm text-slate-600">{permission}</td>
                  {roles.map((role) => (
                    <td key={`${role.id}-${permission}`} className="border-b border-slate-200 px-4 py-3 text-sm">
                      {role.permissions[permission] ? 'Allowed' : 'Hidden'}
                    </td>
                  ))}
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
    </DataPanel>
  )
}

export default PermissionMatrixPanel
