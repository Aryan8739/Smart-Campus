import { createPortal } from 'react-dom'
import type { ComplaintRecord } from '../../features/userAccess/types'
import type { VendorManagementRecord } from '../../services/vendorService'

function VendorAssignmentModal({
  isOpen,
  complaints,
  vendors,
  selectedComplaintId,
  selectedVendorId,
  onComplaintChange,
  onVendorChange,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  complaints: ComplaintRecord[]
  vendors: VendorManagementRecord[]
  selectedComplaintId: string
  selectedVendorId: string
  onComplaintChange: (id: string) => void
  onVendorChange: (id: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-2xl rounded-[1.6rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Assign Work</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Select a complaint and assign it to an active vendor from this panel.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Complaint</span>
            <select
              value={selectedComplaintId}
              onChange={(event) => onComplaintChange(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
            >
              {complaints.map((complaint) => (
                <option key={complaint.id} value={complaint.id}>
                  {complaint.id} - {complaint.title}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Vendor</span>
            <select
              value={selectedVendorId}
              onChange={(event) => onVendorChange(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
            >
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default VendorAssignmentModal
