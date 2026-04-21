import type { MaterialUsageRecord } from '../types'

type MaterialDraft = {
  itemName: string
  issuedQty: number
  usedQty: number
  unit: string
}

type MaterialsTabProps = {
  taskId: string
  records: MaterialUsageRecord[]
  draft: MaterialDraft
  message: string
  onDraftChange: (next: MaterialDraft) => void
  onAddRecord: () => void
  onToggleVerify: (recordId: string) => void
}

function MaterialsTab({ taskId, records, draft, message, onDraftChange, onAddRecord, onToggleVerify }: MaterialsTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Material Usage Log</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Link consumed material to complaint ID and reconcile issued vs used quantity.
        </p>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Current Task</p>
        <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{taskId || 'No task selected'}</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={draft.itemName}
            onChange={(event) => onDraftChange({ ...draft, itemName: event.target.value })}
            placeholder="Material name"
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            value={draft.issuedQty}
            onChange={(event) => onDraftChange({ ...draft, issuedQty: Number(event.target.value) })}
            placeholder="Issued qty"
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />
          <input
            type="number"
            min={0}
            value={draft.usedQty}
            onChange={(event) => onDraftChange({ ...draft, usedQty: Number(event.target.value) })}
            placeholder="Used qty"
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />
          <input
            value={draft.unit}
            onChange={(event) => onDraftChange({ ...draft, unit: event.target.value })}
            placeholder="Unit (nos, mtr, ltr)"
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onAddRecord}
            className="rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white"
          >
            Add Usage Entry
          </button>
          {message ? <p className="text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p> : null}
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-[rgb(var(--color-border))]">
          <table className="min-w-full divide-y divide-[rgb(var(--color-border))] text-left text-sm">
            <thead className="bg-[rgb(var(--color-bg))] text-xs uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Task</th>
                <th className="px-3 py-2">Issued</th>
                <th className="px-3 py-2">Used</th>
                <th className="px-3 py-2">Variance</th>
                <th className="px-3 py-2">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--color-border))]">
              {records.map((record) => {
                const variance = record.issuedQty - record.usedQty
                return (
                  <tr key={record.id} className="bg-[rgb(var(--color-card))]">
                    <td className="px-3 py-2 font-medium text-[rgb(var(--color-text-primary))]">{record.itemName}</td>
                    <td className="px-3 py-2 text-[rgb(var(--color-text-secondary))]">{record.taskId}</td>
                    <td className="px-3 py-2 text-[rgb(var(--color-text-secondary))]">{record.issuedQty} {record.unit}</td>
                    <td className="px-3 py-2 text-[rgb(var(--color-text-secondary))]">{record.usedQty} {record.unit}</td>
                    <td className={[
                      'px-3 py-2 font-semibold',
                      variance < 0 ? 'text-[rgb(var(--color-danger))]' : 'text-[rgb(var(--color-success))]',
                    ].join(' ')}>
                      {variance}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => onToggleVerify(record.id)}
                        className={[
                          'rounded-full border px-2 py-1 text-[11px] font-semibold',
                          record.verified
                            ? 'border-[rgb(var(--color-success))/0.35] bg-[rgb(var(--color-success))/0.1] text-[rgb(var(--color-success))]'
                            : 'border-[rgb(var(--color-warning))/0.35] bg-[rgb(var(--color-warning))/0.1] text-[rgb(var(--color-warning))]',
                        ].join(' ')}
                      >
                        {record.verified ? 'Verified' : 'Pending'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default MaterialsTab
