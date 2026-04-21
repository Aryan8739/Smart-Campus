import { taskStatusTone } from '../types'
import type { TechnicianTask } from '../types'

type ProgressTabProps = {
  task: TechnicianTask | null
  progressNote: string
  message: string
  onProgressNoteChange: (value: string) => void
  onChecklistUpdate: (completed: number) => void
  onMoveToInProgress: () => void
  onRequestClosure: () => void
}

function ProgressTab({
  task,
  progressNote,
  message,
  onProgressNoteChange,
  onChecklistUpdate,
  onMoveToInProgress,
  onRequestClosure,
}: ProgressTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Progress Tracker</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Stage-wise updates with checklist completion and automatic timestamp readiness.
        </p>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        {task ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">{task.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-[rgb(var(--color-text-primary))]">{task.title}</h3>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                  {task.location} | Scheduled {task.scheduledAt}
                </p>
              </div>
              <span className={['rounded-full border px-2.5 py-1 text-[11px] font-semibold', taskStatusTone[task.status]].join(' ')}>
                {task.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs">
                <p className="text-[rgb(var(--color-text-secondary))]">Checklist Progress</p>
                <p className="mt-1 text-base font-semibold text-[rgb(var(--color-text-primary))]">
                  {task.checklistCompleted}/{task.checklistTotal}
                </p>
              </div>
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs">
                <p className="text-[rgb(var(--color-text-secondary))]">Started At</p>
                <p className="mt-1 text-base font-semibold text-[rgb(var(--color-text-primary))]">{task.startedAt ?? 'Not started'}</p>
              </div>
              <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs">
                <p className="text-[rgb(var(--color-text-secondary))]">SLA Remaining</p>
                <p className="mt-1 text-base font-semibold text-[rgb(var(--color-text-primary))]">{task.slaHoursLeft}h</p>
              </div>
            </div>

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Completed checklist steps
            </label>
            <input
              type="range"
              min={0}
              max={task.checklistTotal}
              value={task.checklistCompleted}
              onChange={(event) => onChecklistUpdate(Number(event.target.value))}
              className="mt-2 w-full"
            />

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Progress note
            </label>
            <textarea
              rows={4}
              value={progressNote}
              onChange={(event) => onProgressNoteChange(event.target.value)}
              placeholder="Add site update details for audit trail and closure review"
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />

            {message ? <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p> : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onMoveToInProgress}
                className="rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white"
              >
                Move To In Progress
              </button>
              <button
                type="button"
                onClick={onRequestClosure}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-2 text-xs font-semibold"
              >
                Request Closure
              </button>
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-4 text-sm text-[rgb(var(--color-text-secondary))]">
            Select a task from Task Queue to start progress tracking.
          </p>
        )}
      </article>
    </section>
  )
}

export default ProgressTab
