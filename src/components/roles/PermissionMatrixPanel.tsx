import { useEffect, useMemo, useState } from 'react'
import {
  calculateCoverage,
  flattenPermissionKeys,
  permissionCategories as defaultPermissionCategories,
  upsertPermissionCategory,
} from '../../features/userAccess/services/roleService'
import type { PermissionCategory, PermissionDefinition, RoleChangeLog, RoleDefinition } from '../../features/userAccess/types'
import Badge from '../common/Badge'
import DataPanel from '../common/DataPanel'

function ToggleSwitch({ checked, disabled, onChange }: { checked: boolean; disabled?: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative h-7 w-12 rounded-full transition ${checked ? 'bg-[linear-gradient(90deg,#3157a3_0%,#4d79d6_100%)]' : 'bg-[var(--border-color)]'} ${disabled ? 'cursor-not-allowed opacity-45' : ''}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

type PermissionDraft = {
  key: string
  label: string
  description: string
  category: string
}

const emptyDraft: PermissionDraft = {
  key: '',
  label: '',
  description: '',
  category: defaultPermissionCategories[0].category,
}

function PermissionMatrixPanel({
  roles,
  permissionCatalog,
  onRolesChange,
  onPermissionCatalogChange,
}: {
  roles: RoleDefinition[]
  permissionCatalog: PermissionCategory[]
  onRolesChange: (
    updater: RoleDefinition[] | ((previous: RoleDefinition[]) => RoleDefinition[]),
    log?: { action: RoleChangeLog['action']; roleName: string; detail: string }
  ) => void
  onPermissionCatalogChange: (
    updater: PermissionCategory[] | ((previous: PermissionCategory[]) => PermissionCategory[]),
    log?: { action: RoleChangeLog['action']; roleName: string; detail: string }
  ) => void
}) {
  const sortedRoles = useMemo(() => [...roles].sort((left, right) => left.priority - right.priority), [roles])
  const permissionKeys = useMemo(() => flattenPermissionKeys(permissionCatalog), [permissionCatalog])
  const [search, setSearch] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState(sortedRoles[0]?.id ?? '')
  const [copyFromRoleId, setCopyFromRoleId] = useState(sortedRoles[1]?.id ?? sortedRoles[0]?.id ?? '')
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  const [mode, setMode] = useState<'create' | 'edit' | null>(null)
  const [draft, setDraft] = useState<PermissionDraft>(emptyDraft)
  const [pendingDeletePermission, setPendingDeletePermission] = useState<PermissionDefinition | null>(null)

  useEffect(() => {
    if (!sortedRoles.some((role) => role.id === selectedRoleId)) setSelectedRoleId(sortedRoles[0]?.id ?? '')
    if (!sortedRoles.some((role) => role.id === copyFromRoleId)) setCopyFromRoleId(sortedRoles[1]?.id ?? sortedRoles[0]?.id ?? '')
  }, [copyFromRoleId, selectedRoleId, sortedRoles])

  const selectedRole = sortedRoles.find((role) => role.id === selectedRoleId) ?? sortedRoles[0]
  const visibleCategories = permissionCatalog
    .map((category) => ({
      ...category,
      permissions: category.permissions.filter((permission) => {
        const term = search.trim().toLowerCase()
        return !term
          || permission.key.toLowerCase().includes(term)
          || permission.label.toLowerCase().includes(term)
          || permission.description.toLowerCase().includes(term)
      }),
    }))
    .filter((category) => category.permissions.length > 0)

  const getPermissionBlockReason = (roleId: string, permissionKey: string) => {
    const roleIndex = sortedRoles.findIndex((role) => role.id === roleId)
    if (roleIndex <= 0) return null
    const higherRoles = sortedRoles.slice(0, roleIndex)
    const blockedBy = higherRoles.find((role) => !role.permissions[permissionKey])
    return blockedBy ? `${blockedBy.name} does not grant ${permissionKey}` : null
  }

  const updateRolePermissions = (
    roleId: string,
    mutate: (permissions: Record<string, boolean>) => Record<string, boolean>,
    detail: string
  ) => {
    const role = roles.find((item) => item.id === roleId)
    if (!role) return
    onRolesChange(
      (previous) =>
        previous.map((item) =>
          item.id === roleId
            ? {
                ...item,
                permissions: mutate({ ...item.permissions }),
                defaultPermissions: permissionKeys.filter((permission) => mutate({ ...item.permissions })[permission]),
                coverage: calculateCoverage(mutate({ ...item.permissions }), permissionKeys),
              }
            : item
        ),
      { action: 'Permission changed', roleName: role.name, detail }
    )
  }

  const togglePermission = (roleId: string, permissionKey: string) => {
    const targetRole = roles.find((role) => role.id === roleId)
    const blockReason = getPermissionBlockReason(roleId, permissionKey)
    if (!targetRole) return
    const nextValue = !targetRole.permissions[permissionKey]
    if (nextValue && blockReason) return
    updateRolePermissions(roleId, (permissions) => {
      permissions[permissionKey] = nextValue
      permissions.VIEW_AUDIT = Boolean(permissions.VIEW_AUDIT_LOG)
      permissions.REPORTS_VIEW = Boolean(permissions.EXPORT_REPORTS)
      permissions.ANALYTICS_VIEW = Boolean(permissions.EXPORT_REPORTS)
      return permissions
    }, `${permissionKey} ${nextValue ? 'enabled' : 'disabled'} from the matrix.`)
  }

  const applyBulk = (mapper: (permissionKey: string) => boolean, detail: string) => {
    if (!selectedRole) return
    updateRolePermissions(selectedRole.id, (permissions) => {
      permissionKeys.forEach((permission) => {
        permissions[permission] = mapper(permission)
      })
      permissions.VIEW_AUDIT = Boolean(permissions.VIEW_AUDIT_LOG)
      permissions.REPORTS_VIEW = Boolean(permissions.EXPORT_REPORTS)
      permissions.ANALYTICS_VIEW = Boolean(permissions.EXPORT_REPORTS)
      return permissions
    }, detail)
  }

  const savePermission = () => {
    if (!draft.key.trim() || !draft.label.trim()) return
    const previousKey = mode === 'edit' ? draft.key : undefined
    const permission = {
      key: draft.key.trim().toUpperCase().replace(/\s+/g, '_'),
      label: draft.label.trim(),
      description: draft.description.trim() || 'Custom permission',
      category: draft.category,
    }
    onPermissionCatalogChange((previous) => upsertPermissionCategory(previous, permission, mode === 'edit' ? previousKey : undefined), {
      action: mode === 'edit' ? 'Permission updated' : 'Permission added',
      roleName: permission.key,
      detail: mode === 'edit' ? 'Permission definition updated in the catalog.' : 'New permission added to the RBAC catalog.',
    })
    setMode(null)
    setDraft(emptyDraft)
  }

  const openEditPermission = (permission: PermissionDefinition) => {
    setMode('edit')
    setDraft({
      key: permission.key,
      label: permission.label,
      description: permission.description,
      category: permission.category ?? defaultPermissionCategories[0].category,
    })
  }

  const confirmDeletePermission = () => {
    if (!pendingDeletePermission) return
    onPermissionCatalogChange(
      (previous) =>
        previous
          .map((category) => ({
            ...category,
            permissions: category.permissions.filter((permission) => permission.key !== pendingDeletePermission.key),
          }))
          .filter((category) => category.permissions.length),
      {
        action: 'Permission removed',
        roleName: pendingDeletePermission.key,
        detail: 'Permission removed from the RBAC catalog after confirmation.',
      }
    )
    setPendingDeletePermission(null)
  }

  return (
    <DataPanel
      title="Permission Matrix"
      action={
        <button onClick={() => { setMode('create'); setDraft(emptyDraft) }} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
          Create Permission
        </button>
      }
    >
      {mode ? (
        <div className="mb-5 rounded-[1.2rem] border border-[var(--border-color)] bg-[linear-gradient(180deg,var(--card-bg)_0%,var(--bg-primary)_100%)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{mode === 'create' ? 'Create Permission' : 'Edit Permission'}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage permission catalog entries used by the RBAC matrix.</p>
            </div>
            <button onClick={() => { setMode(null); setDraft(emptyDraft) }} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Cancel</button>
          </div>
          <div className="mt-4 grid gap-4 min-[1700px]:grid-cols-2">
            <label className="text-sm text-[var(--text-secondary)]"><span className="mb-2 block font-medium text-[var(--text-primary)]">Permission Name</span><input value={draft.label} onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none" /></label>
            <label className="text-sm text-[var(--text-secondary)]"><span className="mb-2 block font-medium text-[var(--text-primary)]">Permission Key</span><input value={draft.key} onChange={(e) => setDraft((p) => ({ ...p, key: e.target.value }))} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none" /></label>
            <label className="text-sm text-[var(--text-secondary)]"><span className="mb-2 block font-medium text-[var(--text-primary)]">Category</span><select value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none">{permissionCatalog.map((category) => <option key={category.category} value={category.category}>{category.category}</option>)}</select></label>
            <label className="text-sm text-[var(--text-secondary)]"><span className="mb-2 block font-medium text-[var(--text-primary)]">Description</span><input value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none" /></label>
          </div>
          <div className="mt-4 flex justify-end"><button onClick={savePermission} className="rounded-xl bg-[rgb(var(--color-primary))] px-5 py-2.5 text-sm font-semibold text-white">{mode === 'create' ? 'Create Permission' : 'Save Permission'}</button></div>
        </div>
      ) : null}

      <div className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search permissions, labels, or descriptions" className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none lg:max-w-md" />
          <div className="flex flex-wrap gap-2">
            {sortedRoles.map((role) => (
              <button key={role.id} onClick={() => setSelectedRoleId(role.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedRoleId === role.id ? 'bg-[rgb(var(--color-primary))] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}>{role.name}</button>
            ))}
          </div>
        </div>

        <div className="rounded-[1.2rem] border border-[var(--border-color)] bg-[linear-gradient(180deg,var(--card-bg)_0%,var(--bg-primary)_100%)] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => applyBulk((permission) => !getPermissionBlockReason(selectedRole.id, permission), 'Bulk action applied: Allow All while respecting hierarchy ceilings.')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Allow All</button>
            <button onClick={() => applyBulk(() => false, 'Bulk action applied: Deny All permissions for the selected role.')} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Deny All</button>
            <select value={copyFromRoleId} onChange={(e) => setCopyFromRoleId(e.target.value)} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none">
              {sortedRoles.filter((role) => role.id !== selectedRoleId).map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
            <button onClick={() => {
              const sourceRole = roles.find((role) => role.id === copyFromRoleId)
              if (!sourceRole || !selectedRole) return
              applyBulk((permission) => !getPermissionBlockReason(selectedRole.id, permission) && Boolean(sourceRole.permissions[permission]), `Copied permissions from ${sourceRole.name}.`)
            }} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Copy Permissions From Role</button>
            <button onClick={() => applyBulk((permission) => selectedRole.defaultPermissions.includes(permission) && !getPermissionBlockReason(selectedRole.id, permission), 'Reset selected role permissions to default baseline.')} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Reset To Default</button>
          </div>
          {selectedRole ? <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]"><Badge label={`${selectedRole.level}`} tone="info" /><span>Priority {selectedRole.priority}</span><span>Coverage {selectedRole.coverage}%</span></div> : null}
        </div>

        <div className="space-y-3 min-[1650px]:pr-2">
          {visibleCategories.map((category) => {
            const isCollapsed = collapsedGroups[category.category]
            return (
              <div key={category.category} className="rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
                <button onClick={() => setCollapsedGroups((previous) => ({ ...previous, [category.category]: !previous[category.category] }))} className="flex w-full items-center justify-between rounded-t-[1.1rem] border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-left text-sm font-semibold text-[var(--text-primary)]">
                  <span>{category.category}</span>
                  <span>{isCollapsed ? '+' : '-'}</span>
                </button>
                {!isCollapsed ? (
                  <div className="divide-y divide-[var(--border-color)]">
                    {category.permissions.map((permission) => (
                      <div key={permission.key} className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
                        <div title={permission.description}>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{permission.key}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{permission.label}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditPermission(permission)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)]">Edit Permission</button>
                          <button onClick={() => setPendingDeletePermission(permission)} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">Delete Permission</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="overflow-x-auto rounded-[1.2rem] border border-[var(--border-color)] bg-[var(--card-bg)]">
          <table className="min-w-[980px] border-separate border-spacing-0">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="sticky left-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-4 text-left text-xs uppercase tracking-[0.18em] text-[var(--text-primary)]">Permission</th>
                {sortedRoles.map((role) => (
                  <th key={role.id} className="border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-4 text-left text-xs uppercase tracking-[0.18em] text-[var(--text-primary)]">
                    <div className="space-y-1"><span>{role.name}</span><div className="h-1.5 rounded-full bg-[var(--border-color)]"><div className="h-1.5 rounded-full bg-[rgb(var(--color-primary))]" style={{ width: `${role.coverage}%` }} /></div></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleCategories.map((category) => (
                <>
                  <tr key={category.category}>
                    <td colSpan={sortedRoles.length + 1} className="border-b border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)]">{category.category}</td>
                  </tr>
                  {category.permissions.map((permission, index) => (
                    <tr key={permission.key} className={index % 2 === 0 ? 'bg-[var(--card-bg)]' : 'bg-[var(--bg-primary)]'}>
                      <td className="sticky left-0 z-10 border-b border-[var(--border-color)] bg-inherit px-4 py-3 align-top" title={permission.description}>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{permission.key}</p>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">{permission.label}</p>
                      </td>
                      {sortedRoles.map((role) => {
                        const blockReason = getPermissionBlockReason(role.id, permission.key)
                        const disabled = Boolean(blockReason) && !role.permissions[permission.key]
                        return (
                          <td key={`${role.id}-${permission.key}`} className="border-b border-[var(--border-color)] bg-inherit px-4 py-3 text-sm">
                            <div className="space-y-2">
                              <ToggleSwitch checked={Boolean(role.permissions[permission.key])} disabled={disabled} onChange={() => togglePermission(role.id, permission.key)} />
                              <p className={`max-w-[12rem] text-xs ${blockReason ? 'text-amber-600' : 'text-[var(--text-secondary)]'}`}>{blockReason ? `Locked: ${blockReason}` : permission.description}</p>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingDeletePermission ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-md rounded-[1.35rem] bg-[var(--card-bg)] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Delete Permission</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Delete <span className="font-semibold text-[var(--text-primary)]">{pendingDeletePermission.key}</span>? This will remove it from the RBAC catalog.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setPendingDeletePermission(null)} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Cancel</button>
              <button onClick={confirmDeletePermission} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Confirm Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </DataPanel>
  )
}

export default PermissionMatrixPanel
