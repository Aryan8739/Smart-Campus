import { useMemo, useState } from 'react'
import type { DepartmentTeamMember } from '../types'

type TeamsTabProps = {
  teams: DepartmentTeamMember[]
  message: string
  onToggleActive: (id: string) => void
  onShiftChange: (id: string, shift: DepartmentTeamMember['shift']) => void
  onRebalance: () => void
}

function TeamsTab({ teams, message, onToggleActive, onShiftChange, onRebalance }: TeamsTabProps) {
  const [query, setQuery] = useState('')
  const [shiftFilter, setShiftFilter] = useState<'All' | DepartmentTeamMember['shift']>('All')
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Off Shift'>('All')

  const filteredTeams = useMemo(
    () =>
      teams.filter(
        (member) => {
          const queryMatched =
            query.trim() === '' ||
            member.name.toLowerCase().includes(query.toLowerCase()) ||
            member.skill.toLowerCase().includes(query.toLowerCase())
          const shiftMatched = shiftFilter === 'All' || member.shift === shiftFilter
          const activeMatched =
            activeFilter === 'All' ||
            (activeFilter === 'Active' && member.active) ||
            (activeFilter === 'Off Shift' && !member.active)

          return queryMatched && shiftMatched && activeMatched
        },
      ),
    [activeFilter, query, shiftFilter, teams],
  )

  const activeCount = teams.filter((member) => member.active).length
  const averageWorkload =
    activeCount > 0
      ? Number((teams.filter((member) => member.active).reduce((sum, member) => sum + member.workload, 0) / activeCount).toFixed(1))
      : 0
  const averageClosureRate =
    teams.length > 0
      ? Math.round(teams.reduce((sum, member) => sum + member.closureRate, 0) / teams.length)
      : 0

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Team Management Desk</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Technician/team member availability, shift planning, and workload balancing.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Team Members</p>
          <p className="mt-1 text-2xl font-bold">{teams.length}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Active Today</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{activeCount}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Avg Workload</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-primary))]">{averageWorkload}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Closure Rate</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">{averageClosureRate}%</p>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="grid w-full gap-2 sm:grid-cols-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or skill"
              className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
            <select
              value={shiftFilter}
              onChange={(event) => setShiftFilter(event.target.value as 'All' | DepartmentTeamMember['shift'])}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-2 text-sm"
            >
              <option value="All">All shifts</option>
              <option value="Morning">Morning</option>
              <option value="General">General</option>
              <option value="Evening">Evening</option>
            </select>
            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value as 'All' | 'Active' | 'Off Shift')}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-2 text-sm"
            >
              <option value="All">All availability</option>
              <option value="Active">Active</option>
              <option value="Off Shift">Off Shift</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onRebalance}
            className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white"
          >
            Rebalance Workload
          </button>
        </div>

        {message ? (
          <p className="mb-3 rounded-xl border border-[rgb(var(--color-success))/0.35] bg-[rgb(var(--color-success))/0.08] p-3 text-xs font-semibold text-[rgb(var(--color-success))]">
            {message}
          </p>
        ) : null}

        <div className="space-y-2.5">
          {filteredTeams.map((member) => (
            <div key={member.id} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{member.name}</p>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    member.active
                      ? 'bg-[rgb(var(--color-success))/0.16] text-[rgb(var(--color-success))]'
                      : 'bg-[rgb(var(--color-danger))/0.14] text-[rgb(var(--color-danger))]',
                  ].join(' ')}
                >
                  {member.active ? 'Active' : 'Off Shift'}
                </span>
              </div>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                {member.skill} | Workload: {member.workload} | Closure: {member.closureRate}%
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  value={member.shift}
                  onChange={(event) => onShiftChange(member.id, event.target.value as DepartmentTeamMember['shift'])}
                  className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1 text-[11px]"
                >
                  <option value="Morning">Morning</option>
                  <option value="General">General</option>
                  <option value="Evening">Evening</option>
                </select>
                <button
                  type="button"
                  onClick={() => onToggleActive(member.id)}
                  className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1 text-[11px] font-semibold"
                >
                  {member.active ? 'Mark Off' : 'Mark Active'}
                </button>
              </div>
            </div>
          ))}

          {filteredTeams.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
              No team member found for search input.
            </p>
          ) : null}
        </div>
      </article>
    </section>
  )
}

export default TeamsTab
