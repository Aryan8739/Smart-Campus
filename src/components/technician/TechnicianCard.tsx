import Badge from '../common/Badge'
import type { TechnicianManagementRecord } from '../../services/technicianService'
import { getTechnicianAlerts, getTechnicianStatusTone } from '../../services/technicianService'

function TechnicianCard({
  technician,
  onViewDetails,
  onAssignTask,
  onEdit,
  onSuspend,
  onRemove,
}: {
  technician: TechnicianManagementRecord
  onViewDetails: () => void
  onAssignTask: () => void
  onEdit: () => void
  onSuspend: () => void
  onRemove: () => void
}) {
  const alerts = getTechnicianAlerts(technician)
  const workloadPercent = Math.min(Math.round((technician.assignedTasks / 14) * 100), 100)

  return (
    <article
      className="group cursor-pointer rounded-[1.35rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-28px_rgba(15,23,42,0.28)]"
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{technician.name}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{technician.department}</p>
        </div>
        <Badge label={technician.availabilityStatus} tone={getTechnicianStatusTone(technician.availabilityStatus)} />
      </div>

      <div className="mt-2 text-sm text-[var(--text-secondary)]">
        <p>Skill: {technician.skill}</p>
        <p className="mt-1">Assigned Vendor: {technician.assignedVendor || 'Unassigned'}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-[var(--bg-primary)] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Assigned</p>
          <p className="mt-2 font-semibold text-[var(--text-primary)]">{technician.assignedTasks}</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-primary)] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Completed</p>
          <p className="mt-2 font-semibold text-[var(--text-primary)]">{technician.completedTasks}</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-primary)] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Pending</p>
          <p className="mt-2 font-semibold text-[var(--text-primary)]">{technician.pendingTasks}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Workload</span>
          <span className="font-semibold text-[var(--text-primary)]">{workloadPercent}%</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-[var(--bg-primary)]">
          <div
            className={`h-2.5 rounded-full ${workloadPercent < 55 ? 'bg-emerald-500' : workloadPercent < 80 ? 'bg-amber-500' : 'bg-rose-500'}`}
            style={{ width: `${workloadPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-secondary)]">
        <span>Avg. Resolution: {technician.averageResolutionTime}</span>
        <span>Performance: {technician.performanceScore}</span>
      </div>

      {alerts.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {alerts.map((alert) => (
            <span key={alert} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-800">
              {alert}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
        <button onClick={onViewDetails} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">View Details</button>
        <button onClick={onAssignTask} className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white">Assign Task</button>
        <button onClick={onEdit} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">Edit Technician</button>
        <button onClick={onSuspend} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">Suspend Technician</button>
        <button onClick={onRemove} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-900">Remove Technician</button>
      </div>
    </article>
  )
}

export default TechnicianCard
