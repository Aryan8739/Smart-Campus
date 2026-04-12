import { useMemo, useState } from 'react'
import type { DepartmentTeamMember, DepartmentTicket, DepartmentTicketStatus } from '../types'
import { ticketPriorityTone, ticketStatusTone } from '../types'

type IntakeTabProps = {
  tickets: DepartmentTicket[]
  teams: DepartmentTeamMember[]
  onAssign: (ticketId: string, teamMemberId: string) => void
  onStatusChange: (ticketId: string, status: DepartmentTicketStatus) => void
  onEscalate: (ticketId: string) => void
}

function IntakeTab({ tickets, teams, onAssign, onStatusChange, onEscalate }: IntakeTabProps) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | DepartmentTicketStatus>('All')
  const [selectedTicketId, setSelectedTicketId] = useState('')
  const [selectedAssignee, setSelectedAssignee] = useState('')

  const selectedTicket = useMemo(
    () => tickets.find((item) => item.id === selectedTicketId),
    [selectedTicketId, tickets],
  )

  const openCount = useMemo(
    () => tickets.filter((item) => item.status === 'Open').length,
    [tickets],
  )

  const assignedCount = useMemo(
    () => tickets.filter((item) => item.status === 'Assigned' || item.status === 'In Progress').length,
    [tickets],
  )

  const escalatedCount = useMemo(
    () => tickets.filter((item) => item.status === 'Escalated').length,
    [tickets],
  )

  const filteredTickets = useMemo(
    () =>
      tickets.filter((item) => {
        const statusOk = statusFilter === 'All' || item.status === statusFilter
        const queryOk =
          query.trim() === '' ||
          item.id.toLowerCase().includes(query.toLowerCase()) ||
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.location.toLowerCase().includes(query.toLowerCase())

        return statusOk && queryOk
      }),
    [query, statusFilter, tickets],
  )

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Complaint Intake & Assignment</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Triage new complaints, assign ownership, and drive status transitions.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Open Queue: <span className="font-semibold text-[rgb(var(--color-warning))]">{openCount}</span>
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Active Work: <span className="font-semibold text-[rgb(var(--color-primary))]">{assignedCount}</span>
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Escalated: <span className="font-semibold text-[rgb(var(--color-danger))]">{escalatedCount}</span>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_180px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by ticket ID, title or location"
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'All' | DepartmentTicketStatus)}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-2 text-sm"
          >
            <option value="All">All status</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Quick Assignment Panel</p>

            <div className="mt-3 space-y-2">
              <select
                value={selectedTicketId}
                onChange={(event) => setSelectedTicketId(event.target.value)}
                className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-2 text-sm"
              >
                <option value="">Select ticket</option>
                {tickets
                  .filter((ticket) => ticket.status !== 'Resolved')
                  .map((ticket) => (
                    <option key={ticket.id} value={ticket.id}>
                      {ticket.id} - {ticket.title}
                    </option>
                  ))}
              </select>

              <select
                value={selectedAssignee}
                onChange={(event) => setSelectedAssignee(event.target.value)}
                className="w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-2 text-sm"
              >
                <option value="">Assign member</option>
                {teams
                  .filter((member) => member.active)
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.skill})
                    </option>
                  ))}
              </select>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!selectedTicketId || !selectedAssignee}
                  onClick={() => onAssign(selectedTicketId, selectedAssignee)}
                  className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
                >
                  Assign Ticket
                </button>
                <button
                  type="button"
                  disabled={!selectedTicketId}
                  onClick={() => onEscalate(selectedTicketId)}
                  className="rounded-lg border border-[rgb(var(--color-danger))/0.4] bg-[rgb(var(--color-danger))/0.08] px-3 py-2 text-xs font-semibold text-[rgb(var(--color-danger))] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  Escalate
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Selected Ticket Context</p>
            {selectedTicket ? (
              <div className="mt-3 space-y-2 text-xs">
                <p className="font-semibold text-[rgb(var(--color-text-primary))]">{selectedTicket.id} - {selectedTicket.title}</p>
                <p className="text-[rgb(var(--color-text-secondary))]">Location: {selectedTicket.location}</p>
                <p className="text-[rgb(var(--color-text-secondary))]">Category: {selectedTicket.category}</p>
                <p className="text-[rgb(var(--color-text-secondary))]">Current assignee: {selectedTicket.assignedTo ?? 'Unassigned'}</p>
                <p className="text-[rgb(var(--color-text-secondary))]">SLA remaining: {selectedTicket.slaHoursLeft}h</p>
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-[rgb(var(--color-border))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
                Pick a ticket from the panel to view quick context before assignment.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{ticket.id} - {ticket.title}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${ticketStatusTone[ticket.status]}`}>
                    {ticket.status}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${ticketPriorityTone[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                {ticket.location} | {ticket.category} | SLA: {ticket.slaHoursLeft}h | Assigned: {ticket.assignedTo ?? 'Unassigned'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onStatusChange(ticket.id, 'In Progress')}
                  className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1 text-[11px] font-semibold"
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(ticket.id, 'Resolved')}
                  className="rounded-md bg-[rgb(var(--color-success))] px-2 py-1 text-[11px] font-semibold text-white"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
              No complaint found for selected filters.
            </p>
          ) : null}
        </div>
      </article>
    </section>
  )
}

export default IntakeTab
