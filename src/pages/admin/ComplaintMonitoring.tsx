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

const departmentOptions = [
  'IT Infrastructure',
  'Security Operations',
  'Civil Works',
  'Electrical Maintenance',
  'AV Support',
  'Plumbing Maintenance',
]

function nextComplaintId(complaints: ComplaintRecord[]) {
  const maxId = complaints.reduce((current, complaint) => {
    const match = /^CMP-(\d+)$/.exec(complaint.id)
    return Math.max(current, match ? Number(match[1]) : 0)
  }, 2000)

  return `CMP-${maxId + 1}`
}

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value)
}

function ComplaintMonitoring() {
  const { complaints, setComplaints, filters, setFilters, vendors, technicians } = useAdminModule()
  const { can } = usePermissions()
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedComplaintId, setSelectedComplaintId] = useState('')
  const [selectedVendor, setSelectedVendor] = useState('')
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error'>('success')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    issueArea: 'IT Infrastructure',
    department: 'IT Infrastructure',
    campus: 'Campus' as ComplaintRecord['campus'],
    priority: 'Medium' as ComplaintRecord['priority'],
    vendor: 'Unassigned',
    technician: 'Unassigned',
  })

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setFeedback(null), 3200)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const showSuccess = (message: string) => {
    setFeedbackTone('success')
    setFeedback(message)
  }

  const showError = (message: string) => {
    setFeedbackTone('error')
    setFeedback(message)
  }

  const assignableComplaints = useMemo(
    () => complaints.filter((complaint) => complaint.status !== 'Resolved'),
    [complaints]
  )

  const openAssignModal = () => {
    const defaultComplaint = assignableComplaints[0]
    setSelectedComplaintId(defaultComplaint?.id ?? '')
    setSelectedVendor(defaultComplaint?.vendor ?? vendors[0]?.name ?? '')
    setSelectedTechnician(defaultComplaint?.technician ?? technicians[0]?.name ?? '')
    setIsAssignOpen(true)
  }

  const openCreateModal = () => {
    setCreateForm((previous) => ({
      ...previous,
      vendor: vendors[0]?.name ?? 'Unassigned',
      technician: technicians[0]?.name ?? 'Unassigned',
    }))
    setIsCreateOpen(true)
  }

  const selectedComplaint = complaints.find((complaint) => complaint.id === selectedComplaintId) ?? null

  const handleComplaintChange = (complaintId: string) => {
    const complaint = complaints.find((item) => item.id === complaintId)
    setSelectedComplaintId(complaintId)
    setSelectedVendor(complaint?.vendor ?? vendors[0]?.name ?? '')
    setSelectedTechnician(complaint?.technician ?? technicians[0]?.name ?? '')
  }

  const handleAssignConfirm = () => {
    if (!selectedComplaintId || !selectedVendor || !selectedTechnician) {
      showError('Select complaint, vendor, and technician before assigning.')
      setIsAssignOpen(false)
      return
    }

    setComplaints((previous) =>
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

    showSuccess(`Complaint ${selectedComplaintId} assigned to ${selectedTechnician}.`)
    setIsAssignOpen(false)
  }

  const handleCreateComplaint = async () => {
    const title = createForm.title.trim()
    const description = createForm.description.trim()

    if (!title || !description) {
      showError('Please fill complaint title and details before creating.')
      return
    }

    setIsCreating(true)

    try {
      const newComplaint: ComplaintRecord = {
        id: nextComplaintId(complaints),
        title,
        description,
        issueArea: createForm.issueArea,
        campus: createForm.campus,
        department: createForm.department,
        status: 'New',
        priority: createForm.priority,
        vendor: createForm.vendor || 'Unassigned',
        technician: createForm.technician || 'Unassigned',
        createdDate: formatDateLabel(new Date()),
      }

      setComplaints((previous) => [newComplaint, ...previous])
      if (filters.complaintStatus !== 'All') {
        setFilters((previous) => ({ ...previous, complaintStatus: 'All' }))
      }

      showSuccess(`Complaint ${newComplaint.id} created successfully.`)
      setIsCreateOpen(false)
      setCreateForm((previous) => ({
        ...previous,
        title: '',
        description: '',
        issueArea: 'IT Infrastructure',
        department: 'IT Infrastructure',
        campus: 'Campus',
        priority: 'Medium',
      }))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <section>
      <DataPanel
        title="Complaint Management"
        action={
          <div className="flex flex-wrap gap-2">
            {can('COMPLAINT_VIEW') ? (
              <button
                onClick={openCreateModal}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Create Complaint
              </button>
            ) : null}
            {can('COMPLAINT_ASSIGN') ? (
              <button
                onClick={openAssignModal}
                className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white"
              >
                Assign Complaint
              </button>
            ) : null}
          </div>
        }
      >
        {feedback ? (
          <div className={`mb-4 rounded-2xl px-4 py-3 text-sm font-medium ${
            feedbackTone === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-rose-200 bg-rose-50 text-rose-700'
          }`}>
            {feedback}
          </div>
        ) : null}

        {filters.complaintStatus !== 'All' ? (
          <div className="mb-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-secondary)]">
            Active complaint status filter: <span className="font-semibold text-[var(--text-primary)]">{filters.complaintStatus}</span>
          </div>
        ) : null}

        <div className="space-y-3">
          {complaints.map((complaint) => (
            <article
              key={complaint.id}
              className="rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{complaint.title}</p>
                  {complaint.description ? (
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{complaint.description}</p>
                  ) : null}
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {complaint.id} • {complaint.department} • {complaint.campus}
                  </p>
                  {complaint.issueArea ? (
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">For: {complaint.issueArea}</p>
                  ) : null}
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
          {complaints.length === 0 ? (
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

      {isCreateOpen ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4 py-8">
          <div className="w-full max-w-4xl rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Create Complaint</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Add complaint details including what the issue is and what area it is related to.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm text-[var(--text-secondary)] md:col-span-2">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Complaint Title</span>
                <input
                  value={createForm.title}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, title: event.target.value }))}
                  placeholder="Example: Main gate access scanner not working"
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                />
              </label>

              <label className="text-sm text-[var(--text-secondary)] md:col-span-2">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Complaint Details</span>
                <textarea
                  value={createForm.description}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, description: event.target.value }))}
                  rows={3}
                  placeholder="Describe what complaint is and what exactly is required."
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                />
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Issue For</span>
                <select
                  value={createForm.issueArea}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, issueArea: event.target.value }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  {departmentOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Department</span>
                <select
                  value={createForm.department}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, department: event.target.value }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  {departmentOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Campus</span>
                <select
                  value={createForm.campus}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, campus: event.target.value as ComplaintRecord['campus'] }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  <option value="Campus">Campus</option>
                  <option value="North Campus">North Campus</option>
                  <option value="Research Park">Research Park</option>
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Priority</span>
                <select
                  value={createForm.priority}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, priority: event.target.value as ComplaintRecord['priority'] }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Vendor</span>
                <select
                  value={createForm.vendor}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, vendor: event.target.value }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  <option value="Unassigned">Unassigned</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-[var(--text-secondary)]">
                <span className="mb-2 block font-medium text-[var(--text-primary)]">Technician</span>
                <select
                  value={createForm.technician}
                  onChange={(event) => setCreateForm((previous) => ({ ...previous, technician: event.target.value }))}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] outline-none"
                >
                  <option value="Unassigned">Unassigned</option>
                  {technicians.map((technician) => (
                    <option key={technician.id} value={technician.name}>{technician.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateComplaint}
                disabled={isCreating}
                className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreating ? 'Creating...' : 'Create Complaint'}
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
