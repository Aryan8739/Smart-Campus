import { useState } from 'react'
import { usePermissions } from '../../hooks/usePermissions'
import { calculateCoverage, createPermissionState, roleTemplates } from '../../services/roleService'
import type { CampusCode, RoleChangeLog, RoleDefinition, RoleLevel } from '../../types'
import Badge from '../common/Badge'
import DataPanel from '../common/DataPanel'

type RoleDraft = {
  name: string
  key: string
  description: string
  level: RoleLevel
  owner: string
  policy: string
  departmentAccess: string[]
  campusAccess: CampusCode[]
  defaultPermissions: string[]
  priority: number
  isActive: boolean
  badgeColor: RoleDefinition['badgeColor']
}

const roleLevels: RoleLevel[] = ['Super Admin', 'Security Admin', 'Operations Admin', 'Custom']
const departmentOptions = ['All Departments', 'Central Admin Dashboard', 'Security Office', 'Campus Operations', 'Engineering Services']
const campusOptions: CampusCode[] = ['Main Campus', 'North Campus', 'Research Park']

const badgeStyles: Record<RoleDefinition['badgeColor'], string> = {
  slate: 'bg-slate-200 text-slate-700',
  blue: 'bg-[rgba(var(--color-primary),0.14)] text-[rgb(var(--color-primary))]',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-700',
}

function createDraft(role?: RoleDefinition): RoleDraft {
  return {
    name: role?.name ?? '',
    key: role?.key ?? '',
    description: role?.description ?? '',
    level: role?.level ?? 'Custom',
    owner: role?.owner ?? '',
    policy: role?.policy ?? '',
    departmentAccess: role?.departmentAccess ?? ['All Departments'],
    campusAccess: role?.campusAccess ?? ['Main Campus'],
    defaultPermissions: role?.defaultPermissions ?? [],
    priority: role?.priority ?? 5,
    isActive: role?.isActive ?? true,
    badgeColor: role?.badgeColor ?? 'blue',
  }
}

function toggleStringValue<T extends string>(values: T[], value: T) {
  const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
  return next.length ? next : [value]
}

