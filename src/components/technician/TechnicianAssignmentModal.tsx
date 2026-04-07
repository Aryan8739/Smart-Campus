import { createPortal } from 'react-dom'
import type { ComplaintRecord } from '../../features/userAccess/types'
import type { TechnicianManagementRecord } from '../../services/technicianService'

function TechnicianAssignmentModal({
  isOpen,
  complaints,
  technicians,
  selectedComplaintId,
  selectedTechnicianId,
  onComplaintChange,
  onTechnicianChange,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  complaints: ComplaintRecord[]
  technicians: TechnicianManagementRecord[]
  selectedComplaintId: string
  selectedTechnicianId: string
  onComplaintChange: (value: string) => void
  onTechnicianChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-2xl rounded-[1.6rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Assign Task</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Select a complaint and assign it to a technician.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Complaint</span>
            <select value={selectedComplaintId} onChange={(e) => onComplaintChange(e.target.value)} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none">
              {complaints.map((complaint) => <option key={complaint.id} value={complaint.id}>{complaint.id} - {complaint.title}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--text-secondary)]">
            <span className="mb-2 block font-medium text-[var(--text-primary)]">Technician</span>
            <select value={selectedTechnicianId} onChange={(e) => onTechnicianChange(e.target.value)} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none">
              {technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">Confirm Assignment</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TechnicianAssignmentModal
