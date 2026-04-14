import { useMemo, useState } from 'react'
import type { VendorInvoice } from '../types'

type SettlementsTabProps = {
  invoices: VendorInvoice[]
  onSubmitInvoice: (invoiceId: string) => void
  onApproveInvoice: (invoiceId: string) => void
  onMarkPaid: (invoiceId: string) => void
}

function SettlementsTab({ invoices, onSubmitInvoice, onApproveInvoice, onMarkPaid }: SettlementsTabProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | VendorInvoice['status']>('All')
  const filteredInvoices = useMemo(
    () =>
      statusFilter === 'All'
        ? invoices
        : invoices.filter((invoice) => invoice.status === statusFilter),
    [invoices, statusFilter],
  )

  const totalApproved = invoices.reduce((sum, item) => sum + item.approvedAmount, 0)

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Invoice & Settlement Desk</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Complaint-linked invoice lifecycle and payout readiness.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Invoices</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-text-primary))]">{invoices.length}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Approved Value</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">Rs. {totalApproved.toLocaleString('en-IN')}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Pending Submission</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">
            {invoices.filter((item) => item.status === 'Draft').length}
          </p>
        </article>
      </div>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Settlement Pipeline</h3>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'All' | VendorInvoice['status'])}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2 py-1.5 text-xs"
          >
            <option value="All">All status</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div className="mt-3 space-y-2.5">
          {filteredInvoices.map((invoice) => (
            <div key={invoice.id} className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{invoice.id}</p>
                <span
                  className={[
                    'rounded-full px-2 py-1 text-[10px] font-semibold',
                    invoice.status === 'Paid'
                      ? 'bg-[rgb(var(--color-success))/0.15] text-[rgb(var(--color-success))]'
                      : invoice.status === 'Approved'
                        ? 'bg-[rgb(var(--color-primary))/0.15] text-[rgb(var(--color-primary))]'
                        : invoice.status === 'Submitted'
                          ? 'bg-[rgb(var(--color-warning))/0.15] text-[rgb(var(--color-warning))]'
                          : 'bg-[rgb(var(--color-danger))/0.15] text-[rgb(var(--color-danger))]',
                  ].join(' ')}
                >
                  {invoice.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Ticket: {invoice.ticketId}</p>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                Gross: Rs. {invoice.grossAmount.toLocaleString('en-IN')} | Approved: Rs. {invoice.approvedAmount.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">ETA: {invoice.settlementEta}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {invoice.status === 'Draft' ? (
                  <button
                    type="button"
                    onClick={() => onSubmitInvoice(invoice.id)}
                    className="rounded-md bg-[rgb(var(--color-primary))] px-2.5 py-1.5 text-[11px] font-semibold text-white"
                  >
                    Submit Invoice
                  </button>
                ) : null}
                {invoice.status === 'Submitted' ? (
                  <button
                    type="button"
                    onClick={() => onApproveInvoice(invoice.id)}
                    className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2.5 py-1.5 text-[11px] font-semibold"
                  >
                    Mark Approved
                  </button>
                ) : null}
                {invoice.status === 'Approved' ? (
                  <button
                    type="button"
                    onClick={() => onMarkPaid(invoice.id)}
                    className="rounded-md bg-[rgb(var(--color-success))] px-2.5 py-1.5 text-[11px] font-semibold text-white"
                  >
                    Mark Paid
                  </button>
                ) : null}
              </div>
            </div>
          ))}

          {filteredInvoices.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
              No invoices in selected status.
            </p>
          ) : null}
        </div>
      </article>
    </section>
  )
}

export default SettlementsTab