function RoleManagementPanel({
  roles,
  permissionKeys,
  onRolesChange,
}: {
  roles: RoleDefinition[]
  permissionKeys: string[]
  onRolesChange: (
    updater: RoleDefinition[] | ((previous: RoleDefinition[]) => RoleDefinition[]),
    log?: { action: RoleChangeLog['action']; roleName: string; detail: string }
  ) => void
}) {
  const { can } = usePermissions()
  const [mode, setMode] = useState<'create' | 'edit' | null>(null)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [draft, setDraft] = useState<RoleDraft>(createDraft())
  const [selectedTemplateId, setSelectedTemplateId] = useState(roleTemplates[0]?.id ?? '')
  const [pendingDeleteRole, setPendingDeleteRole] = useState<RoleDefinition | null>(null)
  const editingRole = roles.find((role) => role.id === editingRoleId) ?? null

  const closeForm = () => {
    setMode(null)
    setEditingRoleId(null)
    setDraft(createDraft())
  }

  const openEdit = (role: RoleDefinition) => {
    setMode('edit')
    setEditingRoleId(role.id)
    setDraft(createDraft(role))
  }

  const buildRole = (roleId: string, isSystem: boolean) => {
    const permissions = createPermissionState(draft.defaultPermissions, [
      { category: 'Dynamic', permissions: permissionKeys.map((key) => ({ key, label: key, description: key })) },
    ])
    permissions.FORCE_LOGOUT = draft.level !== 'Custom'
    permissions.VIEW_AUDIT = Boolean(permissions.VIEW_AUDIT_LOG)
    permissions.REPORTS_VIEW = Boolean(permissions.EXPORT_REPORTS)
    permissions.ANALYTICS_VIEW = Boolean(permissions.EXPORT_REPORTS)
    permissions.USER_IMPERSONATE = draft.level === 'Super Admin'

    return {
      id: roleId,
      key: draft.key.trim().toUpperCase().replace(/\s+/g, '_'),
      name: draft.name.trim(),
      description: draft.description.trim(),
      level: draft.level,
      owner: draft.owner.trim(),
      members: editingRole?.members ?? 0,
      policy: draft.policy.trim() || 'Custom RBAC policy',
      departmentAccess: draft.departmentAccess,
      campusAccess: draft.campusAccess,
      defaultPermissions: draft.defaultPermissions,
      priority: draft.priority,
      isSystem,
      isActive: draft.isActive,
      badgeColor: draft.badgeColor,
      conflictStatus: draft.defaultPermissions.includes('ROLE_DELETE') ? 'Needs Review' : 'Clear',
      permissions,
      coverage: calculateCoverage(permissions, permissionKeys),
    } satisfies RoleDefinition
  }

  const saveRole = () => {
    if (!draft.name.trim() || !draft.key.trim()) {
      return
    }

    if (mode === 'edit' && editingRole) {
      const updatedRole = buildRole(editingRole.id, editingRole.isSystem)
      onRolesChange(
        (previous) => previous.map((role) => (role.id === editingRole.id ? updatedRole : role)),
        { action: 'Role edited', roleName: updatedRole.name, detail: 'Role details and access scope updated.' }
      )
    } else {
      const createdRole = buildRole(`ROLE-${String(roles.length + 1).padStart(2, '0')}`, false)
      onRolesChange((previous) => [createdRole, ...previous], {
        action: 'Role created',
        roleName: createdRole.name,
        detail: 'New role created from the role management console.',
      })
    }

    closeForm()
  }

  const cloneRole = (role: RoleDefinition) => {
    const clone = {
      ...role,
      id: `ROLE-${String(roles.length + 1).padStart(2, '0')}`,
      key: `${role.key}_COPY`,
      name: `${role.name} Copy`,
      isSystem: false,
      members: 0,
    }
    onRolesChange((previous) => [clone, ...previous], {
      action: 'Role cloned',
      roleName: clone.name,
      detail: `Cloned from ${role.name}.`,
    })
  }

  const importTemplate = () => {
    const template = roleTemplates.find((item) => item.id === selectedTemplateId)
    if (!template) return
    onRolesChange((previous) => [{ ...template, id: `ROLE-${String(previous.length + 1).padStart(2, '0')}`, name: `${template.name} ${previous.length}` }, ...previous], {
      action: 'Template imported',
      roleName: template.name,
      detail: 'Role imported from template library.',
    })
  }

  const confirmDelete = () => {
    if (!pendingDeleteRole) return
    onRolesChange((previous) => previous.filter((role) => role.id !== pendingDeleteRole.id), {
      action: 'Role deleted',
      roleName: pendingDeleteRole.name,
      detail: 'Role deleted after admin confirmation.',
    })
    setPendingDeleteRole(null)
  }

  return (
    <DataPanel
      title="Role Management"
      action={
        can('ROLE_EDIT') ? (
          <div className="flex flex-wrap gap-2">
            <select value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none">
              {roleTemplates.map((template) => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
            <button onClick={importTemplate} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">Import Template</button>
            <button onClick={() => { setMode('create'); setEditingRoleId(null); setDraft(createDraft()) }} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">Create Role</button>
          </div>
        ) : null
      }
    >
      {can('ROLE_EDIT') && mode ? (
        <div className="mb-6 rounded-[1.35rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)] p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{mode === 'create' ? 'Create Role' : 'Edit Role'}</h3>
              <p className="mt-1 text-sm text-slate-500">Configure role metadata and access boundaries.</p>
            </div>
            <button onClick={closeForm} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>
          </div>

          <div className="mt-5 grid gap-4 min-[1700px]:grid-cols-2">
            <label className="text-sm text-slate-600"><span className="mb-2 block font-medium">Role Name</span><input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none" /></label>
            <label className="text-sm text-slate-600"><span className="mb-2 block font-medium">Role Key</span><input value={draft.key} onChange={(e) => setDraft((p) => ({ ...p, key: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none" /></label>
            <label className="text-sm text-slate-600 md:col-span-2"><span className="mb-2 block font-medium">Description</span><textarea rows={3} value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none" /></label>
            <label className="text-sm text-slate-600"><span className="mb-2 block font-medium">Role Level</span><select value={draft.level} onChange={(e) => setDraft((p) => ({ ...p, level: e.target.value as RoleLevel }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none">{roleLevels.map((level) => <option key={level} value={level}>{level}</option>)}</select></label>
            <label className="text-sm text-slate-600"><span className="mb-2 block font-medium">Role Priority</span><input type="number" min="1" max="10" value={draft.priority} onChange={(e) => setDraft((p) => ({ ...p, priority: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none" /></label>
            <label className="text-sm text-slate-600"><span className="mb-2 block font-medium">Campus Access</span><div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4">{campusOptions.map((campus) => <label key={campus} className="flex items-center justify-between gap-3 text-sm"><span>{campus}</span><input type="checkbox" checked={draft.campusAccess.includes(campus)} onChange={() => setDraft((p) => ({ ...p, campusAccess: toggleStringValue(p.campusAccess, campus) }))} /></label>)}</div></label>
            <label className="text-sm text-slate-600"><span className="mb-2 block font-medium">Department Access</span><div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4">{departmentOptions.map((department) => <label key={department} className="flex items-center justify-between gap-3 text-sm"><span>{department}</span><input type="checkbox" checked={draft.departmentAccess.includes(department)} onChange={() => setDraft((p) => ({ ...p, departmentAccess: toggleStringValue(p.departmentAccess, department) }))} /></label>)}</div></label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <label className="flex items-center gap-2"><input type="checkbox" checked={draft.isActive} onChange={() => setDraft((p) => ({ ...p, isActive: !p.isActive }))} /> Active Role</label>
              <span>{draft.defaultPermissions.length} default permissions</span>
            </div>
            <button onClick={saveRole} className="rounded-xl bg-[rgb(var(--color-primary))] px-5 py-2.5 text-sm font-semibold text-white">{mode === 'create' ? 'Create Role' : 'Save Changes'}</button>
          </div>
        </div>
      ) : null}

      <div className="space-y-4 min-[1650px]:pr-2">
        {roles.map((role) => (
          <article key={role.id} className="rounded-[1.2rem] border border-[rgba(120,142,179,0.4)] bg-[linear-gradient(180deg,#fdfefe_0%,#eef3fb_100%)] p-5 shadow-sm transition duration-300 hover:-translate-y-0.5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-slate-900">{role.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[role.badgeColor]}`}>{role.level}</span>
                  <Badge label={role.isSystem ? 'System' : 'Custom'} tone={role.isSystem ? 'info' : 'success'} />
                  <Badge label={role.isActive ? 'Active' : 'Inactive'} tone={role.isActive ? 'success' : 'warning'} />
                </div>
                <p className="text-sm text-slate-600">{role.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>Priority {role.priority}</span>
                  <span>Owner {role.owner}</span>
                  <span>{role.members} assigned users</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge label={role.conflictStatus} tone={role.conflictStatus === 'Clear' ? 'success' : 'warning'} />
                {can('ROLE_EDIT') ? <button onClick={() => openEdit(role)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">Edit Role</button> : null}
                {can('ROLE_EDIT') ? <button onClick={() => cloneRole(role)} className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Clone Role</button> : null}
                {can('ROLE_EDIT') ? <button onClick={() => setPendingDeleteRole(role)} className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">Delete Role</button> : null}
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
              <div><p className="font-medium text-slate-700">Department Access</p><p className="mt-1">{role.departmentAccess.join(', ')}</p></div>
              <div><p className="font-medium text-slate-700">Campus Access</p><p className="mt-1">{role.campusAccess.join(', ')}</p></div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-700">Permission Coverage</span><span className="text-slate-500">{role.coverage}%</span></div>
              <div className="mt-2 h-2.5 rounded-full bg-slate-200"><div className="h-2.5 rounded-full bg-[linear-gradient(90deg,#3157a3_0%,#4b77d1_100%)]" style={{ width: `${role.coverage}%` }} /></div>
            </div>
          </article>
        ))}
      </div>

      {pendingDeleteRole ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-md rounded-[1.35rem] bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Role</h3>
            <p className="mt-2 text-sm text-slate-500">Delete <span className="font-semibold text-slate-700">{pendingDeleteRole.name}</span>? This action cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setPendingDeleteRole(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
              <button onClick={confirmDelete} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Confirm Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </DataPanel>
  )
}

export default RoleManagementPanel
