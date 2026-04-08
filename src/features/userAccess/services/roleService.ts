import type { CampusCode, PermissionCategory, PermissionDefinition, RoleDefinition, RoleLevel } from '../types'

export const permissionCategories: PermissionCategory[] = [
  {
    category: 'Identity',
    permissions: [
      { key: 'USER_CREATE', label: 'Create Users', description: 'Create new identity records and onboarding profiles.', category: 'Identity' },
      { key: 'USER_EDIT', label: 'Edit Users', description: 'Modify user metadata, access attributes, and lifecycle state.', category: 'Identity' },
      { key: 'USER_DELETE', label: 'Delete Users', description: 'Permanently remove user identities from the system.', category: 'Identity' },
    ],
  },
  {
    category: 'Role Control',
    permissions: [
      { key: 'ROLE_CREATE', label: 'Create Roles', description: 'Define new RBAC roles and governance templates.', category: 'Role Control' },
      { key: 'ROLE_EDIT', label: 'Edit Roles', description: 'Modify role metadata, hierarchy, and assignment logic.', category: 'Role Control' },
      { key: 'ROLE_DELETE', label: 'Delete Roles', description: 'Retire or remove custom and inactive roles.', category: 'Role Control' },
    ],
  },
  {
    category: 'Complaint System',
    permissions: [
      { key: 'COMPLAINT_VIEW', label: 'View Complaints', description: 'Access complaint queues, ticket detail, and status history.', category: 'Complaint System' },
      { key: 'COMPLAINT_ASSIGN', label: 'Assign Complaints', description: 'Assign complaints to technician or vendor teams.', category: 'Complaint System' },
      { key: 'COMPLAINT_CLOSE', label: 'Close Complaints', description: 'Approve resolution and close service requests.', category: 'Complaint System' },
    ],
  },
  {
    category: 'Vendor Control',
    permissions: [
      { key: 'VENDOR_CREATE', label: 'Create Vendors', description: 'Onboard new service vendors and contract records.', category: 'Vendor Control' },
      { key: 'VENDOR_EDIT', label: 'Edit Vendors', description: 'Update vendor profiles, SLA rules, and operating scope.', category: 'Vendor Control' },
      { key: 'VENDOR_DELETE', label: 'Delete Vendors', description: 'Remove inactive or invalid vendor records.', category: 'Vendor Control' },
    ],
  },
  {
    category: 'Technician Control',
    permissions: [
      { key: 'TECHNICIAN_ASSIGN', label: 'Assign Technicians', description: 'Allocate technician resources and route work orders.', category: 'Technician Control' },
      { key: 'TECHNICIAN_EDIT', label: 'Edit Technicians', description: 'Update technician capability, status, and roster data.', category: 'Technician Control' },
    ],
  },
  {
    category: 'Governance',
    permissions: [
      { key: 'VIEW_AUDIT_LOG', label: 'View Audit Log', description: 'Review immutable role and system governance history.', category: 'Governance' },
      { key: 'EXPORT_REPORTS', label: 'Export Reports', description: 'Export compliance, access, and operational governance reports.', category: 'Governance' },
    ],
  },
  {
    category: 'System Control',
    permissions: [
      { key: 'SYSTEM_SETTINGS_EDIT', label: 'Edit System Settings', description: 'Change platform-wide security and automation settings.', category: 'System Control' },
      { key: 'NOTIFICATION_CONTROL', label: 'Control Notifications', description: 'Manage escalation rules and outbound notification policies.', category: 'System Control' },
    ],
  },
]

export function flattenPermissionDefinitions(categories: PermissionCategory[]) {
  return categories.flatMap((category) =>
    category.permissions.map((permission) => ({ ...permission, category: category.category }))
  )
}

export function flattenPermissionKeys(categories: PermissionCategory[]) {
  return flattenPermissionDefinitions(categories).map((permission) => permission.key)
}

const allCampuses: CampusCode[] = ['Main Campus', 'North Campus', 'Research Park']
const allDepartments = ['All Departments', 'Security Office', 'Campus Operations', 'Central Admin Dashboard', 'Engineering Services']

