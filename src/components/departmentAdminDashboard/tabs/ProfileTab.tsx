type DepartmentProfile = {
  adminName: string
  departmentName: string
  email: string
  phone: string
  escalationWindow: string
}

type ProfileTabProps = {
  profile: DepartmentProfile
  emailAlerts: boolean
  slackAlerts: boolean
  message: string
  onProfileChange: (next: DepartmentProfile) => void
  onEmailAlertsChange: (value: boolean) => void
  onSlackAlertsChange: (value: boolean) => void
  onSave: () => void
  onReset: () => void
}

function ProfileTab({
  profile,
  emailAlerts,
  slackAlerts,
  message,
  onProfileChange,
  onEmailAlertsChange,
  onSlackAlertsChange,
  onSave,
  onReset,
}: ProfileTabProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Department Admin Profile</h2>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Configure notification channels, escalation policy, and identity details.
        </p>
      </header>

      <article className="rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Admin Name</label>
            <input
              value={profile.adminName}
              onChange={(event) => onProfileChange({ ...profile, adminName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Department</label>
            <input
              value={profile.departmentName}
              onChange={(event) => onProfileChange({ ...profile, departmentName: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Email</label>
            <input
              value={profile.email}
              onChange={(event) => onProfileChange({ ...profile, email: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Phone</label>
            <input
              value={profile.phone}
              onChange={(event) => onProfileChange({ ...profile, phone: event.target.value })}
              className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-secondary))]">Escalation Window</label>
          <input
            value={profile.escalationWindow}
            onChange={(event) => onProfileChange({ ...profile, escalationWindow: event.target.value })}
            className="mt-1 w-full rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
            <span>Email alerts</span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(event) => onEmailAlertsChange(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-primary))]"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-3 py-2 text-sm">
            <span>Slack alerts</span>
            <input
              type="checkbox"
              checked={slackAlerts}
              onChange={(event) => onSlackAlertsChange(event.target.checked)}
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
            Save Preferences
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] px-4 py-2 text-xs font-semibold"
          >
            Reset
          </button>
        </div>
      </article>
    </section>
  )
}

export default ProfileTab
