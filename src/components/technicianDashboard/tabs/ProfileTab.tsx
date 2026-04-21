type TechnicianProfile = {
  technicianName: string
  specialization: string
  email: string
  phone: string
  shiftWindow: string
}

type ProfileTabProps = {
  profile: TechnicianProfile
  reminderAlerts: boolean
  delayAlerts: boolean
  message: string
  onProfileChange: (next: TechnicianProfile) => void
  onReminderAlertsChange: (value: boolean) => void
  onDelayAlertsChange: (value: boolean) => void
  onSave: () => void
  onReset: () => void
}

function ProfileTab({
  profile,
  reminderAlerts,
  delayAlerts,
  message,
  onProfileChange,
  onReminderAlertsChange,
  onDelayAlertsChange,
  onSave,
  onReset,
}: ProfileTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Technician Profile</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Maintain contact details, specialization profile, and notification preferences.
        </p>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="mb-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Alert Coverage: <span className="font-semibold text-[rgb(var(--color-text-primary))]">{reminderAlerts || delayAlerts ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Assignment Readiness: <span className="font-semibold text-[rgb(var(--color-success))]">Active</span>
          </div>
          <div className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] p-3 text-xs text-[rgb(var(--color-text-secondary))]">
            Shift Window: <span className="font-semibold text-[rgb(var(--color-text-primary))]">{profile.shiftWindow}</span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Technician Name
            </label>
            <input
              value={profile.technicianName}
              onChange={(event) => onProfileChange({ ...profile, technicianName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Specialization
            </label>
            <input
              value={profile.specialization}
              onChange={(event) => onProfileChange({ ...profile, specialization: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Email
            </label>
            <input
              value={profile.email}
              onChange={(event) => onProfileChange({ ...profile, email: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
              Phone
            </label>
            <input
              value={profile.phone}
              onChange={(event) => onProfileChange({ ...profile, phone: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">
            Shift Window
          </label>
          <input
            value={profile.shiftWindow}
            onChange={(event) => onProfileChange({ ...profile, shiftWindow: event.target.value })}
            className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
            <span>Progress reminder alerts</span>
            <input
              type="checkbox"
              checked={reminderAlerts}
              onChange={(event) => onReminderAlertsChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
            <span>Delay escalation alerts</span>
            <input
              type="checkbox"
              checked={delayAlerts}
              onChange={(event) => onDelayAlertsChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>
        </div>

        {message ? <p className="mt-3 text-xs font-semibold text-[rgb(var(--color-success))]">{message}</p> : null}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-[rgb(var(--color-primary))] px-4 py-2 text-xs font-semibold text-white"
          >
            Save Profile Settings
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-2 text-xs font-semibold"
          >
            Reset Changes
          </button>
        </div>
      </article>
    </section>
  )
}

export default ProfileTab
