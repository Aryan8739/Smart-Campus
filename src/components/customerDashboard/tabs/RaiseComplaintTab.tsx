import type { Priority } from '../types'

type RaiseComplaintTabProps = {
  title: string
  category: string
  location: string
  priority: Priority
  description: string
  categoryOptions: string[]
  formError: string
  formMessage: string
  onTitleChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onPriorityChange: (value: Priority) => void
  onDescriptionChange: (value: string) => void
  onSubmit: () => void
  onClear: () => void
}

function RaiseComplaintTab({
  title,
  category,
  location,
  priority,
  description,
  categoryOptions,
  formError,
  formMessage,
  onTitleChange,
  onCategoryChange,
  onLocationChange,
  onPriorityChange,
  onDescriptionChange,
  onSubmit,
  onClear,
}: RaiseComplaintTabProps) {
  const descriptionCount = description.trim().length

  return (
    <section className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Raise a New Complaint</h2>
      <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
        Structured complaint intake with mandatory location, category, and actionable description.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Complaint title"
          className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
        />

        <input
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          placeholder="Campus location"
          className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
        />

        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
        >
          {categoryOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as Priority)}
          className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>

      <textarea
        rows={5}
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Describe the issue with all important details."
        className="mt-3 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2.5 text-sm"
      />
      <div className="mt-1 flex items-center justify-between text-[11px] text-[rgb(var(--color-text-secondary))]">
        <span>Tip: include block, room, and impact for faster assignment.</span>
        <span>{descriptionCount} chars</span>
      </div>

      {formError ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-danger))]">{formError}</p> : null}
      {formMessage ? <p className="mt-2 text-xs font-semibold text-[rgb(var(--color-success))]">{formMessage}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-xl bg-[rgb(var(--color-primary))] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[rgb(var(--color-primary-hover))]"
        >
          Submit Complaint
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-5 py-2.5 text-sm font-semibold text-[rgb(var(--color-text-primary))]"
        >
          Clear Form
        </button>
      </div>
    </section>
  )
}

export default RaiseComplaintTab
