import type { AdminModuleContextValue } from '../../features/userAccess/types'

function GlobalFiltersBar({
  filters,
  setFilters,
  users,
}: Pick<AdminModuleContextValue, 'filters' | 'setFilters' | 'users'>) {
  const departments = Array.from(new Set(users.map((user) => user.department)))
  const roles = Array.from(new Set(users.map((user) => user.role)))

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((previous) => ({ ...previous, [key]: value }))
  }

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.2)]">
      <input
        value={filters.search}
        onChange={(event) => updateFilter('search', event.target.value)}
        placeholder="Search users, email, phone"
        className="min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] outline-none focus:border-[rgb(var(--color-primary))] xl:col-span-2"
      />
      <select
        value={filters.dateRange}
        onChange={(event) => updateFilter('dateRange', event.target.value)}
        className="min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] outline-none"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </select>
      <select
        value={filters.campus}
        onChange={(event) => updateFilter('campus', event.target.value)}
        className="min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] outline-none"
      >
        <option value="All">All Campuses</option>
        <option value="Hostel">Hostel</option>
        <option value="Faculty House">Faculty House</option>
        <option value="Department">Department</option>
        <option value="Department">School</option>
      </select>
      <select
        value={filters.department}
        onChange={(event) => updateFilter('department', event.target.value)}
        className="min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] outline-none"
      >
        <option value="All">All Departments</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>
      <select
        value={filters.role}
        onChange={(event) => updateFilter('role', event.target.value)}
        className="min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] outline-none"
      >
        <option value="All">All Roles</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(event) => updateFilter('status', event.target.value)}
        className="min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] outline-none"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Suspended">Suspended</option>
        <option value="Pending Approval">Pending Approval</option>
        <option value="Locked">Locked</option>
      </select>
    </div>
  )
}

export default GlobalFiltersBar
