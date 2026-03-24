import { createPortal } from 'react-dom'
import Badge from '../common/Badge'
import type { VendorManagementRecord } from '../../services/vendorService'
import { getVendorStatusTone } from '../../services/vendorService'

function VendorDetailModal({
  vendor,
  onClose,
  onAssignWork,
}: {
  vendor: VendorManagementRecord | null
  onClose: () => void
  onAssignWork: (vendor: VendorManagementRecord) => void
}) {
  if (!vendor) return null

  return createPortal(
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[1.7rem] border border-[var(--border-color)] bg-[var(--card-bg)] shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-color)] px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)]">{vendor.name}</h3>
              <Badge label={vendor.status} tone={getVendorStatusTone(vendor.status)} />
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {vendor.category} • {vendor.serviceArea} • Contact: {vendor.contactPerson}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAssignWork(vendor)} className="rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
              Assign Work
            </button>
            <button onClick={onClose} className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">
              Close
            </button>
          </div>
        </div>

        <div className="grid gap-5 px-6 py-6 xl:grid-cols-[1.1fr_1fr]">
          <section className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Vendor Profile</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                  <p>Email: {vendor.email}</p>
                  <p>Phone: {vendor.phone}</p>
                  <p>Campus: {vendor.campus}</p>
                  <p>Last Audit: {vendor.lastAudit}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Performance Snapshot</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                  <p>Active Complaints: {vendor.activeTickets}</p>
                  <p>Completed Complaints: {vendor.completedTickets}</p>
                  <p>Pending Complaints: {vendor.pendingTickets}</p>
                  <p>Average Resolution: {vendor.averageResolutionTime}</p>
                  <p>Vendor Rating: {vendor.rating.toFixed(1)} / 5</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">SLA Performance Chart</p>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{vendor.slaScore}%</span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-[var(--border-color)]">
                <div
                  className={`h-3 rounded-full ${vendor.slaScore >= 95 ? 'bg-emerald-500' : vendor.slaScore >= 90 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(vendor.slaScore, 100)}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3 text-center text-xs text-[var(--text-secondary)]">
                {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((label, index) => {
                  const height = [78, 92, 86, vendor.slaScore][index]
                  return (
                    <div key={label} className="rounded-xl bg-[var(--card-bg)] px-3 py-3">
                      <div className="mx-auto flex h-24 items-end justify-center">
                        <div
                          className="w-8 rounded-t-lg bg-[linear-gradient(180deg,rgba(59,130,246,0.95)_0%,rgba(37,99,235,0.88)_100%)]"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <p className="mt-2">{label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Assigned Technicians</p>
              <div className="mt-4 space-y-3">
                {vendor.assignedTechnicians.length ? vendor.assignedTechnicians.map((technician) => (
                  <div key={technician.name} className="rounded-xl bg-[var(--card-bg)] px-4 py-3">
                    <p className="font-medium text-[var(--text-primary)]">{technician.name}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {technician.department} • {technician.activeAssignments} active assignments
                    </p>
                  </div>
                )) : (
                  <div className="rounded-xl bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                    No active technicians assigned.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--bg-primary)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">Complaint History</p>
              <div className="mt-4 space-y-3">
                {vendor.complaintHistory.map((complaint) => (
                  <div key={complaint.id} className="rounded-xl bg-[var(--card-bg)] px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{complaint.title}</p>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          {complaint.id} • Created {complaint.createdDate}
                          {complaint.resolvedDate ? ` • Resolved ${complaint.resolvedDate}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge label={complaint.priority} tone={complaint.priority === 'High' ? 'danger' : complaint.priority === 'Medium' ? 'warning' : 'info'} />
                        <Badge label={complaint.status} tone={complaint.status === 'Resolved' ? 'success' : complaint.status === 'Escalated' ? 'danger' : complaint.status === 'Assigned' ? 'info' : 'warning'} />
                      </div>
                    </div>
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

export default VendorDetailModal
