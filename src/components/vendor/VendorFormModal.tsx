import { createPortal } from 'react-dom'
import type { VendorFormValues } from '../../services/vendorService'
import { vendorCategories } from '../../services/vendorService'

function VendorFormModal({
  mode,
  value,
  errors,
  onChange,
  onClose,
  onSubmit,
}: {
  mode: 'add' | 'edit'
  value: VendorFormValues
  errors: Partial<Record<keyof VendorFormValues, string>>
  onChange: (next: VendorFormValues) => void
  onClose: () => void
  onSubmit: () => void
}) {
  const fieldClassName =
    'w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[rgb(var(--color-primary))]'

  return createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-3xl rounded-[1.6rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
          {mode === 'add' ? 'Add Vendor' : 'Edit Vendor'}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {mode === 'add' ? 'Create a new vendor profile and onboarding record.' : 'Update vendor contact and SLA details.'}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Vendor Name</span>
            <input
              value={value.name}
              onChange={(event) => onChange({ ...value, name: event.target.value })}
              className={fieldClassName}
            />
            {errors.name ? <span className="mt-1 block text-xs text-rose-600">{errors.name}</span> : null}
          </label>

          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Category</span>
            <select
              value={value.category}
              onChange={(event) => onChange({ ...value, category: event.target.value })}
              className={fieldClassName}
            >
              {vendorCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Contact Person</span>
            <input
              value={value.contactPerson}
              onChange={(event) => onChange({ ...value, contactPerson: event.target.value })}
              className={fieldClassName}
            />
            {errors.contactPerson ? <span className="mt-1 block text-xs text-rose-600">{errors.contactPerson}</span> : null}
          </label>

          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Phone Number</span>
            <input
              value={value.phone}
              onChange={(event) => onChange({ ...value, phone: event.target.value })}
              className={fieldClassName}
            />
            {errors.phone ? <span className="mt-1 block text-xs text-rose-600">{errors.phone}</span> : null}
          </label>

          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Email</span>
            <input
              value={value.email}
              onChange={(event) => onChange({ ...value, email: event.target.value })}
              className={fieldClassName}
            />
            {errors.email ? <span className="mt-1 block text-xs text-rose-600">{errors.email}</span> : null}
          </label>

          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Service Area</span>
            <input
              value={value.serviceArea}
              onChange={(event) => onChange({ ...value, serviceArea: event.target.value })}
              className={fieldClassName}
            />
            {errors.serviceArea ? <span className="mt-1 block text-xs text-rose-600">{errors.serviceArea}</span> : null}
          </label>

          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Campus</span>
            <select
              value={value.campus}
              onChange={(event) => onChange({ ...value, campus: event.target.value as VendorFormValues['campus'] })}
              className={fieldClassName}
            >
              <option value="Main Campus">Main Campus</option>
              <option value="North Campus">North Campus</option>
              <option value="Research Park">Research Park</option>
            </select>
          </label>

          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">SLA Agreement (%)</span>
            <input
              value={value.slaAgreement}
              onChange={(event) => onChange({ ...value, slaAgreement: event.target.value })}
              className={fieldClassName}
            />
            {errors.slaAgreement ? <span className="mt-1 block text-xs text-rose-600">{errors.slaAgreement}</span> : null}
          </label>

          <label className="text-sm text-[var(--text-secondary)] md:col-span-2">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Status</span>
            <select
              value={value.status}
              onChange={(event) => onChange({ ...value, status: event.target.value as VendorFormValues['status'] })}
              className={fieldClassName}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
            Cancel
          </button>
          <button onClick={onSubmit} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
            {mode === 'add' ? 'Add Vendor' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default VendorFormModal
