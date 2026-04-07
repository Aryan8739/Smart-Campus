import Badge from '../common/Badge'
import type { TechnicianManagementRecord } from '../../services/technicianService'
import { getTechnicianStatusTone } from '../../services/technicianService'

function TechnicianTable({
  technicians,
  onViewDetails,
  onAssignTask,
  onEdit,
  onSuspend,
  onRemove,
}: {
  technicians: TechnicianManagementRecord[]
  onViewDetails: (technician: TechnicianManagementRecord) => void
  onAssignTask: (technician: TechnicianManagementRecord) => void
  onEdit: (technician: TechnicianManagementRecord) => void
  onSuspend: (technician: TechnicianManagementRecord) => void
  onRemove: (technician: TechnicianManagementRecord) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[980px] border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            {['Name', 'Skill', 'Assigned Tasks', 'Completed Tasks', 'SLA %', 'Status', 'Actions'].map((heading) => (
              <th key={heading} className="px-4">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {technicians.map((technician) => (
            <tr key={technician.id} className="bg-[var(--bg-secondary)] text-sm shadow-[0_8px_22px_-18px_rgba(15,23,42,0.22)]">
              <td className="rounded-l-2xl px-4 py-4">
                <p className="font-semibold text-[var(--text-primary)]">{technician.name}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{technician.department}</p>
              </td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">{technician.skill}</td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">{technician.assignedTasks}</td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">{technician.completedTasks}</td>
              <td className="px-4 py-4">
                <div className="max-w-[9rem]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>SLA</span>
                    <span>{technician.slaScore}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--bg-primary)]">
                    <div
                      className={`h-2 rounded-full ${technician.slaScore >= 95 ? 'bg-emerald-500' : technician.slaScore >= 90 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(technician.slaScore, 100)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge label={technician.availabilityStatus} tone={getTechnicianStatusTone(technician.availabilityStatus)} />
              </td>
              <td className="rounded-r-2xl px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => onViewDetails(technician)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">Details</button>
                  <button onClick={() => onAssignTask(technician)} className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-1 text-xs font-semibold text-white">Assign</button>
                  <button onClick={() => onEdit(technician)} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">Edit</button>
                  <button onClick={() => onSuspend(technician)} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Suspend</button>
                  <button onClick={() => onRemove(technician)} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-900">Remove</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TechnicianTable
