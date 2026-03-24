import { useMemo, useState } from 'react'
import KpiCard from '../../components/common/KpiCard'
import DataPanel from '../../components/common/DataPanel'
import PermissionMatrixPanel from '../../components/roles/PermissionMatrixPanel'
import RoleManagementPanel from '../../components/roles/RoleManagementPanel'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { useAuth } from '../../contexts/useAuth'
import {
  calculateCoverage,
  flattenPermissionKeys,
  permissionCategories as initialPermissionCategories,
} from '../../features/userAccess/services/roleService'
import type { PermissionCategory, RoleChangeLog, RoleDefinition } from '../../features/userAccess/types'

function createLogEntry(
  action: RoleChangeLog['action'],
  roleName: string,
  detail: string,
  actor: string
): RoleChangeLog {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    action,
    roleName,
    actor,
    detail,
    timestamp: new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  }
}

function normalizeHierarchy(roles: RoleDefinition[], categories: PermissionCategory[]) {
  const keys = flattenPermissionKeys(categories)
  const sorted = [...roles].sort((left, right) => left.priority - right.priority)

  const normalized = sorted.map((role, index) => {
    const higherRoles = sorted.slice(0, index)
    const nextPermissions = { ...role.permissions }

    keys.forEach((permission) => {
      if (higherRoles.some((higherRole) => !higherRole.permissions[permission])) {
        nextPermissions[permission] = false
      }
    })

    nextPermissions.VIEW_AUDIT = Boolean(nextPermissions.VIEW_AUDIT_LOG)
    nextPermissions.REPORTS_VIEW = Boolean(nextPermissions.EXPORT_REPORTS)
    nextPermissions.ANALYTICS_VIEW = Boolean(nextPermissions.EXPORT_REPORTS)

    return {
      ...role,
      permissions: nextPermissions,
      defaultPermissions: keys.filter((permission) => nextPermissions[permission]),
      coverage: calculateCoverage(nextPermissions, keys),
    }
  })

  return roles.map((role) => normalized.find((candidate) => candidate.id === role.id) ?? role)
}

function RoleMatrix() {
  const { roles: initialRoles } = useAdminModule()
  const { user } = useAuth()
  const actor = user?.name ?? 'System Admin'
  const [permissionCatalog, setPermissionCatalog] = useState<PermissionCategory[]>(initialPermissionCategories)
  const [roles, setRoles] = useState(() => normalizeHierarchy(initialRoles, initialPermissionCategories))
  const [logs, setLogs] = useState<RoleChangeLog[]>([
    createLogEntry('Role edited', 'Security Admin', 'Reviewed conflict status and updated default governance policy.', 'Ashish Bharti'),
    createLogEntry('Permission updated', 'COMPLAINT_ASSIGN', 'Adjusted complaint assignment control for operations workflows.', 'Ashish Bharti'),
    createLogEntry('Permission added', 'VIEW_AUDIT_LOG', 'Governance permission added to the active permission catalog.', 'Automation Bot'),
  ])

  const permissionKeys = useMemo(() => flattenPermissionKeys(permissionCatalog), [permissionCatalog])

  const appendLog = (action: RoleChangeLog['action'], roleName: string, detail: string) => {
    setLogs((previous) => [createLogEntry(action, roleName, detail, actor), ...previous].slice(0, 12))
  }

  const updateRoles = (
    updater: RoleDefinition[] | ((previous: RoleDefinition[]) => RoleDefinition[]),
    log?: { action: RoleChangeLog['action']; roleName: string; detail: string }
  ) => {
    setRoles((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater
      return normalizeHierarchy(next, permissionCatalog)
    })

    if (log) {
      appendLog(log.action, log.roleName, log.detail)
    }
  }

  const upsertPermissionCatalog = (
    updater: PermissionCategory[] | ((previous: PermissionCategory[]) => PermissionCategory[]),
    log?: { action: RoleChangeLog['action']; roleName: string; detail: string }
  ) => {
    setPermissionCatalog((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater
      const nextKeys = flattenPermissionKeys(next)

      setRoles((currentRoles) =>
        normalizeHierarchy(
          currentRoles.map((role) => {
            const nextPermissions = { ...role.permissions }
            nextKeys.forEach((permission) => {
              if (!(permission in nextPermissions)) {
                nextPermissions[permission] = false
              }
            })
            Object.keys(nextPermissions).forEach((permission) => {
              if (
                !nextKeys.includes(permission)
                && !['FORCE_LOGOUT', 'VIEW_AUDIT', 'USER_IMPERSONATE', 'REPORTS_VIEW', 'ANALYTICS_VIEW'].includes(permission)
              ) {
                delete nextPermissions[permission]
              }
            })

            return {
              ...role,
              permissions: nextPermissions,
              defaultPermissions: role.defaultPermissions.filter((permission) => nextKeys.includes(permission)),
              coverage: calculateCoverage(nextPermissions, nextKeys),
            }
          }),
          next
        )
      )

      return next
    })

    if (log) {
      appendLog(log.action, log.roleName, log.detail)
    }
  }

  const totalRoles = roles.length
  const systemRoles = roles.filter((role) => role.isSystem).length
  const customRoles = roles.filter((role) => !role.isSystem).length
  const activeRoles = roles.filter((role) => role.isActive).length

  return (
    <section className="space-y-7">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Roles" value={totalRoles} subtitle="All governance roles in the RBAC catalog." />
        <KpiCard title="Active Roles" value={activeRoles} subtitle="Roles currently enabled for campus operations." />
        <KpiCard title="Custom Roles" value={customRoles} subtitle="Business-specific roles created by administrators." />
        <KpiCard title="System Roles" value={systemRoles} subtitle="Protected roles aligned with platform hierarchy." />
      </section>

      <section className="grid items-start gap-7 min-[1650px]:grid-cols-[minmax(420px,0.94fr)_minmax(640px,1.06fr)]">
        <RoleManagementPanel
          roles={roles}
          permissionKeys={permissionKeys}
          onRolesChange={updateRoles}
        />
        <PermissionMatrixPanel
          roles={roles}
          permissionCatalog={permissionCatalog}
          onRolesChange={updateRoles}
          onPermissionCatalogChange={upsertPermissionCatalog}
        />
      </section>

      <DataPanel title="Audit History">
        <div className="space-y-3">
          {logs.map((log) => (
            <article
              key={log.id}
              className="flex flex-col gap-3 rounded-[1.15rem] border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {log.action} • {log.roleName}
                </p>
                <p className="mt-1 text-sm text-slate-500">{log.detail}</p>
              </div>
              <div className="text-sm text-slate-500">
                <p>{log.actor}</p>
                <p>{log.timestamp}</p>
              </div>
            </article>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default RoleMatrix
