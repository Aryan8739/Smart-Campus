import Badge from '../common/Badge'
import type { VendorManagementRecord } from '../../services/vendorService'
import { getVendorStatusTone } from '../../services/vendorService'

function VendorTable({
  vendors,
  onViewDetails,
  onAssignWork,
  onEdit,
  onSuspend,
  onDelete,
}: {
  vendors: VendorManagementRecord[]
  onViewDetails: (vendor: VendorManagementRecord) => void
  onAssignWork: (vendor: VendorManagementRecord) => void
  onEdit: (vendor: VendorManagementRecord) => void
  onSuspend: (vendor: VendorManagementRecord) => void
  onDelete: (vendor: VendorManagementRecord) => void
}) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <table className="min-w-[980px] border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            {['Vendor Name', 'Category', 'Active Tickets', 'Completed Tickets', 'SLA %', 'Status', 'Actions'].map((heading) => (
              <th key={heading} className="px-4">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id} className="bg-[var(--bg-secondary)] text-sm shadow-[0_8px_22px_-18px_rgba(15,23,42,0.22)]">
              <td className="rounded-l-2xl px-4 py-4">
                <p className="font-semibold text-[var(--text-primary)]">{vendor.name}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{vendor.campus}</p>
              </td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">{vendor.category}</td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">{vendor.activeTickets}</td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">{vendor.completedTickets}</td>
              <td className="px-4 py-4">
                <div className="max-w-[9rem]">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>SLA</span>
                    <span>{vendor.slaScore}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[var(--bg-primary)]">
                    <div
                      className={`h-2 rounded-full ${vendor.slaScore >= 95 ? 'bg-emerald-500' : vendor.slaScore >= 90 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(vendor.slaScore, 100)}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge label={vendor.status} tone={getVendorStatusTone(vendor.status)} />
              </td>
              <td className="rounded-r-2xl px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => onViewDetails(vendor)} className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
                    Details
                  </button>
                  <button onClick={() => onAssignWork(vendor)} className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-1 text-xs font-semibold text-white">
                    Assign
                  </button>
                  <button onClick={() => onEdit(vendor)} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                    Edit
                  </button>
                  <button onClick={() => onSuspend(vendor)} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                    Suspend
                  </button>
                  <button onClick={() => onDelete(vendor)} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-900">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default VendorTable
