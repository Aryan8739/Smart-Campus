import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import DataPanel from '../../components/common/DataPanel'
import VendorCard from '../../components/vendor/VendorCard'
import VendorDetailModal from '../../components/vendor/VendorDetailModal'
import VendorFilters, { type VendorFilterState } from '../../components/vendor/VendorFilters'
import VendorFormModal from '../../components/vendor/VendorFormModal'
import VendorInsightsPanel from '../../components/vendor/VendorInsightsPanel'
import VendorTable from '../../components/vendor/VendorTable'
import VendorAssignmentModal from '../../components/vendor/VendorAssignmentModal'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'
import {
  buildVendorRecords,
  getEmptyVendorForm,
  getVendorAlerts,
  type VendorFormValues,
  type VendorManagementRecord,
} from '../../services/vendorService'
import type { ComplaintRecord, VendorRecord } from '../../features/userAccess/types'

const defaultFilters: VendorFilterState = {
  category: 'All',
  slaRange: 'All',
  status: 'All',
  campus: 'All',
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  return /^[+\d][\d\s-]{9,}$/.test(value)
}

function VendorOverview() {
  const { vendors, complaints, technicians } = useAdminModule()
  const { can } = usePermissions()
  const initialVendorItems = useMemo(
    () => buildVendorRecords(vendors, complaints, technicians),
    [vendors, complaints, technicians]
  )
  const viewKey = useMemo(
    () =>
      [
        vendors.map((vendor) => `${vendor.id}:${vendor.name}:${vendor.campus}:${vendor.activeTickets}:${vendor.slaScore}`).join(','),
        complaints.map((complaint) => `${complaint.id}:${complaint.status}:${complaint.vendor}:${complaint.technician}`).join(','),
        technicians.map((technician) => `${technician.id}:${technician.name}:${technician.campus}`).join(','),
      ].join('|'),
    [vendors, complaints, technicians]
  )

  return (
    <VendorOverviewContent
      key={viewKey}
      baseVendors={vendors}
      initialComplaintItems={complaints}
      initialVendorItems={initialVendorItems}
      canAssignComplaints={can('COMPLAINT_ASSIGN')}
      canCreateVendor={can('VENDOR_CREATE')}
    />
  )
}

