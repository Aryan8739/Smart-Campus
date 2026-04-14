import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import Badge from '../../components/common/Badge'
import DataPanel from '../../components/common/DataPanel'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'
import type { ComplaintRecord } from '../../features/userAccess/types'

const priorityTone = {
  High: 'danger',
  Medium: 'warning',
  Low: 'info',
} as const

const statusTone = {
  New: 'info',
  'In Review': 'warning',
  Assigned: 'info',
  Escalated: 'danger',
  Resolved: 'success',
} as const

function ComplaintMonitoring() {
  const { complaints, filters, vendors, technicians } = useAdminModule()
  const { can } = usePermissions()
  const [complaintItems, setComplaintItems] = useState(complaints)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [selectedComplaintId, setSelectedComplaintId] = useState('')
  const [selectedVendor, setSelectedVendor] = useState('')
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    setComplaintItems(complaints)
  }, [complaints])

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setFeedback(null), 3200)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const assignableComplaints = useMemo(
    () => complaintItems.filter((complaint) => complaint.status !== 'Resolved'),
    [complaintItems]
  )

  const openAssignModal = () => {
    const defaultComplaint = assignableComplaints[0]
    setSelectedComplaintId(defaultComplaint?.id ?? '')
    setSelectedVendor(defaultComplaint?.vendor ?? vendors[0]?.name ?? '')
    setSelectedTechnician(defaultComplaint?.technician ?? technicians[0]?.name ?? '')
    setIsAssignOpen(true)
  }

  const selectedComplaint = complaintItems.find((complaint) => complaint.id === selectedComplaintId) ?? null

  const handleComplaintChange = (complaintId: string) => {
    const complaint = complaintItems.find((item) => item.id === complaintId)
    setSelectedComplaintId(complaintId)
    setSelectedVendor(complaint?.vendor ?? vendors[0]?.name ?? '')
    setSelectedTechnician(complaint?.technician ?? technicians[0]?.name ?? '')
  }

  const handleAssignConfirm = () => {
    if (!selectedComplaintId || !selectedVendor || !selectedTechnician) {
      setFeedback('Select complaint, vendor, and technician before assigning.')
      setIsAssignOpen(false)
      return
    }

    setComplaintItems((previous) =>
      previous.map((complaint) =>
        complaint.id === selectedComplaintId
          ? {
              ...complaint,
              status: 'Assigned' as ComplaintRecord['status'],
              vendor: selectedVendor,
              technician: selectedTechnician,
            }
          : complaint
      )
    )

    setFeedback(`Complaint ${selectedComplaintId} assigned to ${selectedTechnician}.`)
    setIsAssignOpen(false)
  }

  return (
    <section>
      <DataPanel
        title="Complaint Monitoring"
        action={
          can('COMPLAINT_ASSIGN') ? (
            <button
              onClick={openAssignModal}
              className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white"
            >
              Assign Complaint
            </button>
          ) : null
        }
      >
        {feedback ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedback}
          </div>
        ) : null}

        {filters.complaintStatus !== 'All' ? (
          <div className="mb-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-secondary)]">
            Active complaint status filter: <span className="font-semibold text-[var(--text-primary)]">{filters.complaintStatus}</span>
          </div>
        ) : null}

        <div className="space-y-3">
          {complaintItems.map((complaint) => (
            <article
              key={complaint.id}
              className="rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{complaint.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {complaint.id} • {complaint.department} • {complaint.campus}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge label={complaint.priority} tone={priorityTone[complaint.priority]} />
                  <Badge label={complaint.status} tone={statusTone[complaint.status]} />
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-[var(--text-secondary)] md:grid-cols-3">
                <p>Vendor: {complaint.vendor}</p>
                <p>Technician: {complaint.technician}</p>
                <p>Created: {complaint.createdDate}</p>
              </div>
            </article>
          ))}
          {complaintItems.length === 0 ? (
            <div className="rounded-[1.1rem] border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              No complaints found for the current lifecycle filter.
            </div>
          ) : null}
        </div>
      </DataPanel>

      {isAssignOpen ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Assign Complaint</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Choose the complaint, vendor, and technician to move this item into active assignment.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Complaint</span>
                <select
                  value={selectedComplaintId}
                  onChange={(event) => handleComplaintChange(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  {assignableComplaints.map((complaint) => (
                    <option key={complaint.id} value={complaint.id}>
                      {complaint.id} - {complaint.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Vendor</span>
                <select
                  value={selectedVendor}
                  onChange={(event) => setSelectedVendor(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.name}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Technician</span>
                <select
                  value={selectedTechnician}
                  onChange={(event) => setSelectedTechnician(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  {technicians.map((technician) => (
                    <option key={technician.id} value={technician.name}>
                      {technician.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedComplaint ? (
              <div className="mt-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <p className="font-semibold text-[var(--text-primary)]">{selectedComplaint.title}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {selectedComplaint.id} • {selectedComplaint.department} • {selectedComplaint.campus}
                </p>
              </div>
            ) : null}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setIsAssignOpen(false)}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignConfirm}
                className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  )
}

export default ComplaintMonitoring
