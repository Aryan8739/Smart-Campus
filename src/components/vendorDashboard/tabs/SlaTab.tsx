import { useMemo, useState } from 'react'
import type { VendorTicket } from '../types'

type SlaTabProps = {
  tickets: VendorTicket[]
  onEscalate: (ticketId: string) => void
}

function SlaTab({ tickets, onEscalate }: SlaTabProps) {
  const [threshold, setThreshold] = useState(8)

  const riskTickets = useMemo(
    () => tickets.filter((ticket) => ticket.slaHoursLeft <= threshold && ticket.status !== 'Resolved'),
    [threshold, tickets],
  )

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">SLA Monitor & Escalation</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Pre-breach warning visibility with actionable risk queue.
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="text-[rgb(var(--color-text-secondary))]">Risk threshold</span>
          <select
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-1"
          >
            <option value={4}>4h</option>
            <option value={8}>8h</option>
            <option value={12}>12h</option>
          </select>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Risk Tickets</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-danger))]">{riskTickets.length}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Within SLA</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{tickets.length - riskTickets.length}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Escalation Suggested</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">
            {riskTickets.filter((ticket) => ticket.priority === 'High' || ticket.priority === 'Critical').length}
          </p>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">At-Risk Queue</h3>
        <div className="mt-3 space-y-2.5">
          {riskTickets.length ? (
            riskTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{ticket.id} - {ticket.title}</p>
                  {ticket.status !== 'Escalated' ? (
                    <button
                      type="button"
                      onClick={() => onEscalate(ticket.id)}
                      className="rounded-md bg-[rgb(var(--color-danger))] px-2 py-1 text-[10px] font-semibold text-white"
                    >
                      Escalate
                    </button>
                  ) : (
                    <span className="rounded-full bg-[rgb(var(--color-accent))/0.15] px-2 py-1 text-[10px] font-semibold text-[rgb(var(--color-accent))]">
                      Escalated
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                  {ticket.location} | {ticket.status} | SLA left: {ticket.slaHoursLeft}h
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
              No tickets currently in SLA risk zone.
            </p>
          )}
        </div>
      </article>
    </section>
  )
}

export default SlaTab
