import { createPortal } from 'react-dom'
import Badge from '../common/Badge'
import type { TechnicianManagementRecord } from '../../services/technicianService'
import { getTechnicianStatusTone } from '../../services/technicianService'

function TechnicianDetailModal({
  technician,
  onClose,
  onAssignTask,
}: {
  technician: TechnicianManagementRecord | null
  onClose: () => void
  onAssignTask: (technician: TechnicianManagementRecord) => void
}) {
  if (!technician) return null

  return createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[1.7rem] border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)]">{technician.name}</h3>
              <Badge label={technician.availabilityStatus} tone={getTechnicianStatusTone(technician.availabilityStatus)} />
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {technician.department} • Skill: {technician.skill} • Vendor: {technician.assignedVendor || 'Unassigned'}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAssignTask(technician)} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">Assign Task</button>
            <button onClick={onClose} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">Close</button>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 xl:grid-cols-[1.05fr_1fr]">
          <section className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Profile Info</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                  <p>Phone: {technician.phone}</p>
                  <p>Email: {technician.email}</p>
                  <p>Campus: {technician.campus}</p>
                  <p>Assigned Vendor: {technician.assignedVendor || 'Unassigned'}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Performance Metrics</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                  <p>Assigned Tasks: {technician.assignedTasks}</p>
                  <p>Completed Tasks: {technician.completedTasks}</p>
                  <p>Pending Tasks: {technician.pendingTasks}</p>
                  <p>Average Resolution: {technician.averageResolutionTime}</p>
                  <p>Performance Score: {technician.performanceScore}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">SLA / Performance Chart</p>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{technician.slaScore}%</span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-[var(--border-color)]">
                <div
                  className={`h-3 rounded-full ${technician.slaScore >= 95 ? 'bg-emerald-500' : technician.slaScore >= 90 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(technician.slaScore, 100)}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Active Tasks</p>
              <div className="mt-4 space-y-3">
                {technician.activeTasks.length ? technician.activeTasks.map((task) => (
                  <div key={task.id} className="rounded-xl bg-[var(--card-bg)] px-4 py-3">
                    <p className="font-medium text-[var(--text-primary)]">{task.title}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{task.id} • {task.createdDate}</p>
                  </div>
                )) : (
                  <div className="rounded-xl bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-secondary)]">No active tasks assigned.</div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Skills & Status</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge label={technician.skill} tone="info" />
                <Badge label={technician.availabilityStatus} tone={getTechnicianStatusTone(technician.availabilityStatus)} />
                <Badge label={`${technician.performanceScore} Score`} tone={technician.performanceScore >= 90 ? 'success' : technician.performanceScore >= 80 ? 'warning' : 'danger'} />
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Work History</p>
              <div className="mt-4 space-y-3">
                {technician.workHistory.map((task) => (
                  <div key={task.id} className="rounded-xl bg-[var(--card-bg)] px-4 py-3">
                    <p className="font-medium text-[var(--text-primary)]">{task.title}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{task.id} • {task.createdDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TechnicianDetailModal
