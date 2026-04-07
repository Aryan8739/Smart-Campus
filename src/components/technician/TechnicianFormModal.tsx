import { createPortal } from 'react-dom'
import type { TechnicianFormValues } from '../../services/technicianService'
import { technicianSkillOptions } from '../../services/technicianService'

function TechnicianFormModal({
  mode,
  value,
  errors,
  vendors,
  departments,
  onChange,
  onClose,
  onSubmit,
}: {
  mode: 'add' | 'edit'
  value: TechnicianFormValues
  errors: Partial<Record<keyof TechnicianFormValues, string>>
  vendors: string[]
  departments: string[]
  onChange: (next: TechnicianFormValues) => void
  onClose: () => void
  onSubmit: () => void
}) {
  const fieldClassName =
    'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[rgb(var(--color-primary))]'

  return createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-3xl rounded-[1.6rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">{mode === 'add' ? 'Add Technician' : 'Edit Technician'}</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Name</span>
            <input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} className={fieldClassName} />
            {errors.name ? <span className="mt-1 block text-xs text-rose-600">{errors.name}</span> : null}
          </label>
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Department</span>
            <select value={value.department} onChange={(e) => onChange({ ...value, department: e.target.value })} className={fieldClassName}>
              {departments.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Skill</span>
            <select value={value.skill} onChange={(e) => onChange({ ...value, skill: e.target.value })} className={fieldClassName}>
              {technicianSkillOptions.map((skill) => <option key={skill} value={skill}>{skill}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Phone</span>
            <input value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} className={fieldClassName} />
            {errors.phone ? <span className="mt-1 block text-xs text-rose-600">{errors.phone}</span> : null}
          </label>
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Email</span>
            <input value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} className={fieldClassName} />
            {errors.email ? <span className="mt-1 block text-xs text-rose-600">{errors.email}</span> : null}
          </label>
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Assigned Vendor</span>
            <select value={value.assignedVendor} onChange={(e) => onChange({ ...value, assignedVendor: e.target.value })} className={fieldClassName}>
              {vendors.map((vendor) => <option key={vendor} value={vendor}>{vendor}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--text-secondary)] md:col-span-2">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Availability Status</span>
            <select value={value.availabilityStatus} onChange={(e) => onChange({ ...value, availabilityStatus: e.target.value as TechnicianFormValues['availabilityStatus'] })} className={fieldClassName}>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Offline">Offline</option>
              <option value="Suspended">Suspended</option>
            </select>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Cancel</button>
          <button onClick={onSubmit} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">{mode === 'add' ? 'Add Technician' : 'Save Changes'}</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TechnicianFormModal
