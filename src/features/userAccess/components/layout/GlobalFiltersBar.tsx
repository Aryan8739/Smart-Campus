import type { AdminModuleContextValue } from '../../types'

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
    <div className="grid gap-2.5 rounded-[1.15rem] border border-slate-200 bg-white p-3.5 shadow-sm md:grid-cols-5 xl:grid-cols-6">
      <input
        value={filters.search}
        onChange={(event) => updateFilter('search', event.target.value)}
        placeholder="Search users, email, phone"
        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-700 outline-none focus:border-[rgb(var(--color-primary))]"
      />
      <select
        value={filters.dateRange}
        onChange={(event) => updateFilter('dateRange', event.target.value)}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-700 outline-none"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
      </select>
      <select
        value={filters.campus}
        onChange={(event) => updateFilter('campus', event.target.value)}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-700 outline-none"
      >
        <option value="All">All Campuses</option>
        <option value="Main Campus">Main Campus</option>
        <option value="North Campus">North Campus</option>
        <option value="Research Park">Research Park</option>
      </select>
      <select
        value={filters.department}
        onChange={(event) => updateFilter('department', event.target.value)}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-700 outline-none"
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
        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-700 outline-none"
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
        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[13px] text-slate-700 outline-none"
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
