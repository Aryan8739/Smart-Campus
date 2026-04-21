type ProofTabProps = {
  taskId: string
  beforeProof: boolean
  afterProof: boolean
  completionNote: string
  message: string
  onBeforeProofChange: (value: boolean) => void
  onAfterProofChange: (value: boolean) => void
  onCompletionNoteChange: (value: string) => void
  onSubmitClosure: () => void
}

function ProofTab({
  taskId,
  beforeProof,
  afterProof,
  completionNote,
  message,
  onBeforeProofChange,
  onAfterProofChange,
  onCompletionNoteChange,
  onSubmitClosure,
}: ProofTabProps) {
  const noteLength = completionNote.trim().length

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Proof Capture Unit</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Closure-critical jobs require before/after proof and minimum-detail completion notes.
        </p>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Selected Task</p>
        <p className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{taskId || 'No task selected'}</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-3 text-sm">
            <span>Before-work proof uploaded</span>
            <input
              type="checkbox"
              checked={beforeProof}
              onChange={(event) => onBeforeProofChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-3 text-sm">
            <span>After-work proof uploaded</span>
            <input
              type="checkbox"
              checked={afterProof}
              onChange={(event) => onAfterProofChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
          <p>Validation Checklist</p>
          <ul className="mt-1 space-y-1">
            <li>• Before proof required for closure-critical categories</li>
            <li>• After proof required for closure request</li>
            <li>• Completion note must have at least 20 characters</li>
          </ul>
        </div>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
          Completion note
        </label>
        <textarea
          rows={4}
          value={completionNote}
          onChange={(event) => onCompletionNoteChange(event.target.value)}
          placeholder="Add work summary, replaced parts, issue root-cause, and pending follow-up"
          className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
        />
        <p className="mt-1 text-[11px] text-[rgb(var(--color-text-secondary))]">Current note length: {noteLength} characters</p>

        {message ? <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p> : null}

        <button
          type="button"
          onClick={onSubmitClosure}
          className="mt-4 rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white"
        >
          Validate and Submit Closure
        </button>
      </article>
    </section>
  )
}

export default ProofTab
