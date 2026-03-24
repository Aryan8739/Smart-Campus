import { technicianAvailabilityOptions, technicianSkillOptions } from '../../services/technicianService'

export interface TechnicianFilterState {
  skill: 'All' | string
  availability: (typeof technicianAvailabilityOptions)[number]
  department: 'All' | string
  vendor: 'All' | string
}

function TechnicianFilters({
  filters,
  departments,
  vendors,
  onChange,
}: {
  filters: TechnicianFilterState
  departments: string[]
  vendors: string[]
  onChange: (next: TechnicianFilterState) => void
}) {
  const fieldClassName =
    'rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[rgb(var(--color-primary))]'

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <select value={filters.skill} onChange={(event) => onChange({ ...filters, skill: event.target.value })} className={fieldClassName}>
        <option value="All">All Skills</option>
        {technicianSkillOptions.map((skill) => (
          <option key={skill} value={skill}>{skill}</option>
        ))}
      </select>

      <select
        value={filters.availability}
        onChange={(event) => onChange({ ...filters, availability: event.target.value as TechnicianFilterState['availability'] })}
        className={fieldClassName}
      >
        {technicianAvailabilityOptions.map((status) => (
          <option key={status} value={status}>{status === 'All' ? 'All Availability' : status}</option>
        ))}
      </select>

      <select value={filters.department} onChange={(event) => onChange({ ...filters, department: event.target.value })} className={fieldClassName}>
        <option value="All">All Departments</option>
        {departments.map((department) => (
          <option key={department} value={department}>{department}</option>
        ))}
      </select>

      <select value={filters.vendor} onChange={(event) => onChange({ ...filters, vendor: event.target.value })} className={fieldClassName}>
        <option value="All">All Vendors</option>
        {vendors.map((vendor) => (
          <option key={vendor} value={vendor}>{vendor}</option>
        ))}
      </select>
    </div>
  )
}

export default TechnicianFilters
