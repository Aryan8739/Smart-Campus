import type { CampusCode } from '../../features/userAccess/types'
import { slaRangeOptions, vendorCategories, vendorStatusOptions } from '../../services/vendorService'

export interface VendorFilterState {
  category: 'All' | string
  slaRange: (typeof slaRangeOptions)[number]
  status: (typeof vendorStatusOptions)[number]
  campus: 'All' | CampusCode
}

function VendorFilters({
  filters,
  onChange,
}: {
  filters: VendorFilterState
  onChange: (next: VendorFilterState) => void
}) {
  const fieldClassName =
    'rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[rgb(var(--color-primary))]'

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <select
        value={filters.category}
        onChange={(event) => onChange({ ...filters, category: event.target.value })}
        className={fieldClassName}
      >
        <option value="All">All Categories</option>
        {vendorCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={filters.slaRange}
        onChange={(event) => onChange({ ...filters, slaRange: event.target.value as VendorFilterState['slaRange'] })}
        className={fieldClassName}
      >
        {slaRangeOptions.map((range) => (
          <option key={range} value={range}>
            {range === 'All' ? 'All SLA Levels' : `SLA ${range}`}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value as VendorFilterState['status'] })}
        className={fieldClassName}
      >
        {vendorStatusOptions.map((status) => (
          <option key={status} value={status}>
            {status === 'All' ? 'All Statuses' : status}
          </option>
        ))}
      </select>

      <select
        value={filters.campus}
        onChange={(event) => onChange({ ...filters, campus: event.target.value as VendorFilterState['campus'] })}
        className={fieldClassName}
      >
        <option value="All">All Campuses</option>
        <option value="Main Campus">Main Campus</option>
        <option value="North Campus">North Campus</option>
        <option value="Research Park">Research Park</option>
      </select>
    </div>
  )
}

export default VendorFilters
