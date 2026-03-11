import type { Dispatch, SetStateAction } from 'react'

export interface UserAccessKpi {
  title: string
  value: string
  delta: string
  insight: string
}

export type CampusCode = 'Main Campus' | 'North Campus' | 'Research Park'
export type ApprovalState = 'Pending' | 'Approved' | 'Rejected'
export type UserStatus = 'Active' | 'Pending Approval' | 'Locked' | 'Suspended'
export type SessionStatus = 'Online' | 'Offline' | 'Timeout Soon' | 'Force Logout Suggested'
export type RiskLevel = 'Low' | 'Moderate' | 'High'
export type AuditOutcome = 'Success' | 'Warning' | 'Blocked'

export type AdminRoleKey = 'SUPER_ADMIN' | 'SECURITY_ADMIN' | 'OPS_ADMIN'

export type PermissionKey =
  | 'USER_CREATE'
  | 'USER_DELETE'
  | 'USER_EDIT'
  | 'ROLE_EDIT'
  | 'FORCE_LOGOUT'
  | 'VIEW_AUDIT'
  | 'SYSTEM_SETTINGS_EDIT'
  | 'USER_IMPERSONATE'
  | 'REPORTS_VIEW'
  | 'ANALYTICS_VIEW'

export interface UserAccessStat {
  label: string
  value: string
}

export interface ManagedUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  campus: CampusCode
  status: UserStatus
  approval: ApprovalState
  mfaEnabled: boolean
  lastLogin: string
  loginAttempts: number
  sessionStatus: SessionStatus
  createdDate: string
  riskScore: number
  failedLoginsToday: number
  inactiveDays: number
  expiryDate: string
}

export interface PermissionCategory {
  category: string
  permissions: string[]
}

export interface RoleDefinition {
  id: string
  name: string
  key: AdminRoleKey | string
  owner: string
  members: number
  policy: string
  conflictStatus: 'Clear' | 'Needs Review'
  coverage: number
  permissions: Record<PermissionKey | string, boolean>
}

export interface ActiveSession {
  id: string
  user: string
  role: string
  device: string
  location: string
  campus: CampusCode
  department: string
  risk: RiskLevel
  lastSeen: string
  durationMinutes: number
  failedAttempts: number
  status: SessionStatus | 'Healthy'
}

export interface AuditLog {
  id: string
  actor: string
  action: string
  target: string
  channel: string
  timestamp: string
  module?: string
  outcome: AuditOutcome
}

export interface SecurityPolicy {
  title: string
  description: string
  value: string
}

export interface ComplaintRecord {
  id: string
  title: string
  campus: CampusCode
  department: string
  status: 'Open' | 'Assigned' | 'Escalated' | 'Resolved'
  priority: 'Low' | 'Medium' | 'High'
  vendor: string
  technician: string
  createdDate: string
}

export interface VendorRecord {
  id: string
  name: string
  campus: CampusCode
  category: string
  activeTickets: number
  slaScore: number
  lastAudit: string
}

export interface TechnicianRecord {
  id: string
  name: string
  campus: CampusCode
  department: string
  assignedTasks: number
  completionRate: number
  risk: RiskLevel
}

export interface ReportRecord {
  id: string
  name: string
  category: 'Compliance' | 'Operations' | 'Security'
  generatedOn: string
  owner: string
}

export interface NotificationRecord {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  severity: 'info' | 'warning' | 'critical'
}

export interface AutomationSettings {
  autoSuspendInactiveUsers: boolean
  autoLockAfterFailedAttempts: boolean
  credentialExpiryAlerts: boolean
  autoForceLogoutHighRisk: boolean
}

export interface FilterState {
  search: string
  dateRange: '7d' | '30d' | '90d'
  campus: 'All' | CampusCode
  department: 'All' | string
  role: 'All' | string
  status: 'All' | UserStatus
  approval: 'All' | ApprovalState
}

export interface AdminModuleContextValue {
  filters: FilterState
  setFilters: Dispatch<SetStateAction<FilterState>>
  users: ManagedUser[]
  complaints: ComplaintRecord[]
  vendors: VendorRecord[]
  technicians: TechnicianRecord[]
  sessions: ActiveSession[]
  roles: RoleDefinition[]
  audits: AuditLog[]
  activityLogs: AuditLog[]
  reports: ReportRecord[]
  notifications: NotificationRecord[]
  automation: AutomationSettings
  kpis: {
    totalUsers: number
    activeUsers: number
    suspendedUsers: number
    pendingApprovals: number
    failedLoginsToday: number
  }
}
