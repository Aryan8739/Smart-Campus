import { ticketPriorityTone, ticketStatusTone } from '../types'
import type { VendorTechnician, VendorTicket } from '../types'

type AssignmentsTabProps = {
  tickets: VendorTicket[]
  technicians: VendorTechnician[]
  selectedTicketId: string
  selectedTechnicianId: string
  assignmentNote: string
  message: string
  onSelectTicket: (ticketId: string) => void
  onTechnicianChange: (technicianId: string) => void
  onAssignmentNoteChange: (value: string) => void
  onAssign: () => void
  onAutoAssign: () => void
}

function AssignmentsTab({
  tickets,
  technicians,
  selectedTicketId,
  selectedTechnicianId,
  assignmentNote,
  message,
  onSelectTicket,
  onTechnicianChange,
  onAssignmentNoteChange,
  onAssign,
  onAutoAssign,
}: AssignmentsTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Assignment Desk</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Skill matching, reassignment control, and manual override workflow.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Open Assignment Queue</h3>
          <div className="mt-3 space-y-2.5">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onSelectTicket(ticket.id)}
                className={[
                  'w-full rounded-2xl border p-3 text-left transition',
                  selectedTicketId === ticket.id
                    ? 'border-[rgb(var(--color-primary))/0.55] bg-[rgb(var(--color-primary))/0.08]'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">{ticket.id}</p>
                  <div className="flex gap-2">
                    <span className={['rounded-full border px-2 py-1 text-[10px] font-semibold', ticketPriorityTone[ticket.priority]].join(' ')}>{ticket.priority}</span>
                    <span className={['rounded-full border px-2 py-1 text-[10px] font-semibold', ticketStatusTone[ticket.status]].join(' ')}>{ticket.status}</span>
                  </div>
                </div>
                <p className="mt-1 text-sm font-semibold text-[rgb(var(--color-text-primary))]">{ticket.title}</p>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                  {ticket.category} | SLA {ticket.slaHoursLeft}h left | {ticket.location}
                </p>
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Assignment Controls</h3>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Selected ticket: {selectedTicketId || 'None'}</p>

          <select
            value={selectedTechnicianId}
            onChange={(event) => onTechnicianChange(event.target.value)}
            className="mt-3 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          >
            <option value="">Select technician</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name} ({tech.specialization})
              </option>
            ))}
          </select>

          <textarea
            rows={3}
            value={assignmentNote}
            onChange={(event) => onAssignmentNoteChange(event.target.value)}
            placeholder="Add assignment note for technician/vendor operations log"
            className="mt-3 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />

          {message ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p> : null}

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onAssign}
              className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white"
            >
              Assign Technician
            </button>
            <button
              type="button"
              onClick={onAutoAssign}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs font-semibold"
            >
              Smart Auto Assign
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

export default AssignmentsTab
