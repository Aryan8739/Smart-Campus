import { useMemo } from 'react'
import { useAuth } from '../../../contexts/useAuth'
import type { AdminRoleKey, PermissionKey } from '../types'
import { roleRecords } from '../services/roleService'

function mapToAdminRole(role?: string): AdminRoleKey {
  switch (role) {
    case 'super_admin':
      return 'SUPER_ADMIN'
    case 'security_admin':
      return 'SECURITY_ADMIN'
    case 'ops_admin':
    case 'campus_admin':
    case 'department_admin':
      return 'OPS_ADMIN'
    default:
      return 'OPS_ADMIN'
  }
}

export function usePermissions() {
  const { user } = useAuth()

  return useMemo(() => {
    const roleKey = mapToAdminRole(user?.role)
    const roleRecord = roleRecords.find((role) => role.key === roleKey)

    const can = (permission: PermissionKey) => Boolean(roleRecord?.permissions[permission])

    return {
      roleKey,
      can,
      isSuperAdmin: roleKey === 'SUPER_ADMIN',
    }
  }, [user?.role])
}
