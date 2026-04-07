export type UserRole =
  | 'customer'
  | 'staff'
  | 'technician'
  | 'vendor'
  | 'department_admin'
  | 'campus_admin'
  | 'security_admin'
  | 'ops_admin'
  | 'super_admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
}