export function createPermissionState(enabledPermissions: string[], categories: PermissionCategory[]) {
  const enabled = new Set(enabledPermissions)
  return Object.fromEntries(
    [
      ...flattenPermissionKeys(categories),
      'FORCE_LOGOUT',
      'VIEW_AUDIT',
      'USER_IMPERSONATE',
      'REPORTS_VIEW',
      'ANALYTICS_VIEW',
    ].map((permission) => [permission, enabled.has(permission)])
  ) as Record<string, boolean>
}

export function calculateCoverage(permissions: Record<string, boolean>, categoriesOrKeys: PermissionCategory[] | string[]) {
  const permissionKeys = Array.isArray(categoriesOrKeys) && typeof categoriesOrKeys[0] !== 'string'
    ? flattenPermissionKeys(categoriesOrKeys as PermissionCategory[])
    : (categoriesOrKeys as string[])

  const active = permissionKeys.filter((permission) => permissions[permission]).length
  return permissionKeys.length ? Math.round((active / permissionKeys.length) * 100) : 0
}

function createRoleDefinition(input: {
  id: string
  key: string
  name: string
  description: string
  level: RoleLevel
  owner: string
  members: number
  policy: string
  departmentAccess: string[]
  campusAccess: CampusCode[]
  defaultPermissions: string[]
  priority: number
  isSystem: boolean
  isActive: boolean
  badgeColor: RoleDefinition['badgeColor']
  conflictStatus: RoleDefinition['conflictStatus']
}, categories: PermissionCategory[]) {
  const permissions = createPermissionState(input.defaultPermissions, categories)

  if (input.defaultPermissions.includes('VIEW_AUDIT_LOG')) {
    permissions.VIEW_AUDIT = true
  }
  if (input.defaultPermissions.includes('EXPORT_REPORTS')) {
    permissions.REPORTS_VIEW = true
    permissions.ANALYTICS_VIEW = true
  }
  permissions.FORCE_LOGOUT = input.level !== 'Custom'
  permissions.USER_IMPERSONATE = input.level === 'Super Admin'

  return {
    ...input,
    permissions,
    coverage: calculateCoverage(permissions, categories),
  } satisfies RoleDefinition
}

