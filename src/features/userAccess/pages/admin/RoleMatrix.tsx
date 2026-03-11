import PermissionMatrixPanel from '../../components/roles/PermissionMatrixPanel'
import RoleManagementPanel from '../../components/roles/RoleManagementPanel'

function RoleMatrix() {
  return (
    <section className="grid gap-7 xl:grid-cols-[0.95fr_1.05fr]">
      <RoleManagementPanel />
      <PermissionMatrixPanel />
    </section>
  )
}

export default RoleMatrix
