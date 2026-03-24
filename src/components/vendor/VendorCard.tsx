import Badge from '../common/Badge'
import type { VendorManagementRecord } from '../../services/vendorService'
import { getVendorAlerts, getVendorStatusTone } from '../../services/vendorService'

function VendorCard({
  vendor,
  onViewDetails,
  onAssignWork,
  onEdit,
  onSuspend,
  onDelete,
}: {
  vendor: VendorManagementRecord
  onViewDetails: () => void
  onAssignWork: () => void
  onEdit: () => void
  onSuspend: () => void
  onDelete: () => void
}) {
  const alerts = getVendorAlerts(vendor)

  return (
    <article
      className="group cursor-pointer rounded-[1.35rem] border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-28px_rgba(15,23,42,0.28)]"
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{vendor.name}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{vendor.category}</p>
        </div>
        <Badge label={vendor.status} tone={getVendorStatusTone(vendor.status)} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-[var(--bg-primary)] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Active</p>
          <p className="mt-2 font-semibold text-[var(--text-primary)]">{vendor.activeTickets}</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-primary)] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Completed</p>
          <p className="mt-2 font-semibold text-[var(--text-primary)]">{vendor.completedTickets}</p>
        </div>
        <div className="rounded-xl bg-[var(--bg-primary)] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">Pending</p>
          <p className="mt-2 font-semibold text-[var(--text-primary)]">{vendor.pendingTickets}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-secondary)]">SLA Performance</span>
          <span className="font-semibold text-[var(--text-primary)]">{vendor.slaScore}%</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-[var(--bg-primary)]">
          <div
            className={`h-2.5 rounded-full ${vendor.slaScore >= 95 ? 'bg-emerald-500' : vendor.slaScore >= 90 ? 'bg-amber-500' : 'bg-rose-500'}`}
            style={{ width: `${Math.min(vendor.slaScore, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-secondary)]">
        <span>Avg. Resolution: {vendor.averageResolutionTime}</span>
        <span>Rating: {vendor.rating.toFixed(1)}/5</span>
      </div>

      {alerts.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {alerts.map((alert) => (
            <span
              key={alert}
              className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-800"
            >
              {alert}
            </span>
          ))}
        </div>
      ) : null}

      <div
        className="mt-5 flex flex-wrap gap-2"
        onClick={(event) => event.stopPropagation()}
      >
        <button onClick={onViewDetails} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)]">
          View Details
        </button>
        <button onClick={onAssignWork} className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white">
          Assign Work
        </button>
        <button onClick={onEdit} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">
          Edit Vendor
        </button>
        <button onClick={onSuspend} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          Suspend Vendor
        </button>
        <button onClick={onDelete} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-900">
          Delete Vendor
        </button>
      </div>
    </article>
  )
}

export default VendorCard