export const roleRecords: RoleDefinition[] = [
  createRoleDefinition({
    id: 'ROLE-01',
    key: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Highest authority for platform governance and security control.',
    level: 'Super Admin',
    owner: 'Central Admin Dashboard',
    members: 4,
    policy: 'Enterprise-wide governance with unrestricted RBAC control.',
    departmentAccess: allDepartments,
    campusAccess: allCampuses,
    defaultPermissions: flattenPermissionKeys(permissionCategories),
    priority: 1,
    isSystem: true,
    isActive: true,
    badgeColor: 'blue',
    conflictStatus: 'Clear',
  }, permissionCategories),
  createRoleDefinition({
    id: 'ROLE-02',
    key: 'SECURITY_ADMIN',
    name: 'Security Admin',
    description: 'Security governance role with audit-heavy responsibilities.',
    level: 'Security Admin',
    owner: 'Security Office',
    members: 7,
    policy: 'Access governance, audit control, and security operational policy.',
    departmentAccess: ['Security Office', 'Central Admin Dashboard'],
    campusAccess: allCampuses,
    defaultPermissions: [
      'USER_CREATE',
      'USER_EDIT',
      'ROLE_CREATE',
      'ROLE_EDIT',
      'COMPLAINT_VIEW',
      'VIEW_AUDIT_LOG',
      'EXPORT_REPORTS',
      'SYSTEM_SETTINGS_EDIT',
      'NOTIFICATION_CONTROL',
    ],
    priority: 2,
    isSystem: true,
    isActive: true,
    badgeColor: 'rose',
    conflictStatus: 'Needs Review',
  }, permissionCategories),
  createRoleDefinition({
    id: 'ROLE-03',
    key: 'OPS_ADMIN',
    name: 'Operations Admin',
    description: 'Operational role focused on service delivery and queue supervision.',
    level: 'Operations Admin',
    owner: 'Campus Operations',
    members: 18,
    policy: 'Operational oversight with constrained governance authority.',
    departmentAccess: ['Campus Operations', 'Engineering Services'],
    campusAccess: allCampuses,
    defaultPermissions: [
      'USER_EDIT',
      'COMPLAINT_VIEW',
      'COMPLAINT_ASSIGN',
      'COMPLAINT_CLOSE',
      'VENDOR_EDIT',
      'TECHNICIAN_ASSIGN',
      'TECHNICIAN_EDIT',
      'EXPORT_REPORTS',
      'NOTIFICATION_CONTROL',
    ],
    priority: 3,
    isSystem: true,
    isActive: true,
    badgeColor: 'emerald',
    conflictStatus: 'Clear',
  }, permissionCategories),
  createRoleDefinition({
    id: 'ROLE-04',
    key: 'TECHNICIAN',
    name: 'Technician',
    description: 'Execution-focused role for field service operations.',
    level: 'Custom',
    owner: 'Engineering Services',
    members: 46,
    policy: 'Work-order execution with limited operational visibility.',
    departmentAccess: ['Engineering Services'],
    campusAccess: ['Main Campus', 'North Campus'],
    defaultPermissions: ['COMPLAINT_VIEW', 'TECHNICIAN_ASSIGN'],
    priority: 4,
    isSystem: true,
    isActive: true,
    badgeColor: 'amber',
    conflictStatus: 'Clear',
  }, permissionCategories),
  createRoleDefinition({
    id: 'ROLE-05',
    key: 'VIEWER',
    name: 'Viewer',
    description: 'Read-only role for passive operational monitoring.',
    level: 'Custom',
    owner: 'Central Admin Dashboard',
    members: 23,
    policy: 'Read-only monitoring access with no administrative changes.',
    departmentAccess: ['All Departments'],
    campusAccess: allCampuses,
    defaultPermissions: ['COMPLAINT_VIEW'],
    priority: 5,
    isSystem: true,
    isActive: true,
    badgeColor: 'slate',
    conflictStatus: 'Clear',
  }, permissionCategories),
]

export const roleTemplates = [
  createRoleDefinition({
    id: 'TPL-01',
    key: 'DEPARTMENT_SUPERVISOR',
    name: 'Department Supervisor',
    description: 'Template for department-level service governance and reporting.',
    level: 'Custom',
    owner: 'Template Library',
    members: 0,
    policy: 'Department service supervision with controlled reporting access.',
    departmentAccess: ['Engineering Services', 'Campus Operations'],
    campusAccess: ['Main Campus'],
    defaultPermissions: ['USER_EDIT', 'COMPLAINT_VIEW', 'COMPLAINT_ASSIGN', 'TECHNICIAN_ASSIGN', 'EXPORT_REPORTS'],
    priority: 4,
    isSystem: false,
    isActive: true,
    badgeColor: 'blue',
    conflictStatus: 'Clear',
  }, permissionCategories),
  createRoleDefinition({
    id: 'TPL-02',
    key: 'AUDIT_REVIEWER',
    name: 'Audit Reviewer',
    description: 'Template optimized for compliance review and evidence export.',
    level: 'Custom',
    owner: 'Template Library',
    members: 0,
    policy: 'Compliance review role with audit visibility and reporting export.',
    departmentAccess: ['Security Office'],
    campusAccess: allCampuses,
    defaultPermissions: ['COMPLAINT_VIEW', 'VIEW_AUDIT_LOG', 'EXPORT_REPORTS'],
    priority: 5,
    isSystem: false,
    isActive: true,
    badgeColor: 'rose',
    conflictStatus: 'Clear',
  }, permissionCategories),
]

export function upsertPermissionCategory(
  categories: PermissionCategory[],
  permission: PermissionDefinition,
  previousKey?: string
) {
  const filtered = categories.map((category) => ({
    ...category,
    permissions: category.permissions.filter((item) => item.key !== previousKey),
  }))

  const target = filtered.find((category) => category.category === permission.category)
  if (target) {
    target.permissions = [...target.permissions, permission]
  } else if (permission.category) {
    filtered.push({ category: permission.category, permissions: [permission] })
  }

  return filtered
}