function VendorOverviewContent({
  baseVendors,
  initialComplaintItems,
  initialVendorItems,
  canAssignComplaints,
  canCreateVendor,
}: {
  baseVendors: VendorRecord[]
  initialComplaintItems: ComplaintRecord[]
  initialVendorItems: VendorManagementRecord[]
  canAssignComplaints: boolean
  canCreateVendor: boolean
}) {
  const [vendorItems, setVendorItems] = useState(initialVendorItems)
  const [complaintItems, setComplaintItems] = useState(initialComplaintItems)
  const [filters, setFilters] = useState<VendorFilterState>(defaultFilters)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [detailVendorId, setDetailVendorId] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null)
  const [formValue, setFormValue] = useState<VendorFormValues>(getEmptyVendorForm())
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof VendorFormValues, string>>>({})
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null)
  const [deleteVendorId, setDeleteVendorId] = useState<string | null>(null)
  const [deleteBlockedMessage, setDeleteBlockedMessage] = useState<string | null>(null)
  const [assignmentVendorId, setAssignmentVendorId] = useState<string | null>(null)
  const [selectedComplaintId, setSelectedComplaintId] = useState('')

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setFeedback(null), 3400)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const filteredVendors = useMemo(() => {
    return vendorItems.filter((vendor) => {
      const categoryMatch = filters.category === 'All' || vendor.category.includes(filters.category)
      const statusMatch = filters.status === 'All' || vendor.status === filters.status
      const campusMatch = filters.campus === 'All' || vendor.campus === filters.campus
      const slaMatch =
        filters.slaRange === 'All' ||
        (filters.slaRange === '95+' && vendor.slaScore >= 95) ||
        (filters.slaRange === '90-94' && vendor.slaScore >= 90 && vendor.slaScore < 95) ||
        (filters.slaRange === 'Below 90' && vendor.slaScore < 90)

      return categoryMatch && statusMatch && campusMatch && slaMatch
    })
  }, [filters, vendorItems])

  const activeAlerts = useMemo(
    () => filteredVendors.flatMap((vendor) => getVendorAlerts(vendor).map((alert) => `${vendor.name}: ${alert}`)),
    [filteredVendors]
  )

  const sortedByPerformance = useMemo(
    () => [...filteredVendors].sort((left, right) => right.slaScore - left.slaScore || right.rating - left.rating),
    [filteredVendors]
  )

  const topPerformers = sortedByPerformance.slice(0, 3).map((vendor) => vendor.name)
  const lowPerformers = [...sortedByPerformance].reverse().slice(0, 3).map((vendor) => vendor.name)

  const smartInsights = useMemo(() => {
    const insights: string[] = []
    const slaDropped = filteredVendors.find((vendor) => vendor.slaScore < 90)
    if (slaDropped) insights.push(`${slaDropped.name} SLA dropped to ${slaDropped.slaScore}%, review contract performance.`)

    const workloadRisk = filteredVendors.find((vendor) => vendor.pendingTickets >= 8)
    if (workloadRisk) insights.push(`${workloadRisk.name} shows complaint load imbalance with ${workloadRisk.pendingTickets} pending tickets.`)

    const technicianGap = filteredVendors.find((vendor) => vendor.assignedTechnicians.length === 0)
    if (technicianGap) insights.push(`${technicianGap.name} has high delay risk because no technicians are currently mapped.`)

    return insights.length ? insights : ['Vendor performance is currently stable across tracked campuses.']
  }, [filteredVendors])

  const detailVendor = vendorItems.find((vendor) => vendor.id === detailVendorId) ?? null
  const deleteVendor = vendorItems.find((vendor) => vendor.id === deleteVendorId) ?? null
  const assignableComplaints = useMemo(
    () => complaintItems.filter((complaint) => complaint.status !== 'Resolved'),
    [complaintItems]
  )

  const assignableVendors = useMemo(
    () => vendorItems.filter((vendor) => vendor.status !== 'Suspended'),
    [vendorItems]
  )

  const openAddVendor = () => {
    setFormMode('add')
    setEditingVendorId(null)
    setFormErrors({})
    setFormValue(getEmptyVendorForm())
  }

  const openEditVendor = (vendor: VendorManagementRecord) => {
    setFormMode('edit')
    setEditingVendorId(vendor.id)
    setFormErrors({})
    setFormValue({
      name: vendor.name,
      category: vendor.category.includes('Electrical')
        ? 'Electrical'
        : vendor.category.includes('Civil')
          ? 'Civil'
          : vendor.category.includes('HVAC')
            ? 'HVAC'
            : vendor.category.includes('IT')
              ? 'IT'
              : 'Security',
      contactPerson: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      serviceArea: vendor.serviceArea,
      campus: vendor.campus,
      slaAgreement: String(vendor.slaScore),
      status: vendor.status === 'Under Review' ? 'Pending' : vendor.status,
    })
  }

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof VendorFormValues, string>> = {}
    if (!formValue.name.trim()) nextErrors.name = 'Vendor name is required.'
    if (!formValue.contactPerson.trim()) nextErrors.contactPerson = 'Contact person is required.'
    if (!formValue.phone.trim()) nextErrors.phone = 'Phone number is required.'
    else if (!isValidPhone(formValue.phone)) nextErrors.phone = 'Enter a valid phone number.'
    if (!formValue.email.trim()) nextErrors.email = 'Email is required.'
    else if (!isValidEmail(formValue.email)) nextErrors.email = 'Enter a valid email address.'
    if (!formValue.serviceArea.trim()) nextErrors.serviceArea = 'Service area is required.'
    if (!formValue.slaAgreement.trim()) nextErrors.slaAgreement = 'SLA agreement is required.'
    else if (Number.isNaN(Number(formValue.slaAgreement)) || Number(formValue.slaAgreement) < 1 || Number(formValue.slaAgreement) > 100) {
      nextErrors.slaAgreement = 'SLA must be between 1 and 100.'
    }
    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmitVendor = () => {
    if (!validateForm()) return

    if (formMode === 'add') {
      const nextVendor: VendorManagementRecord = {
        id: `VEN-${Date.now()}`,
        name: formValue.name.trim(),
        category: formValue.category,
        campus: formValue.campus,
        activeTickets: 0,
        completedTickets: 0,
        pendingTickets: 0,
        slaScore: Number(formValue.slaAgreement),
        lastAudit: 'Today',
        averageResolutionTime: 'Not enough data',
        rating: 4.0,
        status: formValue.status,
        contactPerson: formValue.contactPerson.trim(),
        phone: formValue.phone.trim(),
        email: formValue.email.trim(),
        serviceArea: formValue.serviceArea.trim(),
        assignedTechnicians: [],
        complaintHistory: [],
      }
      setVendorItems((previous) => [nextVendor, ...previous])
      setFeedback(`${nextVendor.name} added successfully.`)
    }

    if (formMode === 'edit' && editingVendorId) {
      setVendorItems((previous) =>
        previous.map((vendor) =>
          vendor.id === editingVendorId
            ? {
                ...vendor,
                name: formValue.name.trim(),
                category: formValue.category,
                campus: formValue.campus,
                contactPerson: formValue.contactPerson.trim(),
                phone: formValue.phone.trim(),
                email: formValue.email.trim(),
                serviceArea: formValue.serviceArea.trim(),
                slaScore: Number(formValue.slaAgreement),
                status: formValue.status,
              }
            : vendor
        )
      )
      setFeedback(`${formValue.name.trim()} updated successfully.`)
    }

    setFormMode(null)
    setEditingVendorId(null)
  }

  const handleSuspendVendor = (vendor: VendorManagementRecord) => {
    setVendorItems((previous) =>
      previous.map((item) =>
        item.id === vendor.id
          ? { ...item, status: item.status === 'Suspended' ? 'Active' : 'Suspended' }
          : item
      )
    )
    setFeedback(
      vendor.status === 'Suspended'
        ? `${vendor.name} restored to active assignment.`
        : `${vendor.name} suspended. New complaints cannot be assigned.`
    )
  }

  const handleDeleteRequest = (vendor: VendorManagementRecord) => {
    const hasActiveComplaints = complaintItems.some(
      (complaint) => complaint.vendor === vendor.name && complaint.status !== 'Resolved'
    )

    if (hasActiveComplaints) {
      setDeleteBlockedMessage('This vendor has active complaints. Reassign them before deletion.')
      return
    }

    setDeleteVendorId(vendor.id)
  }

  const handleDeleteConfirm = () => {
    if (!deleteVendor) return
    setVendorItems((previous) => previous.filter((vendor) => vendor.id !== deleteVendor.id))
    setComplaintItems((previous) =>
      previous.map((complaint) =>
        complaint.vendor === deleteVendor.name ? { ...complaint, vendor: 'Unassigned' } : complaint
      )
    )
    setFeedback(`${deleteVendor.name} deleted successfully.`)
    setDeleteVendorId(null)
    if (detailVendorId === deleteVendor.id) setDetailVendorId(null)
  }

  const openAssignmentModal = (vendor?: VendorManagementRecord) => {
    setAssignmentVendorId(vendor?.id ?? assignableVendors[0]?.id ?? null)
    setSelectedComplaintId(assignableComplaints[0]?.id ?? '')
  }

  const handleAssignmentConfirm = () => {
    if (!selectedComplaintId || !assignmentVendorId) return
    const vendor = vendorItems.find((item) => item.id === assignmentVendorId)
    if (!vendor || vendor.status === 'Suspended') {
      setFeedback('Suspended vendors cannot receive new complaints.')
      setAssignmentVendorId(null)
      return
    }

    setComplaintItems((previous) =>
      previous.map((complaint) =>
        complaint.id === selectedComplaintId
          ? { ...complaint, vendor: vendor.name, status: 'Assigned', technician: vendor.assignedTechnicians[0]?.name ?? complaint.technician }
          : complaint
      )
    )
    setVendorItems((previous) =>
      previous.map((item) =>
        item.id === vendor.id
          ? {
              ...item,
              activeTickets: item.activeTickets + 1,
              pendingTickets: item.pendingTickets + 1,
              complaintHistory: [
                {
                  id: selectedComplaintId,
                  title: complaintItems.find((complaint) => complaint.id === selectedComplaintId)?.title ?? 'Assigned complaint',
                  status: 'Assigned',
                  priority: complaintItems.find((complaint) => complaint.id === selectedComplaintId)?.priority ?? 'Medium',
                  createdDate: complaintItems.find((complaint) => complaint.id === selectedComplaintId)?.createdDate ?? 'Today',
                },
                ...item.complaintHistory,
              ],
            }
          : item
      )
    )
    setFeedback(`Complaint ${selectedComplaintId} assigned to ${vendor.name}.`)
    setAssignmentVendorId(null)
  }

  return (
    <section className="space-y-6">
      <DataPanel
        title="Vendor Overview"
        action={
          <div className="flex flex-wrap gap-2">
            {canAssignComplaints ? (
              <button onClick={() => openAssignmentModal()} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
                Assign Work
              </button>
            ) : null}
            {canCreateVendor ? (
              <button onClick={openAddVendor} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
                + Add Vendor
              </button>
            ) : null}
          </div>
        }
      >
        {feedback ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedback}
          </div>
        ) : null}

        <VendorFilters filters={filters} onChange={setFilters} />

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.2rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Vendor Alerts</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeAlerts.length ? activeAlerts.map((alert) => (
                <span key={alert} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                  {alert}
                </span>
              )) : (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                  No active vendor alerts
                </span>
              )}
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Control Summary</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--bg-primary)] p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Tracked Vendors</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{filteredVendors.length}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-primary)] p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Avg. SLA</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                  {filteredVendors.length ? Math.round(filteredVendors.reduce((sum, vendor) => sum + vendor.slaScore, 0) / filteredVendors.length) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onViewDetails={() => setDetailVendorId(vendor.id)}
              onAssignWork={() => openAssignmentModal(vendor)}
              onEdit={() => openEditVendor(vendor)}
              onSuspend={() => handleSuspendVendor(vendor)}
              onDelete={() => handleDeleteRequest(vendor)}
            />
          ))}
        </div>
      </DataPanel>

      <VendorInsightsPanel smartInsights={smartInsights} topPerformers={topPerformers} lowPerformers={lowPerformers} />

      <DataPanel title="Vendor Table View">
        <VendorTable
          vendors={filteredVendors}
          onViewDetails={(vendor) => setDetailVendorId(vendor.id)}
          onAssignWork={(vendor) => openAssignmentModal(vendor)}
          onEdit={openEditVendor}
          onSuspend={handleSuspendVendor}
          onDelete={handleDeleteRequest}
        />
      </DataPanel>

      <VendorDetailModal
        vendor={detailVendor}
        onClose={() => setDetailVendorId(null)}
        onAssignWork={(vendor) => openAssignmentModal(vendor)}
      />

      {formMode ? (
        <VendorFormModal
          mode={formMode}
          value={formValue}
          errors={formErrors}
          onChange={setFormValue}
          onClose={() => setFormMode(null)}
          onSubmit={handleSubmitVendor}
        />
      ) : null}

      <VendorAssignmentModal
        isOpen={Boolean(assignmentVendorId)}
        complaints={assignableComplaints}
        vendors={assignableVendors}
        selectedComplaintId={selectedComplaintId}
        selectedVendorId={assignmentVendorId ?? ''}
        onComplaintChange={setSelectedComplaintId}
        onVendorChange={setAssignmentVendorId}
        onClose={() => setAssignmentVendorId(null)}
        onConfirm={handleAssignmentConfirm}
      />

      {deleteBlockedMessage ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Delete blocked</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{deleteBlockedMessage}</p>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setDeleteBlockedMessage(null)} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {deleteVendor ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Delete vendor</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Are you sure you want to delete this vendor? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setDeleteVendorId(null)} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">
                Delete Vendor
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      <DataPanel title="Existing Vendor Snapshot">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {baseVendors.map((vendor) => (
            <div key={vendor.id} className="rounded-[1.1rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 shadow-sm">
              <p className="font-semibold text-[var(--text-primary)]">{vendor.name}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{vendor.category}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <span>{vendor.activeTickets} active tickets</span>
                <span>{vendor.slaScore}% SLA</span>
              </div>
            </div>
          ))}
        </div>
      </DataPanel>
    </section>
  )
}

export default VendorOverview
