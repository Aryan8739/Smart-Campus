import type { UserRole } from '../contexts/authTypes'

export function getDefaultRouteForRole(role: UserRole) {
  if (role === 'super_admin') {
    return '/user-access/dashboard'
  }

  if (role === 'customer' || role === 'staff') {
    return '/customer/dashboard'
  }

  if (role === 'vendor') {
    return '/vendor/dashboard'
  }

  if (role === 'department_admin') {
    return '/department-admin/dashboard'
  }

  return '/role-dashboard'
}
