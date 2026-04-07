import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import DataPanel from '../../components/common/DataPanel'
import TechnicianAssignmentModal from '../../components/technician/TechnicianAssignmentModal'
import TechnicianCard from '../../components/technician/TechnicianCard'
import TechnicianDetailModal from '../../components/technician/TechnicianDetailModal'
import TechnicianFilters, { type TechnicianFilterState } from '../../components/technician/TechnicianFilters'
import TechnicianFormModal from '../../components/technician/TechnicianFormModal'
import TechnicianInsightsPanel from '../../components/technician/TechnicianInsightsPanel'
import TechnicianTable from '../../components/technician/TechnicianTable'
import { useAdminModule } from '../../features/userAccess/hooks/useAdminModule'
import { usePermissions } from '../../features/userAccess/hooks/usePermissions'
import {
  buildTechnicianRecords,
  getEmptyTechnicianForm,
  getTechnicianAlerts,
  type TechnicianFormValues,
  type TechnicianManagementRecord,
} from '../../services/technicianService'

const defaultFilters: TechnicianFilterState = {
  skill: 'All',
  availability: 'All',
  department: 'All',
  vendor: 'All',
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  return /^[+\d][\d\s-]{9,}$/.test(value)
}

function TechnicianOverview() {
  const { technicians, complaints, vendors } = useAdminModule()
  const { can } = usePermissions()
  const [technicianItems, setTechnicianItems] = useState<TechnicianManagementRecord[]>([])
  const [complaintItems, setComplaintItems] = useState(complaints)
  const [filters, setFilters] = useState<TechnicianFilterState>(defaultFilters)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [detailTechnicianId, setDetailTechnicianId] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null)
  const [formValue, setFormValue] = useState<TechnicianFormValues>(getEmptyTechnicianForm(vendors[0]?.name ?? ''))
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TechnicianFormValues, string>>>({})
  const [editingTechnicianId, setEditingTechnicianId] = useState<string | null>(null)
  const [removeTechnicianId, setRemoveTechnicianId] = useState<string | null>(null)
  const [removeBlockedMessage, setRemoveBlockedMessage] = useState<string | null>(null)
  const [assignmentTechnicianId, setAssignmentTechnicianId] = useState<string | null>(null)
  const [selectedComplaintId, setSelectedComplaintId] = useState('')

  useEffect(() => {
    setTechnicianItems(buildTechnicianRecords(technicians, complaints, vendors))
    setComplaintItems(complaints)
  }, [technicians, complaints, vendors])

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setFeedback(null), 3400)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const departments = useMemo(() => Array.from(new Set(technicianItems.map((item) => item.department))), [technicianItems])
  const vendorNames = useMemo(() => Array.from(new Set(vendors.map((vendor) => vendor.name))), [vendors])

  const filteredTechnicians = useMemo(() => {
    return technicianItems.filter((technician) => {
      const skillMatch = filters.skill === 'All' || technician.skill === filters.skill
      const availabilityMatch = filters.availability === 'All' || technician.availabilityStatus === filters.availability
      const departmentMatch = filters.department === 'All' || technician.department === filters.department
      const vendorMatch = filters.vendor === 'All' || technician.assignedVendor === filters.vendor
      return skillMatch && availabilityMatch && departmentMatch && vendorMatch
    })
  }, [filters, technicianItems])

  const detailTechnician = technicianItems.find((item) => item.id === detailTechnicianId) ?? null
  const removeTechnician = technicianItems.find((item) => item.id === removeTechnicianId) ?? null

  const assignableComplaints = useMemo(
    () => complaintItems.filter((complaint) => complaint.status !== 'Resolved'),
    [complaintItems]
  )

  const assignableTechnicians = useMemo(
    () => technicianItems.filter((technician) => technician.availabilityStatus !== 'Suspended'),
    [technicianItems]
  )

  const sortedByPerformance = useMemo(
    () => [...filteredTechnicians].sort((left, right) => right.performanceScore - left.performanceScore || right.slaScore - left.slaScore),
    [filteredTechnicians]
  )
  const topPerformers = sortedByPerformance.slice(0, 3).map((item) => item.name)
  const lowPerformers = [...sortedByPerformance].reverse().slice(0, 3).map((item) => item.name)
  const alerts = useMemo(
    () => filteredTechnicians.flatMap((technician) => getTechnicianAlerts(technician).map((alert) => `${technician.name}: ${alert}`)),
    [filteredTechnicians]
  )
  const smartInsights = useMemo(() => {
    const items: string[] = []
    const overloaded = filteredTechnicians.find((technician) => technician.assignedTasks >= 10)
    if (overloaded) items.push(`${overloaded.name} is overloaded with ${overloaded.assignedTasks} assigned tasks.`)
    const noVendor = filteredTechnicians.find((technician) => !technician.assignedVendor)
    if (noVendor) items.push(`${noVendor.name} has no assigned vendor mapping.`)
    const lowPerformance = filteredTechnicians.find((technician) => technician.performanceScore < 80)
    if (lowPerformance) items.push(`${lowPerformance.name} needs performance review due to low score.`)
    return items.length ? items : ['Technician performance and assignment load are currently balanced.']
  }, [filteredTechnicians])

  const openAddTechnician = () => {
    setFormMode('add')
    setEditingTechnicianId(null)
    setFormErrors({})
    setFormValue(getEmptyTechnicianForm(vendorNames[0] ?? ''))
  }

  const openEditTechnician = (technician: TechnicianManagementRecord) => {
    setFormMode('edit')
    setEditingTechnicianId(technician.id)
    setFormErrors({})
    setFormValue({
      name: technician.name,
      department: technician.department,
      skill: technician.skill,
      phone: technician.phone,
      email: technician.email,
      assignedVendor: technician.assignedVendor,
      availabilityStatus: technician.availabilityStatus,
    })
  }

  const validateForm = () => {
    const errors: Partial<Record<keyof TechnicianFormValues, string>> = {}
    if (!formValue.name.trim()) errors.name = 'Name is required.'
    if (!formValue.phone.trim()) errors.phone = 'Phone is required.'
    else if (!isValidPhone(formValue.phone)) errors.phone = 'Enter a valid phone number.'
    if (!formValue.email.trim()) errors.email = 'Email is required.'
    else if (!isValidEmail(formValue.email)) errors.email = 'Enter a valid email.'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitForm = () => {
    if (!validateForm()) return

    if (formMode === 'add') {
      const nextTechnician: TechnicianManagementRecord = {
        id: `TEC-${Date.now()}`,
        name: formValue.name.trim(),
        campus: vendors.find((vendor) => vendor.name === formValue.assignedVendor)?.campus ?? 'Main Campus',
        department: formValue.department,
        assignedTasks: 0,
        completionRate: 0,
        risk: 'Low',
        skill: formValue.skill,
        completedTasks: 0,
        pendingTasks: 0,
        averageResolutionTime: 'Not enough data',
        performanceScore: 82,
        availabilityStatus: formValue.availabilityStatus,
        phone: formValue.phone.trim(),
        email: formValue.email.trim(),
        assignedVendor: formValue.assignedVendor,
        activeTasks: [],
        workHistory: [],
        slaScore: 90,
      }
      setTechnicianItems((previous) => [nextTechnician, ...previous])
      setFeedback(`${nextTechnician.name} added successfully.`)
    }

    if (formMode === 'edit' && editingTechnicianId) {
      setTechnicianItems((previous) =>
        previous.map((technician) =>
          technician.id === editingTechnicianId
            ? {
                ...technician,
                name: formValue.name.trim(),
                department: formValue.department,
                skill: formValue.skill,
                phone: formValue.phone.trim(),
                email: formValue.email.trim(),
                assignedVendor: formValue.assignedVendor,
                availabilityStatus: formValue.availabilityStatus,
              }
            : technician
        )
      )
      setFeedback(`${formValue.name.trim()} updated successfully.`)
    }

    setFormMode(null)
    setEditingTechnicianId(null)
  }

  const handleSuspendTechnician = (technician: TechnicianManagementRecord) => {
    setTechnicianItems((previous) =>
      previous.map((item) =>
        item.id === technician.id
          ? { ...item, availabilityStatus: item.availabilityStatus === 'Suspended' ? 'Available' : 'Suspended' }
          : item
      )
    )
    setFeedback(
      technician.availabilityStatus === 'Suspended'
        ? `${technician.name} restored to available status.`
        : `${technician.name} suspended from new task assignment.`
    )
  }

  const handleRemoveRequest = (technician: TechnicianManagementRecord) => {
    const hasActiveTasks = complaintItems.some(
      (complaint) => complaint.technician === technician.name && complaint.status !== 'Resolved'
    )
    if (hasActiveTasks) {
      setRemoveBlockedMessage('Reassign tasks before removing technician')
      return
    }
    setRemoveTechnicianId(technician.id)
  }

  const handleRemoveConfirm = () => {
    if (!removeTechnician) return
    setTechnicianItems((previous) => previous.filter((technician) => technician.id !== removeTechnician.id))
    setFeedback(`${removeTechnician.name} removed successfully.`)
    setRemoveTechnicianId(null)
    if (detailTechnicianId === removeTechnician.id) setDetailTechnicianId(null)
  }

  const openAssignmentModal = (technician?: TechnicianManagementRecord) => {
    setAssignmentTechnicianId(technician?.id ?? assignableTechnicians[0]?.id ?? null)
    setSelectedComplaintId(assignableComplaints[0]?.id ?? '')
  }

  const handleAssignmentConfirm = () => {
    if (!assignmentTechnicianId || !selectedComplaintId) return
    const technician = technicianItems.find((item) => item.id === assignmentTechnicianId)
    if (!technician || technician.availabilityStatus === 'Suspended') {
      setFeedback('Suspended technicians cannot receive new complaints.')
      setAssignmentTechnicianId(null)
      return
    }

    setComplaintItems((previous) =>
      previous.map((complaint) =>
        complaint.id === selectedComplaintId
          ? { ...complaint, technician: technician.name, status: 'Assigned' }
          : complaint
      )
    )
    setTechnicianItems((previous) =>
      previous.map((item) =>
        item.id === technician.id
          ? {
              ...item,
              assignedTasks: item.assignedTasks + 1,
              pendingTasks: item.pendingTasks + 1,
              activeTasks: [
                {
                  id: selectedComplaintId,
                  title: complaintItems.find((complaint) => complaint.id === selectedComplaintId)?.title ?? 'Assigned complaint',
                  status: 'Assigned',
                  createdDate: complaintItems.find((complaint) => complaint.id === selectedComplaintId)?.createdDate ?? 'Today',
                  priority: complaintItems.find((complaint) => complaint.id === selectedComplaintId)?.priority ?? 'Medium',
                },
                ...item.activeTasks,
              ],
            }
          : item
      )
    )
    setFeedback(`Complaint ${selectedComplaintId} assigned to ${technician.name}.`)
    setAssignmentTechnicianId(null)
  }

  return (
    <section className="space-y-6">
      <DataPanel
        title="Technician Overview"
        action={
          <div className="flex flex-wrap gap-2">
            {can('COMPLAINT_ASSIGN') ? (
              <button onClick={() => openAssignmentModal()} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
                Assign Task
              </button>
            ) : null}
            <button onClick={openAddTechnician} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
              + Add Technician
            </button>
          </div>
        }
      >
        {feedback ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {feedback}
          </div>
        ) : null}

        <TechnicianFilters filters={filters} departments={departments} vendors={vendorNames} onChange={setFilters} />

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.2rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Technician Alerts</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {alerts.length ? alerts.map((alert) => (
                <span key={alert} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">{alert}</span>
              )) : (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">No active technician alerts</span>
              )}
            </div>
          </div>

          <div className="rounded-[1.2rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Control Summary</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--bg-primary)] p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Tracked Technicians</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{filteredTechnicians.length}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-primary)] p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Avg. Performance</p>
                <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                  {filteredTechnicians.length ? Math.round(filteredTechnicians.reduce((sum, item) => sum + item.performanceScore, 0) / filteredTechnicians.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTechnicians.map((technician) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
              onViewDetails={() => setDetailTechnicianId(technician.id)}
              onAssignTask={() => openAssignmentModal(technician)}
              onEdit={() => openEditTechnician(technician)}
              onSuspend={() => handleSuspendTechnician(technician)}
              onRemove={() => handleRemoveRequest(technician)}
            />
          ))}
        </div>
      </DataPanel>

      <TechnicianInsightsPanel insights={smartInsights} topPerformers={topPerformers} lowPerformers={lowPerformers} />

      <DataPanel title="Technician Table View">
        <TechnicianTable
          technicians={filteredTechnicians}
          onViewDetails={(technician) => setDetailTechnicianId(technician.id)}
          onAssignTask={(technician) => openAssignmentModal(technician)}
          onEdit={openEditTechnician}
          onSuspend={handleSuspendTechnician}
          onRemove={handleRemoveRequest}
        />
      </DataPanel>

      <TechnicianDetailModal technician={detailTechnician} onClose={() => setDetailTechnicianId(null)} onAssignTask={(technician) => openAssignmentModal(technician)} />

      {formMode ? (
        <TechnicianFormModal
          mode={formMode}
          value={formValue}
          errors={formErrors}
          vendors={vendorNames}
          departments={departments.length ? departments : ['Central Operations']}
          onChange={setFormValue}
          onClose={() => setFormMode(null)}
          onSubmit={handleSubmitForm}
        />
      ) : null}

      <TechnicianAssignmentModal
        isOpen={Boolean(assignmentTechnicianId)}
        complaints={assignableComplaints}
        technicians={assignableTechnicians}
        selectedComplaintId={selectedComplaintId}
        selectedTechnicianId={assignmentTechnicianId ?? ''}
        onComplaintChange={setSelectedComplaintId}
        onTechnicianChange={setAssignmentTechnicianId}
        onClose={() => setAssignmentTechnicianId(null)}
        onConfirm={handleAssignmentConfirm}
      />

      {removeBlockedMessage ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Remove blocked</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{removeBlockedMessage}</p>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setRemoveBlockedMessage(null)} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">Close</button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {removeTechnician ? createPortal(
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/35 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Remove technician</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Are you sure you want to remove this technician? This action cannot be undone.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setRemoveTechnicianId(null)} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Cancel</button>
              <button onClick={handleRemoveConfirm} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">Remove Technician</button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  )
}

export default TechnicianOverview
