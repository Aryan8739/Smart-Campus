import { useMemo, useState } from 'react'
import { taskPriorityTone, taskStatusTone } from '../types'
import type { TechnicianTask } from '../types'

type TasksTabProps = {
  tasks: TechnicianTask[]
  selectedTaskId: string
  message: string
  onSelectTask: (taskId: string) => void
  onAcceptTask: (taskId: string) => void
  onMarkOnSite: (taskId: string) => void
  onStartTask: (taskId: string) => void
  onMarkDelayed: (taskId: string) => void
}

function TasksTab({
  tasks,
  selectedTaskId,
  message,
  onSelectTask,
  onAcceptTask,
  onMarkOnSite,
  onStartTask,
  onMarkDelayed,
}: TasksTabProps) {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TechnicianTask['status']>('all')

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const statusMatched = statusFilter === 'all' || task.status === statusFilter
        const searchMatched =
          searchText.trim() === '' ||
          task.id.toLowerCase().includes(searchText.toLowerCase()) ||
          task.title.toLowerCase().includes(searchText.toLowerCase()) ||
          task.location.toLowerCase().includes(searchText.toLowerCase())
        return statusMatched && searchMatched
      }),
    [searchText, statusFilter, tasks],
  )

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Daily Task Queue</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Priority-aware queue with one-click status transitions for field execution.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Assigned and Active Tasks</h3>
            <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-2.5 py-1 text-[10px] font-semibold text-[rgb(var(--color-text-secondary))]">
              {filteredTasks.length} of {tasks.length}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by task, location"
              className="min-w-52 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | TechnicianTask['status'])}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs"
            >
              <option value="all">All status</option>
              <option value="Assigned">Assigned</option>
              <option value="Accepted">Accepted</option>
              <option value="On Site">On Site</option>
              <option value="In Progress">In Progress</option>
              <option value="Closure Requested">Closure Requested</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>

          <div className="mt-3 space-y-2.5">
            {filteredTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onSelectTask(task.id)}
                className={[
                  'w-full rounded-2xl border p-3 text-left transition',
                  selectedTaskId === task.id
                    ? 'border-[rgb(var(--color-primary))/0.55] bg-[rgb(var(--color-primary))/0.08]'
                    : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[rgb(var(--color-text-secondary))]">{task.id}</p>
                  <div className="flex gap-2">
                    <span className={['rounded-full border px-2 py-1 text-[10px] font-semibold', taskPriorityTone[task.priority]].join(' ')}>{task.priority}</span>
                    <span className={['rounded-full border px-2 py-1 text-[10px] font-semibold', taskStatusTone[task.status]].join(' ')}>{task.status}</span>
                  </div>
                </div>
                <p className="mt-1 text-sm font-semibold text-[rgb(var(--color-text-primary))]">{task.title}</p>
                <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                  {task.category} | SLA {task.slaHoursLeft}h left | {task.location}
                </p>
              </button>
            ))}

            {filteredTasks.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
                No tasks match current search/filter.
              </p>
            ) : null}
          </div>
        </article>

        <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">Quick Actions</h3>
          <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">Selected task: {selectedTaskId || 'None'}</p>

          {selectedTask ? (
            <div className="mt-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
              <p className="font-semibold text-[rgb(var(--color-text-primary))]">{selectedTask.title}</p>
              <p className="mt-1">Schedule: {selectedTask.scheduledAt}</p>
              <p>Checklist: {selectedTask.checklistCompleted}/{selectedTask.checklistTotal}</p>
              <p>Proof uploaded: {selectedTask.proofUploaded ? 'Yes' : 'No'}</p>
            </div>
          ) : null}

          {message ? <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p> : null}

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => onAcceptTask(selectedTaskId)}
              className="rounded-lg bg-[rgb(var(--color-primary))] px-3 py-2 text-xs font-semibold text-white"
            >
              Accept Job
            </button>
            <button
              type="button"
              onClick={() => onMarkOnSite(selectedTaskId)}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs font-semibold"
            >
              Mark On Site
            </button>
            <button
              type="button"
              onClick={() => onStartTask(selectedTaskId)}
              className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-xs font-semibold"
            >
              Start Progress
            </button>
            <button
              type="button"
              onClick={() => onMarkDelayed(selectedTaskId)}
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
            >
              Mark Delayed
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}

export default TasksTab
