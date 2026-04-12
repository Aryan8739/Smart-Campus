import { priorityBadgeClasses, statusBadgeClasses } from '../types'
import type { Complaint, Priority, SortOrder } from '../types'

type TrackerTabProps = {
  complaints: Complaint[]
  totalCount: number
  searchInput: string
  categoryFilter: string
  statusFilter: string
  priorityFilter: string
  sortOrder: SortOrder
  categories: string[]
  statuses: string[]
  priorities: string[]
  onSearchInputChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onSortChange: (value: SortOrder) => void
  onApplySearch: () => void
  onResetFilters: () => void
  selectedComplaintId: string
  onSelectComplaint: (id: string) => void
  onOpenWorkspace: () => void
}

function TrackerTab({
  complaints,
  totalCount,
  searchInput,
  categoryFilter,
  statusFilter,
  priorityFilter,
  sortOrder,
  categories,
  statuses,
  priorities,
  onSearchInputChange,
  onCategoryChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onApplySearch,
  onResetFilters,
  selectedComplaintId,
  onSelectComplaint,
  onOpenWorkspace,
}: TrackerTabProps) {
  return (
    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Complaint Tracker</h2>
        <span className="text-xs text-[rgb(var(--color-text-secondary))]">
          {complaints.length} of {totalCount} shown
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onApplySearch()
            }
          }}
          placeholder="Search by ID, title, or location"
          className="min-w-56 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
        />
        <button
          type="button"
          onClick={onApplySearch}
          className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-medium text-white"
        >
          Search
        </button>
        <select
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
        >
          {statuses.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(event) => onPriorityChange(event.target.value)}
          className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
        >
          {priorities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(event) => onSortChange(event.target.value as SortOrder)}
          className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
        >
          <option>Newest First</option>
          <option>Oldest First</option>
        </select>
        <button
          type="button"
          onClick={onResetFilters}
          className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs font-medium"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {complaints.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectComplaint(item.id)}
            className={[
              'w-full rounded-2xl border p-4 text-left transition',
              selectedComplaintId === item.id
                ? 'border-[rgb(var(--color-primary))/0.55] bg-[rgb(var(--color-primary))/0.08]'
                : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] hover:border-[rgb(var(--color-primary))/0.35]',
            ].join(' ')}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">{item.id}</p>
              <div className="flex gap-2">
                <span className={['rounded-full border px-2 py-1 text-xs font-semibold', priorityBadgeClasses[item.priority as Priority]].join(' ')}>
                  {item.priority}
                </span>
                <span className={['rounded-full border px-2 py-1 text-xs font-semibold', statusBadgeClasses[item.status]].join(' ')}>
                  {item.status}
                </span>
              </div>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-[rgb(var(--color-text-primary))]">{item.title}</h3>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
              {item.category} | {item.location}
            </p>
            <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Updated: {item.updatedAt}</p>
          </button>
        ))}

        {complaints.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4 text-sm text-[rgb(var(--color-text-secondary))]">
            No complaint records match your filter criteria.
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onOpenWorkspace}
        className="mt-4 rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
      >
        Open Selected Complaint Workspace
      </button>
    </section>
  )
}

export default TrackerTab
