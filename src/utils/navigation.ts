import type { UserRole } from '../contexts/authTypes'

export function getDefaultRouteForRole(role: UserRole) {
  if (role === 'super_admin') {
    return '/user-access/dashboard'
  }

  if (role === 'customer' || role === 'staff') {
    return '/customer/dashboard'
  }

  return '/role-dashboard'
}
