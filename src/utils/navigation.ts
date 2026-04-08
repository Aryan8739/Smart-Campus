import type { UserRole } from '../contexts/authTypes'

export function getDefaultRouteForRole(role: UserRole) {
  return role === 'super_admin' ? '/user-access/dashboard' : '/docs'
}
