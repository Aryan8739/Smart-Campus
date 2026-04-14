import type { InvoiceSummary } from '../types'

type BillingTabProps = {
  invoices: InvoiceSummary[]
  onPayInvoice: (invoiceId: string, mode: 'partial' | 'full') => void
}

function BillingTab({ invoices, onPayInvoice }: BillingTabProps) {
  const totalAmount = invoices.reduce((sum, item) => sum + item.amount, 0)
  const totalPaid = invoices.reduce((sum, item) => sum + item.paidAmount, 0)
  const pendingCount = invoices.filter((item) => item.status !== 'Paid').length
  const paidCount = invoices.filter((item) => item.status === 'Paid').length

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Billing & Invoice Summary</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Complaint-linked billing visibility with pending dues and payment states.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Total Billed</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-text-primary))]">
            Rs. {totalAmount.toLocaleString('en-IN')}
          </p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Total Paid</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">Rs. {totalPaid.toLocaleString('en-IN')}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Pending</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-warning))]">{pendingCount}</p>
        </article>
        <article className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-4">
          <p className="text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Paid</p>
          <p className="mt-1 text-2xl font-bold text-[rgb(var(--color-success))]">{paidCount}</p>
        </article>
      </div>

      <div className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Invoice List</h3>
        <div className="mt-3 space-y-2.5">
          {invoices.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[rgb(var(--color-text-primary))]">{item.id}</p>
                <span
                  className={[
                    'rounded-full px-2 py-1 text-[10px] font-semibold',
                    item.status === 'Paid'
                      ? 'bg-[rgb(var(--color-success))/0.15] text-[rgb(var(--color-success))]'
                      : item.status === 'Partially Paid'
                        ? 'bg-[rgb(var(--color-primary))/0.15] text-[rgb(var(--color-primary))]'
                        : 'bg-[rgb(var(--color-warning))/0.15] text-[rgb(var(--color-warning))]',
                  ].join(' ')}
                >
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Complaint: {item.complaintId}</p>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                Amount: Rs. {item.amount.toLocaleString('en-IN')} | Due in {item.dueInDays} day(s)
              </p>
              <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                Paid: Rs. {item.paidAmount.toLocaleString('en-IN')} | Updated: {item.updatedAt}
              </p>

              <div className="mt-2 h-1.5 rounded-full bg-[rgb(var(--color-border))]">
                <div
                  className="h-1.5 rounded-full bg-[rgb(var(--color-success))]"
                  style={{ width: `${Math.round((item.paidAmount / item.amount) * 100)}%` }}
                />
              </div>

              {item.status !== 'Paid' ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onPayInvoice(item.id, 'partial')}
                    className="rounded-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] px-2 py-1 text-[11px] font-semibold text-[rgb(var(--color-text-primary))]"
                  >
                    Pay 50%
                  </button>
                  <button
                    type="button"
                    onClick={() => onPayInvoice(item.id, 'full')}
                    className="rounded-md bg-[rgb(var(--color-primary))] px-2 py-1 text-[11px] font-semibold text-white"
                  >
                    Pay Full
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BillingTab
